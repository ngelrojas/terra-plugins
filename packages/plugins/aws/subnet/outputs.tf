output "subnet_id" {
  value       = aws_subnet.this.id
  description = "ID of the subnet"
}

output "subnet_arn" {
  value       = aws_subnet.this.arn
  description = "ARN of the subnet"
}

output "subnet_cidr_block" {
  value       = aws_subnet.this.cidr_block
  description = "CIDR block of the subnet"
}

