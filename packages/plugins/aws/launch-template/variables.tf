variable "template_name" {
  type        = string
  description = "Name of the launch template"
}

variable "ami" {
  type        = string
  description = "AMI ID to use for instances"
}

variable "instance_type" {
  type        = string
  description = "Instance type (e.g., t3.micro, t3.small)"
}

variable "key_name" {
  type        = string
  description = "SSH key pair name"
  default     = null
}

variable "vpc_security_group_ids" {
  type        = list(string)
  description = "List of security group IDs"
  default     = []
}

variable "user_data" {
  type        = string
  description = "User data script to run on instance launch"
  default     = null
}

variable "iam_instance_profile_arn" {
  type        = string
  description = "ARN of IAM instance profile"
  default     = null
}

variable "associate_public_ip_address" {
  type        = bool
  description = "Whether to associate a public IP address"
  default     = null
}

variable "block_device_mappings" {
  type        = any
  description = "Block device mappings for the launch template"
  default     = null
}

variable "device_name" {
  type        = any
  description = ""
  default     = null
}