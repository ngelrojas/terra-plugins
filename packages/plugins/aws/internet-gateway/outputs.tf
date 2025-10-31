output "igw_id" {
  value       = aws_internet_gateway.this.id
  description = "ID of the internet gateway"
}

output "igw_arn" {
  value       = aws_internet_gateway.this.arn
  description = "ARN of the internet gateway"
}

