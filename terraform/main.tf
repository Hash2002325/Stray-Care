terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.0"
}

provider "aws" {
  region = var.aws_region
}

# Create a security group for the EC2 instance
resource "aws_security_group" "straycare_sg" {
  name        = "straycare-security-group"
  description = "Security group for Stray Care application"

  # SSH access
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend API port
  ingress {
    description = "Backend API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend port
  ingress {
    description = "Frontend"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS (optional, for future)
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "straycare-sg"
  }
}

# Create SSH key pair
resource "aws_key_pair" "straycare_key" {
  key_name   = var.key_name
  public_key = file(var.public_key_path)
}

# Create EC2 instance
resource "aws_instance" "straycare_server" {
  ami           = var.ami_id
  instance_type = var.instance_type

  key_name               = aws_key_pair.straycare_key.key_name
  vpc_security_group_ids = [aws_security_group.straycare_sg.id]

  # Increase root volume size to 30GB (free tier eligible)
  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name = "straycare-server"
  }

  # Wait for instance to be ready
  provisioner "local-exec" {
    command = "echo 'EC2 Instance Created: ${self.public_ip}'"
  }
}