variable "user_name" {
  type        = string
  description = "Name of the IAM user"
}

variable "create_access_key" {
  type        = bool
  description = "Whether to create access keys for the user"
  default     = false
}

