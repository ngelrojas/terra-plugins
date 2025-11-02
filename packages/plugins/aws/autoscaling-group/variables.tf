variable "asg_name" {
  type        = string
  description = "Name of the Auto Scaling Group"
}

variable "launch_template_id" {
  type        = string
  description = "ID of the launch template"
}

variable "launch_template_version" {
  type        = string
  description = "Version of the launch template to use"
  default     = "$Latest"
}

variable "min_size" {
  type        = number
  description = "Minimum number of instances"
}

variable "max_size" {
  type        = number
  description = "Maximum number of instances"
}

variable "desired_capacity" {
  type        = number
  description = "Desired number of instances"
}

variable "vpc_zone_identifier" {
  type        = list(string)
  description = "List of subnet IDs to launch instances in"
}

variable "target_group_arns" {
  type        = list(string)
  description = "List of target group ARNs for load balancing"
  default     = []
}

variable "health_check_type" {
  type        = string
  description = "Type of health check (EC2 or ELB)"
  default     = "EC2"
}

variable "health_check_grace_period" {
  type        = number
  description = "Time in seconds after instance launch before starting health checks"
  default     = 300
}

variable "default_cooldown" {
  type        = number
  description = "Time in seconds between scaling activities"
  default     = 300
}

variable "termination_policies" {
  type        = list(string)
  description = "Policies for selecting instances to terminate"
  default     = ["Default"]
}