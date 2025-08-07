# Taskify DevSecOps - Infrastructure Setup

This guide will help you set up the infrastructure for the Taskify project using **Terraform**, **AWS CLI**, and **Ansible**.

---

## 🧱 Step-by-Step Setup Guide

### ✅ Step 1: Install Terraform & Ansible.
Install the latest version of Terraform and Ansible.

### ✅ Step 2: Install AWS CLI.
Install and configure AWS CLI:
```bash
sudo apt install awscli
aws configure
```

Provide your:
- AWS Access Key
- AWS Secret Access Key

### ✅ Step 3: Clone Repository.
Clone the specific Infra branch:
```bash
git clone --branch Infra https://github.com/arvindhvetri/Taskify-DevSecOps.git
```

### ✅ Step 4: Generate SSH Keys.
Create a keys folder inside Terraform-Scripts and generate an RSA key:
```bash
cd Taskify-DevSecOps/Terraform-Scripts
mkdir keys
ssh-keygen -t rsa -b 4096 -m PEM -f keys/tasky-key
```
### ✅ Step 5: Configure Terraform.
Create a file named terraform.tfvars with required variables.
```bash
aws_region        = " " # Enter AWS Region
availability_zone = " " # Enter Availability Zone
sg_name           = " " # Enter Security Group Name
sg_description    = "Allow inbound traffic"
key_name          = " " # Enter Key pair Name
public_key_path   = "keys/tasky-key.pub"
ami_id            = " "  # Ubuntu 22.04 AMI ID
instance_type     = "t2.xlarge" 
instance_names    = ["Taskify-Master", "Taskify-Worker"]
user_data         = " " 

root_volumes = [
  { volume_size = 30, volume_type = "gp3" },
  { volume_size = 20, volume_type = "gp3" }
]

ingress_rules = [
  { from_port = 22, to_port = 22, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] },   # SSH
  { from_port = 80, to_port = 80, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] },   # HTTP
  { from_port = 443, to_port = 443, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }, # HTTPS
  { from_port = 8080, to_port = 8080, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }, # Jenkins
  { from_port = 5173, to_port = 5173, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }, # Frontend
  { from_port = 27017, to_port = 27017, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }, # MongoDB
  { from_port = 8000, to_port = 8000, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }, # Backend
  { from_port = 30000, to_port = 32767, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }, # NodePort
  { from_port = 6443, to_port = 6443, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }, # Kubernetes API
  { from_port = 10250, to_port = 10250, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] },  # Kubelet API
  { from_port = 9000, to_port = 9000, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }  # SonarQube
```

Then run the Terraform commands:
```bash
terraform init
terraform validate
terraform plan
terraform apply
```

### ✅ Step 6: Generate SSH Key for Ansible.
If not already generated, create a key for Ansible:
```bash
cd ~/.ssh
ssh-keygen
```
Copy the content of id_rsa.pub to the authorized_keys file of both the created EC2 instances (K8s Master and Slave nodes).

### ✅ Step 7: Configure Ansible.
1. Copy the task.yaml file to /etc/ansible/:
```bash
sudo cp task.yaml /etc/ansible/
```
2. Add the private IPs of the two EC2 instances in inventory.ini file:
```bash
[K-M]
<Master-Private-IP>

[K-S]
<Slave-Private-IP>
```
3. Create the following Ansible scripts:

- localhost.sh
- KM.sh
- KS.sh

Add appropriate Ansible playbook or setup commands to each.

### ✅ Step 8: Run Ansible Commands.
```bash
ansible all -m ping -i inventory.ini
ansible-playbook task.yaml --syntax-check -i inventory.ini
ansible-playbook task.yaml -i inventory.ini
```

This sets up the foundational infrastructure and configuration for the Taskify DevSecOps project.

---

## 🚀 Kubernetes Cluster Setup

### 🔧 On Kubernetes Master Node Only:
```bash
sudo kubeadm config images pull
sudo kubeadm init
```
Configure kubeconfig for kubectl:
```bash
mkdir -p "$HOME"/.kube
sudo cp -i /etc/kubernetes/admin.conf "$HOME"/.kube/config
sudo chown "$(id -u)":"$(id -g)" "$HOME"/.kube/config
```
Install Calico network plugin:
```bash
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.0/manifests/calico.yaml
```
Generate the join command:
```bash
kubeadm token create --print-join-command
```

### 🔗 On Worker Node:
Run as root:
```bash
sudo su
<paste the join command here> --v=5
```

## 🧰 Docker + Jenkins Setup
### 🐳 Docker Setup (On Master Node):
```bash
sudo apt install docker.io -y
sudo chmod 777 /var/run/docker.sock
sudo usermod -aG docker $USER
newgrp docker
```
### 🚰 Jenkins Agent Configuration:
- Name: Taskify-Agent
- Description: Ubuntu machine agent for Taskify
- Remote root dir: `/home/ubuntu/`
- Label: `Taskify-Agent`
- Launch via SSH:
  - Host: `agent private IP`
  - Credentials:
    - Kind: SSH username with private key
    - ID: agentkey
    - Username: `ubuntu`
    - Private Key: content of `tasky-key` in `keys/`
- Host key verification: Non-verifying
