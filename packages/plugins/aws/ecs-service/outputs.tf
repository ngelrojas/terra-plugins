output "service_id" {
  value       = aws_ecs_service.this.id
  description = "ID of the ECS service"
}

output "service_arn" {
  value       = aws_ecs_service.this.id
  description = "ARN of the ECS service"
}

output "service_name" {
  value       = aws_ecs_service.this.name
  description = "Name of the ECS service"
}

