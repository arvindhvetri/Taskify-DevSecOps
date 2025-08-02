variable "ami_id" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "security_group_id" {
  type = string
}

variable "key_name" {
  type = string
}

variable "instance_names" {
  type = list(string)
}

variable "user_data" {
  type    = string
  default = ""
}

variable "root_volumes" {
  type = list(object({
    volume_size = number
    volume_type = string
  }))
}
