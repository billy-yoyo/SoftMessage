
resource "aws_sns_topic" "softmessage_message_topic" {
    name = "softmessage-message-topic"
}

resource "aws_sns_topic_subscription" "softmessage_message_topic_subscription" {
    topic_arn = aws_sns_topic.softmessage_message_topic.arn
    protocol  = "sqs"
    endpoint  = aws_sqs_queue.softmessage_message_queue.arn
}
