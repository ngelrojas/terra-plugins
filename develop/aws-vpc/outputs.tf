output "vpc_id" {
  value       = aws_vpc.this.id
  description = "ID of the VPC"
}

output "vpc_arn" {
  value       = aws_vpc.this.arn
  description = "ARN of the VPC"
}

output "vpc_cidr_block" {
  value       = aws_vpc.this.cidr_block
  description = "CIDR block of the VPC"
}

output "default_security_group_id" {
  value       = aws_vpc.this.default_security_group_id
  description = "ID of the default security group"
}

