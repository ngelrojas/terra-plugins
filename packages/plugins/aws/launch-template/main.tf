terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_launch_template" "this" {
  name          = var.template_name
  image_id      = var.ami
  instance_type = var.instance_type
  key_name      = var.key_name
  user_data     = var.user_data != null ? base64encode(var.user_data) : null

  dynamic "iam_instance_profile" {
    for_each = var.iam_instance_profile_arn != null ? [1] : []
    content {
      arn = var.iam_instance_profile_arn
    }
  }

  dynamic "network_interfaces" {
    for_each = var.associate_public_ip_address != null || length(var.vpc_security_group_ids) > 0 ? [1] : []
    content {
      associate_public_ip_address = var.associate_public_ip_address
      security_groups             = var.vpc_security_group_ids
      delete_on_termination       = true
    }
  }

  dynamic "block_device_mappings" {
    for_each = var.block_device_mappings != null ? var.block_device_mappings : []
    content {
      device_name = var.device_name

      ebs {
        volume_size           = lookup(block_device_mappings.value, "volume_size", 8)
        volume_type           = lookup(block_device_mappings.value, "volume_type", "gp3")
        delete_on_termination = lookup(block_device_mappings.value, "delete_on_termination", true)
        encrypted             = lookup(block_device_mappings.value, "encrypted", false)
      }
    }
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name      = var.template_name
      ManagedBy = "terra-plugins"
    }
  }

  tags = {
    Name      = var.template_name
    ManagedBy = "terra-plugins"
  }
}
