variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
}

variable "availability_zone" {
  description = "Availability Zone for subnet selection"
  type        = string
}

variable "sg_name" {
  description = "Name of the security group"
  type        = string
}

variable "sg_description" {
  description = "Description of the security group"
  type        = string
}

variable "ingress_rules" {
  description = "List of ingress rules"
  type = list(object({
    from_port   = number
    to_port     = number
    protocol    = string
    cidr_blocks = list(string)
  }))
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
}

variable "public_key_path" {
  description = "Path to public key file (.pub)"
  type        = string
}

variable "ami_id" {
  description = "AMI ID to launch EC2 instances"
  type        = string
}

variable "instance_type" {
  description = "EC2 Instance type"
  type        = string
}

variable "instance_names" {
  description = "List of EC2 instance names"
  type        = list(string)
}

variable "user_data" {
  description = "Optional User Data script"
  type        = string
  default     = ""
}

variable "root_volumes" {
  description = "List of root volumes per instance"
  type = list(object({
    volume_size = number
    volume_type = string
  }))
}
