variable "cluster_name" {
  type        = string
  description = "Name of the EKS cluster"
}
variable "role_arn" {
  type        = string
  description = "ARN of the IAM role for the EKS cluster"
}
variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs for the EKS cluster"
}
variable "security_group_ids" {
  type        = list(string)
  description = "List of security group IDs for the EKS cluster"
  default     = []
}
variable "endpoint_private_access" {
  type        = bool
  description = "Enable private API server endpoint"
  default     = true
}
variable "endpoint_public_access" {
  type        = bool
  description = "Enable public API server endpoint"
  default     = true
}
variable "public_access_cidrs" {
  type        = list(string)
  description = "List of CIDR blocks that can access the public endpoint"
  default     = ["0.0.0.0/0"]
}
variable "kubernetes_version" {
  type        = string
  description = "Kubernetes version to use for the EKS cluster"
  default     = null
}
variable "enabled_cluster_log_types" {
  type        = list(string)
  description = "List of control plane logging types to enable"
  default     = []
}
variable "encryption_config_key_arn" {
  type        = string
  description = "ARN of KMS key for envelope encryption of Kubernetes secrets"
  default     = null
}
