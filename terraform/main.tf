provider "aws" {
  region = "us-west-2"
}

module "vpc" {
  source       = "./modules/vpc"
  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
}

module "iam" {
  source            = "./modules/iam"
  project_name      = var.project_name
  oidc_provider_arn = module.eks.oidc_provider_arn
  oidc_provider_url = module.eks.oidc_provider_url
}

module "eks" {
  source          = "./modules/eks"
  project_name    = var.project_name
  cluster_version = var.cluster_version
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.subnet_ids
  instance_types  = var.instance_types
  cluster_role_arn = module.iam.cluster_role_arn
  node_role_arn   = module.iam.node_role_arn
}

module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
}


provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
    }
  }
}

resource "helm_release" "aws_ebs_csi_driver" {
  name       = "aws-ebs-csi-driver"
  namespace  = "kube-system"
  repository = "https://kubernetes-sigs.github.io/aws-ebs-csi-driver"
  chart      = "aws-ebs-csi-driver"
  version    = "2.25.0"

  set {
    name  = "controller.serviceAccount.create"
    value = "true"
  }

  set {
    name  = "controller.serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = module.iam.ebs_csi_role_arn
  }

  depends_on = [
    module.eks
  ]
}