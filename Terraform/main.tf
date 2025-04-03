provider "aws" {
  region = "ca-central-1"
}

variable "key_name" {
  description = “vault-note”
  type        = string
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.14.0"

  name                 = "vaultnote-vpc"
  cidr                 = "10.0.0.0/16"
  azs                  = ["ca-central-1a", "ca-central-1b"]
  public_subnets       = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets      = ["10.0.101.0/24", "10.0.102.0/24"]
  enable_nat_gateway   = true
  single_nat_gateway   = true
}

resource "aws_security_group" "eks_public_sg" {
  name        = "eks-public-sg"
  description = "Security group for EKS cluster and nodes, allowing public HTTP/HTTPS access"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTPS traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "18.0.3"
  cluster_name    = "vaultnote-cluster"
  cluster_version = "1.23"
  vpc_id          = module.vpc.vpc_id
  subnets         = module.vpc.private_subnets

  # Optionally, assign the custom security group to the cluster control plane.
  cluster_security_group_id = aws_security_group.eks_public_sg.id

  node_groups = {
    default = {
      desired_capacity               = 2
      min_capacity                   = 1
      max_capacity                   = 3
      instance_type                  = "t3.medium"
      key_name                       = var.key_name
      additional_security_group_ids  = [aws_security_group.eks_public_sg.id]
    }
  }
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "cluster_name" {
  value = module.eks.cluster_name
}
