variable "eip_name" {
  type        = string
  description = "Name of the Elastic IP"
}

variable "instance_id" {
  type        = string
  description = "EC2 instance ID to associate with"
  default     = ""
}

variable "network_interface_id" {
  type        = string
  description = "Network interface ID to associate with"
  default     = ""
}
