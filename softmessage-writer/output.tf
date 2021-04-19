
output "lb_address" {
    value = aws_lb.softmessage_writer_lb.dns_name
}
