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

resource "aws_ecr_repository" "softmessage_digest_repo" {
    name = "softmessage-digest-repo"
}

resource "aws_cloudwatch_log_group" "softmessage_digest_log_group" {
  name = "softmessage-digest"
}

resource "aws_ecs_task_definition" "softmessage_digest_task" {
    family = "softmessage_digest_family"

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
        "name": "softmessage_digest_container",
        "image": "209209409693.dkr.ecr.eu-west-1.amazonaws.com/softmessage-digest-repo:latest",
        "memory": 512,
        "essential": true,
        "portMappings": [
            {
                "containerPort": 3000,
                "hostPort": 3000
            }
        ],
        "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
            "awslogs-group": "softmessage-digest",
            "awslogs-region": "${var.region}",
            "awslogs-stream-prefix": "ecs"
          }
        },
        "environment": [
          {
            "name": "queue_name",
            "value": "${var.queue_name}"
          },
          {
            "name": "region",
            "value": "${var.region}"
          },
          {
            "name": "account_id",
            "value": "${var.account_id}"
          },
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
          }
        ]
    }
]
EOT
}

resource "aws_ecs_cluster" "softmessage_digest_cluster" {
    name = "softmessage_digest_cluster"
}

resource "aws_lb" "softmessage_digest_lb" {
  name = "softmessage-digest-lb"
  internal = true
  load_balancer_type = "application"
  subnets = [var.subnet_private_a_id, var.subnet_private_b_id]
  security_groups = [var.security_group_id]
}

resource "aws_lb_target_group" "softmessage_digest_target_group" {
  name = "softmessage-digest-target-group"
  port = 3000
  protocol = "HTTP"
  target_type = "ip"
  vpc_id = var.vpc_id

  health_check {
    enabled = true
    port = 3000
    path = "/health"
  }

  depends_on = [ "aws_lb.softmessage_digest_lb" ]
}

resource "aws_alb_listener" "softmessage_digest_alb_listener" {
  load_balancer_arn = aws_lb.softmessage_digest_lb.arn
  port = 3000
  protocol = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.softmessage_digest_target_group.arn
    type = "forward"
  }
}


resource "aws_ecs_service" "softmessage_digest_service" {
    name = "softmessage_digest_service"

    cluster = aws_ecs_cluster.softmessage_digest_cluster.id
    task_definition = aws_ecs_task_definition.softmessage_digest_task.arn

    launch_type = "FARGATE"
    desired_count = 1

    network_configuration {
        subnets = [var.subnet_private_a_id, var.subnet_private_b_id]
        security_groups = [var.security_group_id]
        assign_public_ip = false
    }

    load_balancer {
      target_group_arn = aws_lb_target_group.softmessage_digest_target_group.arn
      container_name = "softmessage_digest_container"
      container_port = 3000
    }

    depends_on = [ "aws_lb_target_group.softmessage_digest_target_group" ]
}
