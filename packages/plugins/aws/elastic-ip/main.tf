terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_eip" "this" {
  domain = "vpc"

  tags = {
    Name      = var.eip_name
    ManagedBy = "terra-plugins"
  }
}

resource "aws_eip_association" "this" {
  count                = var.instance_id != "" ? 1 : 0
  instance_id          = var.instance_id
  allocation_id        = aws_eip.this.id
}

resource "aws_eip_association" "eni" {
  count                = var.network_interface_id != "" ? 1 : 0
  network_interface_id = var.network_interface_id
  allocation_id        = aws_eip.this.id
}
