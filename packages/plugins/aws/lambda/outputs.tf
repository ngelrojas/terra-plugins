output "function_arn" {
  value       = aws_lambda_function.this.arn
  description = "ARN of the Lambda function"
}

output "function_name" {
  value       = aws_lambda_function.this.function_name
  description = "Name of the Lambda function"
}

output "invoke_arn" {
  value       = aws_lambda_function.this.invoke_arn
  description = "ARN to invoke the Lambda function"
}

output "qualified_arn" {
  value       = aws_lambda_function.this.qualified_arn
  description = "Qualified ARN of the Lambda function"
}

output "version" {
  value       = aws_lambda_function.this.version
  description = "Latest published version of the Lambda function"
}
variable "function_name" {
  type        = string
  description = "Name of the Lambda function"
}

variable "runtime" {
  type        = string
  description = "Runtime for the Lambda function (e.g., python3.11, nodejs20.x)"
}

variable "handler" {
  type        = string
  description = "Function handler (e.g., index.handler)"
}

variable "role_arn" {
  type        = string
  description = "ARN of the IAM role for the Lambda function"
}

variable "filename" {
  type        = string
  description = "Path to the function's deployment package within the local filesystem"
  default     = null
}

variable "s3_bucket" {
  type        = string
  description = "S3 bucket containing the function's deployment package"
  default     = null
}

variable "s3_key" {
  type        = string
  description = "S3 key of the function's deployment package"
  default     = null
}

variable "source_code_hash" {
  type        = string
  description = "Base64-encoded SHA256 hash of the package file"
  default     = null
}

variable "memory_size" {
  type        = number
  description = "Amount of memory in MB the Lambda function can use"
  default     = 128
}

variable "timeout" {
  type        = number
  description = "Amount of time in seconds the Lambda function has to run"
  default     = 3
}

variable "environment_variables" {
  type        = map(string)
  description = "Environment variables for the Lambda function"
  default     = null
}

variable "vpc_subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs for VPC configuration"
  default     = null
}

variable "vpc_security_group_ids" {
  type        = list(string)
  description = "List of security group IDs for VPC configuration"
  default     = null
}

variable "layers" {
  type        = list(string)
  description = "List of Lambda Layer ARNs"
  default     = null
}
name: aws/lambda
version: 0.1.0
provider: aws
description: Deploy Lambda functions
inputs:
  - name: function_name
    type: string
  - name: runtime
    type: string
  - name: handler
    type: string
  - name: role_arn
    type: string
  - name: filename
    type: string
    optional: true
  - name: s3_bucket
    type: string
    optional: true
  - name: s3_key
    type: string
    optional: true
  - name: source_code_hash
    type: string
    optional: true
  - name: memory_size
    type: number
    optional: true
  - name: timeout
    type: number
    optional: true
  - name: environment_variables
    type: map(string)
    optional: true
  - name: vpc_subnet_ids
    type: list(string)
    optional: true
  - name: vpc_security_group_ids
    type: list(string)
    optional: true
  - name: layers
    type: list(string)
    optional: true
outputs:
  - name: function_arn
  - name: function_name
  - name: invoke_arn
  - name: qualified_arn
  - name: version
capabilities:
  - actor: instance-profile
    needs:
      - action: lambda:CreateFunction
        resource: "*"
      - action: lambda:GetFunction
        resource: "*"
      - action: lambda:UpdateFunctionCode
        resource: "*"
      - action: iam:PassRole
        resource: "*"

