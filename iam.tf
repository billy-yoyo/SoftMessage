
resource "aws_iam_role" "softmessage_ecs_role" {
  name = "softmessage-ecs-role"

  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "",
        "Effect": "Allow",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "softmessage_ecs_policy_attachment" {
  role = aws_iam_role.softmessage_ecs_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_policy" "softmessage_message_topic_policy" {
  name = "softmessage-message-topic-policy"
  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "SNS:Publish",
        "Resource": aws_sns_topic.softmessage_message_topic.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "softmessage_message_topic_policy_attachment" {
  role = aws_iam_role.softmessage_ecs_role.name
  policy_arn = aws_iam_policy.softmessage_message_topic_policy.arn
}

resource "aws_iam_policy" "softmessage_message_queue_policy" {
  name = "softmessage-message-queue-policy"
  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "SQS:ReceiveMessage",
          "SQS:DeleteMessage"
        ],
        "Resource": aws_sqs_queue.softmessage_message_queue.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "softmessage_message_queue_policy_attachment" {
  role = aws_iam_role.softmessage_ecs_role.name
  policy_arn = aws_iam_policy.softmessage_message_queue_policy.arn
}
