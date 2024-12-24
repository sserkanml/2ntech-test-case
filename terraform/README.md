# Amazon ECR Terraform Modülü

Bu modül, Amazon Elastic Container Registry (ECR) için Terraform kullanılarak repository oluşturmayı otomatikleştirir. İki repository içermektedir: biri `server` için, diğeri ise `client` için tasarlanmıştır.

## Özellikler
- **Image Tag Mutability**: Image taglerinin mutability (değiştirilebilirlik) durumunu kontrol eder.
- **Image Scanning**: Push işlemi sırasında güvenlik taraması yapar.
- **Tag Desteği**: Her bir repository'ye AWS kaynak etiketleri ekler.

---

## Girdi Değişkenleri

Bu modül aşağıdaki değişkenleri kullanır:

| Değişken Adı         | Tip     | Varsayılan Değer | Açıklama                                     |
|-----------------------|---------|-----------------|-----------------------------------------|
| `project_name`        | String  | Zorunlu         | Projenin adı. Her bir repository'nin adına eklenir. |
| `image_tag_mutability`| String  | `IMMUTABLE`     | Image tag mutability. `IMMUTABLE` veya `MUTABLE` olabilir. |

---

## Çıktılar

Bu modül aşağıdaki çıktıları sağlar:

| Çıktı Adı              | Tip    | Açıklama                               |
|---------------------|--------|-----------------------------------|
| `server_repository_url` | String | Server ECR repository URL.        |
| `client_repository_url` | String | Client ECR repository URL.        |


# AWS EKS Terraform Modülü

Bu Terraform modülü, AWS EKS (Elastic Kubernetes Service) kümesi ve ilgili kaynakları oluşturur.

## Özellikler

- EKS Kümesi oluşturma
- Node Group yapılandırması
- CloudWatch log entegrasyonu
- OIDC sağlayıcı desteği
- Özel VPC entegrasyonu

## Gereksinimler

- Terraform >= 1.0
- AWS hesabı ve yapılandırılmış kimlik bilgileri
- VPC ve Subnet'ler

## Kullanım

```hcl
module "eks" {
  source = "./modules/eks"

  project_name     = "proje-adi"
  cluster_version  = "1.27"
  subnet_ids       = ["subnet-xxx", "subnet-yyy"]
  cluster_role_arn = "arn:aws:iam::XXXXXXXXXXXX:role/eks-cluster-role"
  node_role_arn    = "arn:aws:iam::XXXXXXXXXXXX:role/eks-node-role"
  instance_types   = ["t3.medium"]
}
```

## Girdiler

| İsim | Açıklama | Tip | Zorunlu |
|------|-----------|------|----------|
| project_name | Proje adı | string | evet |
| cluster_version | EKS sürümü | string | evet |
| subnet_ids | Kümenin kullanacağı subnet ID'leri | list(string) | evet |
| cluster_role_arn | EKS kümesi için IAM rol ARN | string | evet |
| node_role_arn | Worker node'lar için IAM rol ARN | string | evet |
| instance_types | Worker node'lar için EC2 instance tipleri | list(string) | evet |

## Çıktılar

| İsim | Açıklama |
|------|-----------|
| cluster_endpoint | EKS kümesi API endpoint URL'i |
| cluster_name | EKS kümesi adı |
| cluster_oidc_issuer_url | OIDC sağlayıcı URL'i |

## Notlar

- Küme hem private hem public endpoint'lere sahiptir
- CloudWatch logları 7 gün saklanır
- Node grubu varsayılan olarak 2 node ile başlar, minimum 1 maximum 4 node'a kadar ölçeklenebilir
- Kapasite tipi ON_DEMAND olarak ayarlanmıştır



# AWS IAM Terraform Modülü - EKS İçin

Bu modül, EKS kümesi için gerekli IAM rollerini ve politikalarını oluşturur.

## Oluşturulan Kaynaklar

- EKS Cluster IAM Role
- EKS Node Group IAM Role
- EBS CSI Driver IAM Role
- Gerekli politika bağlantıları
- CloudWatch Logs için özel politika

## Kullanım

```hcl
module "iam" {
  source = "./modules/iam"

  project_name       = "proje-adi"
  oidc_provider_url  = "https://oidc.eks.region.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE"
  oidc_provider_arn  = "arn:aws:iam::XXXXXXXXXXXX:oidc-provider/oidc.eks.region.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE"
}
```

## Girdiler

| İsim | Açıklama | Tip | Zorunlu |
|------|-----------|------|----------|
| project_name | Proje adı (rol isimlerinde kullanılır) | string | evet |
| oidc_provider_url | EKS OIDC sağlayıcı URL'i | string | evet |
| oidc_provider_arn | EKS OIDC sağlayıcı ARN'i | string | evet |

## Çıktılar

