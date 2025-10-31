output "policy_arn" {
  value       = aws_iam_policy.this.arn
  description = "ARN of the IAM policy"
}

output "policy_id" {
  value       = aws_iam_policy.this.id
  description = "ID of the IAM policy"
}

output "policy_name" {
  value       = aws_iam_policy.this.name
  description = "Name of the IAM policy"
}

