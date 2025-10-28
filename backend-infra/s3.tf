resource "aws_s3_bucket" "module_bi_s3_locks" {
  bucket = var.s3_bucket_name

  tags = {
    Name        = "module-s3-locks-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "module_bi_s3_locks_versioning" {
  bucket = aws_s3_bucket.module_bi_s3_locks.id

  versioning_configuration {
    status = var.vc_status
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "module_bi_s3_locks_encryption" {
  bucket = aws_s3_bucket.module_bi_s3_locks.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = var.sse_algorithm
    }
  }
}

resource "aws_s3_bucket_public_access_block" "module_bi_s3_locks_public_access" {
  bucket                  = aws_s3_bucket.module_bi_s3_locks.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}