output "sg_id" {
  value = module.sg.sg_id
}

output "instance_ids" {
  value = module.ec2.instance_ids
}

output "instance_public_ips" {
  value = module.ec2.public_ips
}

output "instance_names" {
  value = module.ec2.instance_names
}
