output "asg_id" {
  value       = aws_autoscaling_group.this.id
  description = "ID of the Auto Scaling Group"
}

output "asg_arn" {
  value       = aws_autoscaling_group.this.arn
  description = "ARN of the Auto Scaling Group"
}

output "asg_name" {
  value       = aws_autoscaling_group.this.name
  description = "Name of the Auto Scaling Group"
}
