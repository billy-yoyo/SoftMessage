
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

variable "subnet_public_a_id" {
    type = string
}

variable "subnet_public_b_id" {
    type = string
}

variable "security_group_id" {
    type = string
}

variable "ecs_role_arn" {
    type = string
}
