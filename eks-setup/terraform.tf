terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0.6"
    }

    cloudinit = {
      source  = "hashicorp/cloudinit"
      version = "~> 2.3.5"
    }
    
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.35.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.16.1"
    }
  }

  required_version = "~> 1.3"
}
