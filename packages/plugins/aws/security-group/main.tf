terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_security_group" "this" {
  name        = var.security_group_name
  description = var.description
  vpc_id      = var.vpc_id

  tags = {
    Name      = var.security_group_name
    ManagedBy = "terra-plugins"
  }
}

# Default egress rule - allow all outbound traffic
resource "aws_security_group_rule" "egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.this.id
}

