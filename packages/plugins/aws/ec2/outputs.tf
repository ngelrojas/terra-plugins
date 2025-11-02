output "instance_id" {
  value       = aws_instance.this.id
  description = "ID of the EC2 instance"
}

output "instance_arn" {
  value       = aws_instance.this.arn
  description = "ARN of the EC2 instance"
}

output "private_ip" {
  value       = aws_instance.this.private_ip
  description = "Private IP address of the instance"
}

output "public_ip" {
  value       = aws_instance.this.public_ip
  description = "Public IP address of the instance"
}

output "public_dns" {
  value       = aws_instance.this.public_dns
  description = "Public DNS name of the instance"
}

output "private_dns" {
  value       = aws_instance.this.private_dns
  description = "Private DNS name of the instance"
}

