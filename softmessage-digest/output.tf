
output "lb_address" {
    value = aws_lb.softmessage_digest_lb.dns_name
}
