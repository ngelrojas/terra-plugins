output "eip_id" {
  value       = aws_eip.this.id
  description = "ID of the Elastic IP"
}

output "public_ip" {
  value       = aws_eip.this.public_ip
  description = "Public IP address"
}

output "allocation_id" {
  value       = aws_eip.this.allocation_id
  description = "Allocation ID of the Elastic IP"
}
variable "eip_name" {
  type        = string
  description = "Name of the Elastic IP"
}

variable "instance_id" {
  type        = string
  description = "EC2 instance ID to associate with"
  default     = ""
}

variable "network_interface_id" {
  type        = string
  description = "Network interface ID to associate with"
  default     = ""
}
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
name: aws-elastic-ip
version: 0.1.0
provider: aws
description: Allocate Elastic IP
inputs:
  - name: eip_name
    type: string
  - name: instance_id
    type: string
    optional: true
  - name: network_interface_id
    type: string
    optional: true
outputs:
  - name: eip_id
  - name: public_ip
  - name: allocation_id
capabilities:
  - actor: instance-profile
    needs:
      - action: ec2:AllocateAddress
        resource: "*"
      - action: ec2:AssociateAddress
        resource: "*"
output "route_table_id" {
  value       = aws_route_table.this.id
  description = "ID of the route table"
}

output "route_table_arn" {
  value       = aws_route_table.this.arn
  description = "ARN of the route table"
}
variable "route_table_name" {
  type        = string
  description = "Name of the route table"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID where the route table will be created"
}

variable "gateway_id" {
  type        = string
  description = "Internet gateway ID for routing"
  default     = ""
}

variable "destination_cidr_block" {
  type        = string
  description = "Destination CIDR block for the route"
  default     = "0.0.0.0/0"
}
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_route_table" "this" {
  vpc_id = var.vpc_id

  tags = {
    Name      = var.route_table_name
    ManagedBy = "terra-plugins"
  }
}

resource "aws_route" "internet_access" {
  count                  = var.gateway_id != "" ? 1 : 0
  route_table_id         = aws_route_table.this.id
  destination_cidr_block = var.destination_cidr_block
  gateway_id             = var.gateway_id
}
name: aws-route-table
version: 0.1.0
provider: aws
description: Manage VPC routing
inputs:
  - name: route_table_name
    type: string
  - name: vpc_id
    type: string
  - name: gateway_id
    type: string
    optional: true
  - name: destination_cidr_block
    type: string
    optional: true
outputs:
  - name: route_table_id
  - name: route_table_arn
dependencies:
  - aws-vpc
  - aws-internet-gateway
capabilities:
  - actor: instance-profile
    needs:
      - action: ec2:CreateRouteTable
        resource: "*"
      - action: ec2:CreateRoute
        resource: "*"
name: aws-iam-role
version: 0.1.0
provider: aws
description: Create IAM Role with assume role policy
inputs:
  - name: role_name
    type: string
  - name: assume_role_policy
    type: string
outputs:
  - name: role_arn
  - name: role_name
  - name: role_id
capabilities:
  - actor: instance-profile
    needs:
      - action: iam:CreateRole
        resource: "*"
      - action: iam:GetRole
        resource: "*"

