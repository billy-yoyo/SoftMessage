
resource "aws_subnet" "softmessage_db_subnet" {
  count                   = length(data.aws_availability_zones.available.names)
  vpc_id                  = aws_vpc.softmessage_vpc.id
  cidr_block              = "10.0.${3 + length(data.aws_availability_zones.available.names) + count.index}.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${element(data.aws_availability_zones.available.names, count.index)}"
}

resource "aws_db_subnet_group" "default" {
  name        = "${var.rds_instance_identifier}-subnet-group"
  subnet_ids  = aws_subnet.softmessage_db_subnet.*.id
}

resource "aws_security_group" "softmessage_db_security_group" {
  name        = "softmessage-db-security-group"
  vpc_id      = aws_vpc.softmessage_vpc.id
  # Keep the instance private by only allowing traffic from the web server.
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.softmessage_security_group.id]
  }
  # Allow all outbound traffic.
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "softmessage_db" {
  identifier             = var.rds_instance_identifier
  allocated_storage      = 5
  storage_type           = "gp2"
  engine                 = "postgres"
  engine_version         = "12.5"
  instance_class         = "db.t2.micro"
  name                   = "softmessagedb"
  username               = "softwire"
  port                   = "5432"
  password               = "jellyfish"
  db_subnet_group_name   = aws_db_subnet_group.default.id
  vpc_security_group_ids = [ aws_security_group.softmessage_db_security_group.id ]
  final_snapshot_identifier = "softmessage-db-snapshot"
}
