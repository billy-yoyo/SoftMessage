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

module "softmessage_digest" {
  source = "./softmessage-digest"
  region = var.region
  account_id = var.account_id

  queue_name = aws_sqs_queue.softmessage_message_queue.name

  db_host = aws_db_instance.softmessage_db.address
  db_port = aws_db_instance.softmessage_db.port
  db_user = aws_db_instance.softmessage_db.username
  db_password = aws_db_instance.softmessage_db.password
  db_name = aws_db_instance.softmessage_db.name

  subnet_private_a_id = aws_subnet.private_a.id
  subnet_private_b_id = aws_subnet.private_b.id
  security_group_id = aws_security_group.softmessage_security_group.id
  ecs_role_arn = aws_iam_role.softmessage_ecs_role.arn
  vpc_id = aws_vpc.softmessage_vpc.id
  
  jwt_secret = var.jwt_secret
}

module "softmessage_web" {
  source = "./softmessage-web"
  region = var.region
  account_id = var.account_id

  db_host = aws_db_instance.softmessage_db.address
  db_port = aws_db_instance.softmessage_db.port
  db_user = aws_db_instance.softmessage_db.username
  db_password = aws_db_instance.softmessage_db.password
  db_name = aws_db_instance.softmessage_db.name

  subnet_private_a_id = aws_subnet.private_a.id
  subnet_private_b_id = aws_subnet.private_b.id
  security_group_id = aws_security_group.softmessage_security_group.id
  ecs_role_arn = aws_iam_role.softmessage_ecs_role.arn
  vpc_id = aws_vpc.softmessage_vpc.id
}

module "softmessage_writer" {
  source = "./softmessage-writer"
  region = var.region
  account_id = var.account_id

  topic_arn = aws_sns_topic.softmessage_message_topic.arn

  subnet_private_a_id = aws_subnet.private_a.id
  subnet_private_b_id = aws_subnet.private_b.id
  security_group_id = aws_security_group.softmessage_security_group.id
  ecs_role_arn = aws_iam_role.softmessage_ecs_role.arn
  vpc_id = aws_vpc.softmessage_vpc.id
}


module "softmessage_api" {
  source = "./softmessage-api"
  region = var.region
  account_id = var.account_id

  db_host = aws_db_instance.softmessage_db.address
  db_port = aws_db_instance.softmessage_db.port
  db_user = aws_db_instance.softmessage_db.username
  db_password = aws_db_instance.softmessage_db.password
  db_name = aws_db_instance.softmessage_db.name

  subnet_private_a_id = aws_subnet.private_a.id
  subnet_private_b_id = aws_subnet.private_b.id
  subnet_public_a_id = aws_subnet.public_a.id
  subnet_public_b_id = aws_subnet.public_b.id
  security_group_id = aws_security_group.softmessage_security_group.id
  lb_security_group_id = aws_security_group.softmessage_security_group_public.id
  ecs_role_arn = aws_iam_role.softmessage_ecs_role.arn
  vpc_id = aws_vpc.softmessage_vpc.id

  writer_address = module.softmessage_writer.lb_address
  web_address = module.softmessage_web.lb_address
  digest_address = module.softmessage_digest.lb_address

  jwt_secret = var.jwt_secret
}

