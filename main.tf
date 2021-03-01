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

module "softmessage_digest" {
    source = "./softmessage-digest"
    region = var.region

    queue_arn = aws_sqs_queue.softmessage_message_queue.arn
    db_endpoint = aws_db_instance.softmessage_db.endpoint
    db_user = aws_db_instance.softmessage_db.username
    db_password = aws_db_instance.softmessage_db.password
}

module "softmessage_web" {
    source = "./softmessage-web"
    region = var.region

    db_endpoint = aws_db_instance.softmessage_db.endpoint
    db_user = aws_db_instance.softmessage_db.username
    db_password = aws_db_instance.softmessage_db.password
}

module "softmessage_writer" {
    source = "./softmessage-writer"
    region = var.region

    topic_arn = aws_sns_topic.softmessage_message_topic.arn
    subnet_public_a_id = aws_subnet.public_a.id
    subnet_public_b_id = aws_subnet.public_b.id
    security_group_id = aws_security_group.softmessage_security_group.id
    ecs_role_arn = aws_iam_role.softmessage_ecs_role.arn
}

module "softmessage_api" {
    source = "./softmessage-api"
    region = var.region

    writer_ip = module.softmessage_writer.ip
    web_ip = module.softmessage_web.ip
}

