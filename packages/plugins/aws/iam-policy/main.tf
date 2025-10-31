terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_iam_policy" "this" {
  name        = var.policy_name
  description = "IAM policy created by terra-plugins"
  policy      = var.policy_document

  tags = {
    Name      = var.policy_name
    ManagedBy = "terra-plugins"
  }
}

resource "aws_iam_role_policy_attachment" "this" {
  count      = var.role_name != "" ? 1 : 0
  role       = var.role_name
  policy_arn = aws_iam_policy.this.arn
}

