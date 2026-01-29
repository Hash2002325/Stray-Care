output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.straycare_server.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.straycare_server.public_ip
}

output "instance_public_dns" {
  description = "Public DNS of the EC2 instance"
  value       = aws_instance.straycare_server.public_dns
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/straycare-key ubuntu@${aws_instance.straycare_server.public_ip}"
}