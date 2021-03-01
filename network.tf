resource "aws_vpc" "softmessage_vpc" {
    cidr_block = "10.0.0.0/16"
    enable_dns_hostnames = true
    enable_dns_support = true
}

resource "aws_subnet" "public_a" {
    vpc_id = aws_vpc.softmessage_vpc.id
    cidr_block = "10.0.1.0/24"
    availability_zone = "${var.region}a"
}

resource "aws_subnet" "public_b" {
    vpc_id = aws_vpc.softmessage_vpc.id
    cidr_block = "10.0.2.0/24"
    availability_zone = "${var.region}b"
}

resource "aws_internet_gateway" "internet_gateway" {
    vpc_id = aws_vpc.softmessage_vpc.id
}

resource "aws_route" "route" {
    route_table_id = aws_vpc.softmessage_vpc.main_route_table_id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
}

resource "aws_security_group" "softmessage_security_group" {
    name = "softmessage-security-group"
    description = "Allow TLS inbound traffic on port 80 (http)"
    vpc_id = aws_vpc.softmessage_vpc.id

    ingress {
        from_port = 80
        to_port = 3000
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_vpc_endpoint" "sns" {
    vpc_id = aws_vpc.softmessage_vpc.id
    service_name = "com.amazonaws.eu-west-1.sns"
    vpc_endpoint_type = "Interface"

    security_group_ids = [ 
        aws_security_group.softmessage_security_group.id
    ]
}

resource "aws_vpc_endpoint" "sqs" {
    vpc_id = aws_vpc.softmessage_vpc.id
    service_name = "com.amazonaws.eu-west-1.sqs"
    vpc_endpoint_type = "Interface"

    security_group_ids = [ 
        aws_security_group.softmessage_security_group.id
    ]
}
