
variable "region" {
    type = string
    default = "eu-west-1"
}

variable "account_id" {
    type = string
    default = "209209409693"
}

variable "rds_instance_identifier" {
    type = string
    default = "softmessage-db"
}

variable "db_username" {
    type = string
}

variable "db_password" {
    type = string
}

variable "jwt_secret" {
    type = string
}
