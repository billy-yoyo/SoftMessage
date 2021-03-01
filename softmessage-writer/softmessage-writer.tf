terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 2.70"
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
        "environment": [
          {
            "name": "topic_message",
            "value": "${var.topic_arn}"
          }
        ]
    }
]
EOT
}

resource "aws_ecs_cluster" "softmessage_writer_cluster" {
    name = "softmessage_writer_cluster"
}

resource "aws_ecs_service" "softmessage_writer_service" {
    name = "softmessage_writer_service"

    cluster = aws_ecs_cluster.softmessage_writer_cluster.id
    task_definition = aws_ecs_task_definition.softmessage_writer_task.arn

    launch_type = "FARGATE"
    desired_count = 1

    network_configuration {
        subnets = [var.subnet_public_a_id, var.subnet_public_b_id]
        security_groups = [var.security_group_id]
        assign_public_ip = true
    }
}
