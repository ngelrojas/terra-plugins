resource "aws_dynamodb_table" "module_bi_dynamodb_locks" {
  name         = var.dynamodb_table_name
  billing_mode = var.billing_mode
  hash_key     = var.hash_key

  attribute {
    name = var.hash_key
    type = "S"
  }

  dynamic "point_in_time_recovery" {
    for_each = var.enable_point_in_time_recovery ? [1] : []
    content {
      enabled = true
    }
  }

  tags = {
    Name        = "module-bi-dynamodb-locks-${var.environment}"
    Environment = var.environment
  }
}