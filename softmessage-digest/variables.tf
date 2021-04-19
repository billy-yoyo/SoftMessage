
variable "region" {
    type = string
}

variable "account_id" {
    type = string
}

variable "db_host" {
    type = string
}

variable "db_port" {
    type = string
}

variable "db_name" { 
    type = string
}

variable "db_user" {
    type = string
}

variable "db_password" {
    type = string
}

variable "queue_name" {
    type = string
}

variable "subnet_private_a_id" {
    type = string
}

variable "subnet_private_b_id" {
    type = string
}

variable "security_group_id" {
    type = string
}

variable "ecs_role_arn" {
    type = string
}

variable "vpc_id" {
    type = string
}

variable "jwt_secret" {
    type = string
}
