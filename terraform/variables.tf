variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type (free tier eligible)"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "Ubuntu AMI ID for us-east-1 (Ubuntu 22.04 LTS)"
  type        = string
  default     = "ami-0e2c8caa4b6378d8c"  # Ubuntu 22.04 LTS in us-east-1
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
  default     = "straycare-key"
}

variable "public_key_path" {
  description = "Path to SSH public key"
  type        = string
  default     = "~/.ssh/straycare-key.pub"
}