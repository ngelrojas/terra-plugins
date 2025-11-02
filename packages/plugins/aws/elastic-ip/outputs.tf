output "eip_id" {
  value       = aws_eip.this.id
  description = "ID of the Elastic IP"
}

output "public_ip" {
  value       = aws_eip.this.public_ip
  description = "Public IP address"
}

output "allocation_id" {
  value       = aws_eip.this.allocation_id
  description = "Allocation ID of the Elastic IP"
}
