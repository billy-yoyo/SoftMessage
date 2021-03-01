
resource "aws_sqs_queue" "softmessage_message_queue_deadletter" {
    name = "softmessage-message-queue-deadletter"
}

resource "aws_sqs_queue" "softmessage_message_queue" {
    name           = "softmessage-message-queue"
    redrive_policy = jsonencode({
        deadLetterTargetArn = aws_sqs_queue.softmessage_message_queue_deadletter.arn,
        maxReceiveCount     = 3
    })
}

resource "aws_sqs_queue_policy" "softmessage_message_queue_policy" {
    queue_url = aws_sqs_queue.softmessage_message_queue.id

    policy = jsonencode({
        "Version": "2012-10-17",
        "Id": "sqspolicy",
        "Statement": [
            {
                "Sid": "First",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "sqs:SendMessage",
                "Resource": aws_sqs_queue.softmessage_message_queue.arn,
                "Condition": {
                    "ArnEquals": {
                        "aws:SourceArn": aws_sns_topic.softmessage_message_topic.arn
                    }
                }
            }
        ]
    })
}
