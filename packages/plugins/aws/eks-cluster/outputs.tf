output "cluster_id" {
  value       = aws_eks_cluster.this.id
  description = "ID of the EKS cluster"
}

output "cluster_arn" {
  value       = aws_eks_cluster.this.arn
  description = "ARN of the EKS cluster"
}

output "cluster_endpoint" {
  value       = aws_eks_cluster.this.endpoint
  description = "Endpoint for the EKS cluster API server"
}

output "cluster_certificate_authority_data" {
  value       = aws_eks_cluster.this.certificate_authority[0].data
  description = "Base64 encoded certificate data for cluster authentication"
}

output "cluster_security_group_id" {
  value       = aws_eks_cluster.this.vpc_config[0].cluster_security_group_id
  description = "Security group ID attached to the EKS cluster"
}

output "cluster_version" {
  value       = aws_eks_cluster.this.version
  description = "Kubernetes version of the cluster"
}

