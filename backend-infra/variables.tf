variable "aws_region" {
  description = "The AWS region to create resources in."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The environment to create resources in."
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Module backend infrastructure."
  type        = string
  default     = "module-backend-infra"
}

variable "s3_bucket_name" {
  description = "module bucket s3 for backend infrastructure."
  type        = string
  default     = "module-backend-infra-s3"
}

variable "dynamodb_table_name" {
  description = "Module DynamoDB table for backend infrastructure to lock."
  type        = string
  default     = "module-backend-infra-dynamodb"
}

variable "enable_point_in_time_recovery" {
  description = "Enable point in time recovery for the DynamoDB table."
  type        = bool
  default     = true
}

variable "hash_key" {
  description = "hash key for DynamoDB table."
  type        = string
  default     = "LockID"
}

variable "billing_mode" {
  description = "Billing mode for DynamoDB table."
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "sse_algorithm" {
  description = "Encryption by default for S3 bucket."
  type        = string
  default     = "AES256"
}

variable "vc_status" {
  description = "versioning configuration status for S3 bucket."
  type        = string
  default     = "Enabled"
}

variable "module_name"{
    description = "Module name for tagging."
    type        = string
    default     = "backend-infra"
}