variable "instance_name" {
  type        = string
  description = "Name tag for the EC2 instance"
}

variable "ami" {
  type        = string
  description = "AMI ID to use for the instance"
}

variable "instance_type" {
  type        = string
  description = "Instance type (e.g., t3.micro, t3.small)"
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID where the instance will be launched"
}

variable "vpc_security_group_ids" {
  type        = list(string)
  description = "List of security group IDs to assign to the instance"
}

variable "key_name" {
  type        = string
  description = "SSH key pair name"
  default     = null
}

variable "associate_public_ip_address" {
  type        = bool
  description = "Whether to associate a public IP address"
  default     = false
}

variable "user_data" {
  type        = string
  description = "User data script to run on instance launch"
  default     = null
}

variable "iam_instance_profile" {
  type        = string
  description = "IAM instance profile name"
  default     = null
}

variable "root_volume_size" {
  type        = number
  description = "Size of the root volume in GB"
  default     = 8
}

variable "root_volume_type" {
  type        = string
  description = "Type of root volume (gp3, gp2, io1, etc.)"
  default     = "gp3"
}