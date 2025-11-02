terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_ecs_service" "this" {
  name                               = var.service_name
  cluster                            = var.cluster_arn
  task_definition                    = var.task_definition
  desired_count                      = var.desired_count
  launch_type                        = var.launch_type
  platform_version                   = var.platform_version
  health_check_grace_period_seconds  = var.health_check_grace_period_seconds
  enable_execute_command             = var.enable_execute_command

  dynamic "network_configuration" {
    for_each = var.subnets != null && var.security_groups != null ? [1] : []
    content {
      subnets          = var.subnets
      security_groups  = var.security_groups
      assign_public_ip = var.assign_public_ip
    }
  }

  dynamic "load_balancer" {
    for_each = var.load_balancer != null ? [var.load_balancer] : []
    content {
      target_group_arn = var.load_balancer.target_group_arn
      container_name   = var.load_balancer.container_name
      container_port   = var.load_balancer.container_port
    }
  }

  tags = {
    Name      = var.service_name
    ManagedBy = "terra-plugins"
  }
}

