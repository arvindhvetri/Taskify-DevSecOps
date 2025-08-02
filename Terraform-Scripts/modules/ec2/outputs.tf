output "instance_ids" {
  value = aws_instance.this[*].id
}

output "public_ips" {
  value = aws_instance.this[*].public_ip
}

output "instance_names" {
  value = aws_instance.this[*].tags["Name"]
}
