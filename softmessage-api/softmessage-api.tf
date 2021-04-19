terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.33.0"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = var.region
}

resource "aws_ecr_repository" "softmessage_api_repo" {
    name = "softmessage-api-repo"
}

resource "aws_cloudwatch_log_group" "softmessage_api_log_group" {
  name = "softmessage-api"
}

resource "aws_ecs_task_definition" "softmessage_api_task" {
    family = "softmessage_api_family"

    requires_compatibilities = ["FARGATE"]
    network_mode = "awsvpc"

    // Valid sizes are shown here: https://aws.amazon.com/fargate/pricing/
    memory = "512"
    cpu = "256"

    // Fargate requires task definitions to have an execution role ARN to support ECR images
    execution_role_arn = var.ecs_role_arn
    task_role_arn = var.ecs_role_arn

    container_definitions = <<EOT
[
    {
        "name": "softmessage_api_container",
        "image": "209209409693.dkr.ecr.eu-west-1.amazonaws.com/softmessage-api-repo:latest",
        "memory": 512,
        "essential": true,
        "portMappings": [
            {
                "containerPort": 80,
                "hostPort": 80
            }
        ],
        "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
            "awslogs-group": "softmessage-api",
            "awslogs-region": "${var.region}",
            "awslogs-stream-prefix": "ecs"
          }
        },
        "environment": [
          {
            "name": "PGUSER",
            "value": "${var.db_user}"
          },
          {
            "name": "PGHOST",
            "value": "${var.db_host}"
          },
          {
            "name": "PGPASSWORD",
            "value": "${var.db_password}"
          },
          {
            "name": "PGDATABASE",
            "value": "${var.db_name}"
          },
          {
            "name": "PGPORT",
            "value": "${var.db_port}"
          },
          {
            "name": "JWT_SECRET",
            "value": "${var.jwt_secret}"
          },
          {
            "name": "WEB_ADDRESS",
            "value": "${var.web_address}"
          },
          {
            "name": "WRITER_ADDRESS",
            "value": "${var.writer_address}"
          },
          {
            "name": "DIGEST_ADDRESS",
            "value": "${var.digest_address}"
          }
        ]
    }
]
EOT
}

resource "aws_ecs_cluster" "softmessage_api_cluster" {
    name = "softmessage_api_cluster"
}

resource "aws_lb" "softmessage_api_lb" {
  name = "softmessage-api-lb"
  internal = false
  load_balancer_type = "application"
  subnets = [var.subnet_public_a_id, var.subnet_public_b_id]
  security_groups = [var.lb_security_group_id]
}

resource "aws_lb_target_group" "softmessage_api_target_group" {
  name = "softmessage-api-target-group"
  port = 80
  protocol = "HTTP"
  target_type = "ip"
  vpc_id = var.vpc_id

  health_check {
    enabled = true
    port = 80
    path = "/health"
  }

  depends_on = [ "aws_lb.softmessage_api_lb" ]
}

resource "aws_alb_listener" "softmessage_api_alb_listener" {
  load_balancer_arn = aws_lb.softmessage_api_lb.arn
  port = 80
  protocol = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.softmessage_api_target_group.arn
    type = "forward"
  }
}

resource "aws_ecs_service" "softmessage_api_service" {
    name = "softmessage_api_service"

    cluster = aws_ecs_cluster.softmessage_api_cluster.id
    task_definition = aws_ecs_task_definition.softmessage_api_task.arn

    launch_type = "FARGATE"
    desired_count = 1

    network_configuration {
        subnets = [var.subnet_private_a_id, var.subnet_private_b_id]
        security_groups = [var.security_group_id]
        assign_public_ip = true
    }

    load_balancer {
      target_group_arn = aws_lb_target_group.softmessage_api_target_group.arn
      container_name = "softmessage_api_container"
      container_port = 80
    }

    depends_on = [ "aws_lb_target_group.softmessage_api_target_group" ]
}
