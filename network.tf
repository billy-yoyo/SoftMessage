

resource "aws_vpc" "softmessage_vpc" {
    cidr_block = "10.0.0.0/16"
    enable_dns_hostnames = true
    enable_dns_support = true
}

resource "aws_subnet" "private_a" {
    vpc_id = aws_vpc.softmessage_vpc.id
    cidr_block = "10.0.1.0/24"
    availability_zone = "${var.region}a"
}

resource "aws_subnet" "private_b" {
    vpc_id = aws_vpc.softmessage_vpc.id
    cidr_block = "10.0.2.0/24"
    availability_zone = "${var.region}b"
}

resource "aws_subnet" "public_a" {
    vpc_id = aws_vpc.softmessage_vpc.id
    cidr_block = "10.0.3.0/24"
    availability_zone = "${var.region}a"
    map_public_ip_on_launch = true
}

resource "aws_subnet" "public_b" {
    vpc_id = aws_vpc.softmessage_vpc.id
    cidr_block = "10.0.4.0/24"
    availability_zone = "${var.region}b"
    map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "public" {
  vpc_id = aws_vpc.softmessage_vpc.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.softmessage_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.public.id
  }
}

resource "aws_route_table_association" "public_a" {
  subnet_id = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

resource "aws_eip" "nat_gateway_a" {
    vpc = true
}

resource "aws_eip" "nat_gateway_b" {
    vpc = true
}

resource "aws_nat_gateway" "nat_gateway_a" {
    allocation_id = aws_eip.nat_gateway_a.id
    subnet_id = aws_subnet.public_a.id
}

resource "aws_nat_gateway" "nat_gateway_b" {
    allocation_id = aws_eip.nat_gateway_b.id
    subnet_id = aws_subnet.public_b.id
}

resource "aws_route_table" "nat_gateway_a" {
    vpc_id = aws_vpc.softmessage_vpc.id
    route {
        cidr_block = "0.0.0.0/0"
        nat_gateway_id = aws_nat_gateway.nat_gateway_a.id
    }
}

resource "aws_route_table" "nat_gateway_b" {
    vpc_id = aws_vpc.softmessage_vpc.id
    route {
        cidr_block = "0.0.0.0/0"
        nat_gateway_id = aws_nat_gateway.nat_gateway_b.id
    }
}

resource "aws_route_table_association" "nat_gateway_a" {
    subnet_id = aws_subnet.private_a.id
    route_table_id = aws_route_table.nat_gateway_a.id
}

resource "aws_route_table_association" "nat_gateway_b" {
    subnet_id = aws_subnet.private_b.id
    route_table_id = aws_route_table.nat_gateway_b.id
}

resource "aws_security_group" "softmessage_security_group" {
    name = "softmessage-security-group"
    vpc_id = aws_vpc.softmessage_vpc.id

    ingress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_security_group" "softmessage_security_group_public" {
    name = "softmessage-security-group-public"
    vpc_id = aws_vpc.softmessage_vpc.id

    ingress {
        from_port = 0
        to_port = 0
        protocol = "-1"
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
    service_name = "com.amazonaws.${var.region}.sns"
    vpc_endpoint_type = "Interface"

    security_group_ids = [ 
        aws_security_group.softmessage_security_group.id
    ]
}

resource "aws_vpc_endpoint" "sqs" {
    vpc_id = aws_vpc.softmessage_vpc.id
    service_name = "com.amazonaws.${var.region}.sqs"
    vpc_endpoint_type = "Interface"

    security_group_ids = [ 
        aws_security_group.softmessage_security_group.id
    ]
}

resource "aws_vpc_endpoint" "s3" {
    vpc_id = aws_vpc.softmessage_vpc.id
    service_name = "com.amazonaws.${var.region}.s3"
    vpc_endpoint_type = "Interface"

    security_group_ids = [ 
        aws_security_group.softmessage_security_group.id
    ]
}

resource "aws_vpc_endpoint" "ecr_dkr" {
    vpc_id = aws_vpc.softmessage_vpc.id
    service_name = "com.amazonaws.${var.region}.ecr.dkr"
    vpc_endpoint_type = "Interface"

    security_group_ids = [ 
        aws_security_group.softmessage_security_group.id
    ]
}

resource "aws_vpc_endpoint" "ecr_api" {
    vpc_id = aws_vpc.softmessage_vpc.id
    service_name = "com.amazonaws.${var.region}.ecr.api"
    vpc_endpoint_type = "Interface"

    security_group_ids = [ 
        aws_security_group.softmessage_security_group.id
    ]
}

resource "aws_vpc_endpoint" "logs" {
    vpc_id = aws_vpc.softmessage_vpc.id
    service_name = "com.amazonaws.${var.region}.logs"
    vpc_endpoint_type = "Interface"

    security_group_ids = [ 
        aws_security_group.softmessage_security_group.id
    ]
}

resource "aws_vpc_endpoint" "ssm" {
    vpc_id = aws_vpc.softmessage_vpc.id
    service_name = "com.amazonaws.${var.region}.ssm"
    vpc_endpoint_type = "Interface"

    security_group_ids = [ 
        aws_security_group.softmessage_security_group.id
    ]
}

resource "aws_vpc_endpoint" "secretsmanager" {
    vpc_id = aws_vpc.softmessage_vpc.id
    service_name = "com.amazonaws.${var.region}.secretsmanager"
    vpc_endpoint_type = "Interface"

    security_group_ids = [ 
        aws_security_group.softmessage_security_group.id
    ]
}
