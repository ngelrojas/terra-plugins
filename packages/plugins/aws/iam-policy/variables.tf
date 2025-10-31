variable "policy_name" {
  type        = string
  description = "Name of the IAM policy"
}

variable "policy_document" {
  type        = string
  description = "JSON policy document"
}

variable "role_name" {
  type        = string
  description = "Optional IAM role name to attach policy to"
  default     = ""
}

