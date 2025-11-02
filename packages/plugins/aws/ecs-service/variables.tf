variable "service_name" {
  type        = string
  description = "Name of the ECS service"
}

variable "cluster_arn" {
  type        = string
  description = "ARN of the ECS cluster"
}

variable "task_definition" {
  type        = string
  description = "Task definition ARN or family:revision"
}

variable "desired_count" {
  type        = number
  description = "Desired number of tasks"
}

variable "launch_type" {
  type        = string
  description = "Launch type (EC2, FARGATE, or EXTERNAL)"
  default     = "FARGATE"
}

variable "platform_version" {
  type        = string
  description = "Platform version for Fargate tasks"
  default     = "LATEST"
}

variable "network_mode" {
  type        = string
  description = "Docker networking mode (bridge, host, awsvpc, none)"
  default     = null
}

variable "subnets" {
  type        = list(string)
  description = "List of subnet IDs for network configuration"
  default     = null
}

variable "security_groups" {
  type        = list(string)
  description = "List of security group IDs for network configuration"
  default     = null
}

variable "assign_public_ip" {
  type        = bool
  description = "Assign public IP to tasks"
  default     = false
}

variable "load_balancer" {
  type        = any
  description = "Load balancer configuration"
  default     = null
}

variable "health_check_grace_period_seconds" {
  type        = number
  description = "Grace period for health check (when using load balancer)"
  default     = null
}

variable "enable_execute_command" {
  type        = bool
  description = "Enable ECS Exec for debugging"
  default     = false
}