| İsim | Açıklama |
|------|-----------|
| cluster_role_arn | EKS kümesi rol ARN'i |
| node_group_role_arn | Node group rol ARN'i |
| ebs_csi_role_arn | EBS CSI sürücüsü rol ARN'i |

## Oluşturulan Roller ve İzinler

### EKS Cluster Role
- AmazonEKSClusterPolicy
- AmazonEKSVPCResourceController

### Node Group Role
- AmazonEKSWorkerNodePolicy
- AmazonEKS_CNI_Policy
- AmazonEC2ContainerRegistryReadOnly
- Özel CloudWatch Logs politikası

### EBS CSI Role
- AmazonEBSCSIDriverPolicy

## Güvenlik Notları

- Tüm roller en az ayrıcalık prensibine göre yapılandırılmıştır
- OIDC kimlik doğrulaması EBS CSI sürücüsü için kullanılmaktadır
- CloudWatch Logs politikası yalnızca gerekli izinleri içerir

# AWS VPC Terraform Modülü - EKS İçin

Bu modül, EKS kümesi için optimize edilmiş bir VPC ve ilgili ağ kaynaklarını oluşturur.

## Oluşturulan Kaynaklar

- VPC
- Public Subnet'ler
- Internet Gateway
- Route Table
- Security Group'lar
- Route Table Association'lar

## Kullanım

```hcl
module "vpc" {
  source = "./modules/vpc"

  project_name        = "proje-adi"
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = ["eu-central-1a", "eu-central-1b"]
}
```

## Girdiler

| İsim | Açıklama | Tip | Varsayılan |
|------|-----------|------|------------|
| project_name | Proje adı | string | zorunlu |
| vpc_cidr | VPC için CIDR bloğu | string | zorunlu |
| availability_zones | Kullanılacak AZ'ler | list(string) | zorunlu |

## Çıktılar

| İsim | Açıklama |
|------|-----------|
| vpc_id | Oluşturulan VPC'nin ID'si |
| public_subnet_ids | Public subnet ID'leri |
| cluster_security_group_id | EKS cluster security group ID'si |

## Ağ Mimarisi

- VPC, özel DNS desteği ile oluşturulur
- Her AZ için bir public subnet oluşturulur
- CIDR blokları otomatik olarak subnet'lere bölünür
- Public subnet'ler otomatik IP ataması için yapılandırılmıştır

## EKS Spesifik Yapılandırma

- Subnet'ler EKS cluster tag'leri ile işaretlenir
- Load Balancer tag'leri otomatik olarak eklenir
- EKS kontrol düzlemi için güvenlik grubu:
  - 443 portu üzerinden VPC CIDR'inden gelen trafiğe izin verir
  - Tüm çıkış trafiğine izin verir

## Notlar

- Public subnet'ler internet gateway üzerinden internete erişebilir
- Security group kuralları en az ayrıcalık prensibine göre yapılandırılmıştır
- Tüm kaynaklar proje adı ile etiketlenir



# AWS EKS Altyapı Terraform Projesi

Bu proje, AWS üzerinde tam yapılandırılmış bir EKS kümesi ve ilgili altyapıyı oluşturur.

## Mimari Bileşenler

- VPC ve ağ altyapısı
- IAM rolleri ve politikaları
- EKS kümesi ve node grubu
- ECR repositories
- EBS CSI Driver

## Ön Gereksinimler

- Terraform >= 1.0
- AWS CLI yapılandırılmış
- kubectl
- helm

## Kullanım

1. Değişkenleri ayarlayın:
```hcl
# terraform.tfvars
project_name     = "proje-adi"
vpc_cidr         = "10.0.0.0/16"
cluster_version  = "1.27"
instance_types   = ["t3.medium"]
```

2. Terraform'u başlatın:
```bash
terraform init
terraform plan
terraform apply
```

## Modül Bağımlılıkları

```
vpc -> iam -> eks -> helm_release
```

## Modül Detayları

### VPC Modülü
- Public subnet'ler
- Internet Gateway
- Route tables
- Security groups

### IAM Modülü
- EKS cluster rolü
- Node group rolü
- EBS CSI Driver rolü

### EKS Modülü
- EKS cluster
- Managed node group
- OIDC provider

### ECR Modülü
- Container registry repositories

## Helm Yapılandırması

AWS EBS CSI Driver otomatik olarak yüklenir ve IAM rolü ile yapılandırılır.

## Çıktılar

| İsim | Açıklama |
|------|-----------|
| cluster_endpoint | EKS API endpoint'i |
| cluster_name | EKS küme adı |
| ecr_repository_url | ECR repository URL'i |

## Güvenlik Notları

- EKS API endpoint'i public ve private erişime açık
- Node'lar public subnet'lerde
- IAM rolleri en az yetki prensibiyle yapılandırılmış

## Ölçeklendirme

Node grubu:
- Minimum: 1 node
- Maksimum: 4 node
- İstenen: 2 node