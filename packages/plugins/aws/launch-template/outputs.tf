output "launch_template_id" {
  value       = aws_launch_template.this.id
  description = "ID of the launch template"
}

output "launch_template_arn" {
  value       = aws_launch_template.this.arn
  description = "ARN of the launch template"
}

output "launch_template_name" {
  value       = aws_launch_template.this.name
  description = "Name of the launch template"
}

output "latest_version" {
  value       = aws_launch_template.this.latest_version
  description = "Latest version of the launch template"
}

