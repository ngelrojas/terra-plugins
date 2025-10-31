variable "igw_name" {
  type        = string
  description = "Name of the internet gateway"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID to attach the internet gateway to"
}

