output "security_group_id" {
  value       = aws_security_group.this.id
  description = "ID of the security group"
}

output "security_group_arn" {
  value       = aws_security_group.this.arn
  description = "ARN of the security group"
}

output "security_group_name" {
  value       = aws_security_group.this.name
  description = "Name of the security group"
}

