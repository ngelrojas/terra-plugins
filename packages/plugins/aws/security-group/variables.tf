variable "security_group_name" {
  type        = string
  description = "Name of the security group"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID where the security group will be created"
}

variable "description" {
  type        = string
  description = "Description of the security group"
  default     = "Managed by terra-plugins"
}

