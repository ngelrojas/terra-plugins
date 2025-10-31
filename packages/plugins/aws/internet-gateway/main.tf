terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = var.vpc_id

  tags = {
    Name      = var.igw_name
    ManagedBy = "terra-plugins"
  }
}

