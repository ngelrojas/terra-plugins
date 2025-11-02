variable "cluster_name" {
  type        = string
  description = "Name of the ECS cluster"
}

variable "capacity_providers" {
  type        = list(string)
  description = "List of capacity providers (e.g., FARGATE, FARGATE_SPOT)"
  default     = []
}

variable "default_capacity_provider_strategy" {
  type        = any
  description = "Default capacity provider strategy for the cluster"
  default     = null
}

variable "enable_container_insights" {
  type        = bool
  description = "Enable CloudWatch Container Insights"
  default     = false
}