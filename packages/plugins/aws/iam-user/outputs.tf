output "user_arn" {
  value       = aws_iam_user.this.arn
  description = "ARN of the IAM user"
}

output "user_name" {
  value       = aws_iam_user.this.name
  description = "Name of the IAM user"
}

output "access_key_id" {
  value       = var.create_access_key ? aws_iam_access_key.this[0].id : ""
  description = "Access key ID (if created)"
  sensitive   = true
}

output "secret_access_key" {
  value       = var.create_access_key ? aws_iam_access_key.this[0].secret : ""
  description = "Secret access key (if created)"
  sensitive   = true
}

