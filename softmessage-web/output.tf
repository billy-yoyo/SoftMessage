
output "lb_address" {
    value = aws_lb.softmessage_web_lb.dns_name
}
