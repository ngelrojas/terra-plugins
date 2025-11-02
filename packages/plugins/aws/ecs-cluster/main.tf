terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_ecs_cluster" "this" {
  name = var.cluster_name

  dynamic "setting" {
    for_each = var.enable_container_insights == true ? [1] : []
    content {
      name  = "containerInsights"
      value = "enabled"
    }
  }

  tags = {
    Name      = var.cluster_name
    ManagedBy = "terra-plugins"
  }
}

resource "aws_ecs_cluster_capacity_providers" "this" {
  count        = length(var.capacity_providers) > 0 ? 1 : 0
  cluster_name = aws_ecs_cluster.this.name

  capacity_providers = var.capacity_providers

  dynamic "default_capacity_provider_strategy" {
    for_each = var.default_capacity_provider_strategy != null ? var.default_capacity_provider_strategy : []
    content {
      capacity_provider = default_capacity_provider_strategy.value["capacity_provider"]
      weight            = lookup(default_capacity_provider_strategy.value, "weight", null)
      base              = lookup(default_capacity_provider_strategy.value, "base", null)
    }
  }
}

