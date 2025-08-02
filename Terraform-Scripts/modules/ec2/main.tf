resource "aws_instance" "this" {
  count                     = length(var.instance_names)
  ami                       = var.ami_id
  instance_type             = var.instance_type
  subnet_id                 = var.subnet_id
  vpc_security_group_ids    = [var.security_group_id]
  key_name                  = var.key_name
  associate_public_ip_address = true

  tags = {
    Name = var.instance_names[count.index]
  }

  user_data = var.user_data != "" ? var.user_data : null

  root_block_device {
    volume_size = var.root_volumes[count.index].volume_size
    volume_type = var.root_volumes[count.index].volume_type
  }
}
