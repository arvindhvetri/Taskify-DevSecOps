module "sg" {
  source          = "./modules/sg"
  sg_name         = var.sg_name
  sg_description  = var.sg_description
  vpc_id          = data.aws_vpc.default.id
  ingress_rules   = var.ingress_rules
}

module "key_pair" {
  source           = "./modules/key_pair"
  key_name         = var.key_name
  public_key_path  = var.public_key_path
}

module "ec2" {
  source              = "./modules/ec2"
  ami_id              = var.ami_id
  instance_type       = var.instance_type
  subnet_id           = data.aws_subnet.default.id  # <<< Change here
  security_group_id   = module.sg.sg_id
  key_name            = var.key_name
  instance_names      = var.instance_names
  user_data           = var.user_data
  root_volumes        = var.root_volumes
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnet" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }

  filter {
    name   = "default-for-az"
    values = ["true"]
  }

  availability_zone = var.availability_zone
}