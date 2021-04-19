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

resource "aws_ecr_repository" "softmessage_writer_repo" {
    name = "softmessage-writer-repo"
}

resource "aws_cloudwatch_log_group" "softmessage_writer_log_group" {
  name = "softmessage-writer"
}

resource "aws_ecs_task_definition" "softmessage_writer_task" {
    family = "softmessage_writer_family"

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
        "name": "softmessage_writer_container",
        "image": "209209409693.dkr.ecr.eu-west-1.amazonaws.com/softmessage-writer-repo:latest",
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
            "awslogs-group": "softmessage-writer",
            "awslogs-region": "${var.region}",
            "awslogs-stream-prefix": "ecs"
          }
        },
        "environment": [
          {
            "name": "topic_message",
            "value": "${var.topic_arn}"
          },
          {
            "name": "region",
            "value": "${var.region}"
          }
        ]
    }
]
EOT
}

resource "aws_ecs_cluster" "softmessage_writer_cluster" {
    name = "softmessage_writer_cluster"
}

resource "aws_lb" "softmessage_writer_lb" {
  name = "softmessage-writer-lb"
  internal = true
  load_balancer_type = "application"
  subnets = [var.subnet_private_a_id, var.subnet_private_b_id]
  security_groups = [var.security_group_id]
}

resource "aws_lb_target_group" "softmessage_writer_target_group" {
  name = "softmessage-writer-target-group"
  port = 3000
  protocol = "HTTP"
  target_type = "ip"
  vpc_id = var.vpc_id

  health_check {
    enabled = true
    port = 3000
    path = "/health"
  }

  depends_on = [ "aws_lb.softmessage_writer_lb" ]
}

resource "aws_alb_listener" "softmessage_writer_alb_listener" {
  load_balancer_arn = aws_lb.softmessage_writer_lb.arn
  port = 3000
  protocol = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.softmessage_writer_target_group.arn
    type = "forward"
  }
}


resource "aws_ecs_service" "softmessage_writer_service" {
    name = "softmessage_writer_service"

    cluster = aws_ecs_cluster.softmessage_writer_cluster.id
    task_definition = aws_ecs_task_definition.softmessage_writer_task.arn

    launch_type = "FARGATE"
    desired_count = 1

    network_configuration {
        subnets = [var.subnet_private_a_id, var.subnet_private_b_id]
        security_groups = [var.security_group_id]
        assign_public_ip = false
    }

    load_balancer {
      target_group_arn = aws_lb_target_group.softmessage_writer_target_group.arn
      container_name = "softmessage_writer_container"
      container_port = 3000
    }

    depends_on = [ "aws_lb_target_group.softmessage_writer_target_group" ]
}
