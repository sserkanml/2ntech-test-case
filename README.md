# MERN Stack Application on AWS EKS

Bu proje, AWS EKS (Elastic Kubernetes Service) üzerinde çalışan bir MERN stack (MongoDB, Express, React, Node.js) uygulamasıdır. Proje, frontend tarafında React.js ve Nginx, backend tarafında ise Node.js ve Express.js kullanmaktadır. Altyapı AWS üzerinde EKS, ECR, VPC ve IAM servisleri kullanılarak yönetilmektedir. Ayrıca, CI/CD süreçleri GitHub Actions ile sağlanmaktadır.

## Mimarisi

Aşağıda projenin genel mimarisi ve kullanılan teknolojiler hakkında bir açıklama bulabilirsiniz:

### **Mimari**

#### **Frontend (React + Nginx)**

- **React.js**: Frontend tarafı, kullanıcı etkileşimlerini yöneten dinamik bir React.js uygulamasıdır.
- **Nginx**: React uygulaması, Nginx üzerinden servise sunulur. Nginx, frontend static dosyalarını barındırır ve gelen HTTP isteklerini doğru servis ve pod'lara yönlendirir.

#### **Backend (Node.js + Express.js)**

- **Node.js ve Express.js**: Backend tarafında Express.js ile oluşturulmuş bir API sunucusu bulunur. Node.js, API isteklerini işler ve frontend ile MongoDB arasında veri iletişimi sağlar.
  
#### **AWS Altyapısı**

- **AWS EKS**: Kubernetes cluster'ı olarak AWS EKS kullanılarak, uygulama container'ları yönetilir. EKS, Kubernetes'i AWS üzerinde yönetilen bir hizmet olarak sağlar.
- **AWS ECR**: Uygulamanın Docker container'ları, AWS Elastic Container Registry (ECR) üzerinde barındırılır. ECR, Docker image'larını saklamak için kullanılır.
- **AWS VPC**: AWS VPC (Virtual Private Cloud), tüm kaynakların güvenli bir şekilde izole edilmesini sağlar. Uygulama kaynakları bu VPC üzerinde konuşlanır.
- **AWS IAM**: AWS Identity and Access Management (IAM), EKS cluster'ı ve diğer AWS kaynaklarına erişim kontrolü için kullanılır.

### **CI/CD Süreci**

CI/CD (Continuous Integration / Continuous Deployment) süreci, GitHub Actions ile yönetilmektedir. Kod depoları üzerinde yapılan her değişiklik, CI/CD pipeline'ı aracılığıyla otomatik olarak test edilir ve deploy edilir.

- **CI/CD Pipeline**: GitHub Actions, yeni commit'ler veya pull request'ler ile tetiklenen pipeline'lar ile kodun test edilmesi, Docker image'larının oluşturulması ve ECR'ye push edilmesi işlemlerini otomatikleştirir.
- **Deploy**: Herhangi bir değişiklik sonrası, GitHub Actions pipeline'ı yeni Docker image'ını oluşturur, AWS ECR'ye yükler ve sonrasında Kubernetes'e deploy eder.

---

## Kullanılan Teknolojiler

- **Frontend**: React.js, Nginx
- **Backend**: Node.js, Express.js
- **Veritabanı**: MongoDB
- **Orkestrasyon ve Dağıtım**: AWS EKS (Elastic Kubernetes Service)
- **Container Registry**: AWS ECR (Elastic Container Registry)
- **Altyapı**: AWS VPC, AWS IAM
- **CI/CD**: GitHub Actions
- **Yük Dengeleme**: AWS Elastic Load Balancer

---

## Adımlar

Aşağıda AWS EKS üzerinde MERN stack uygulamanızın deploy edilmesi için gereken adımları bulabilirsiniz.

### 1. **Altyapı Kurulumu (Terraform)**

Proje, Terraform ile altyapıyı yönetmektedir. AWS EKS cluster'ı ve diğer gerekli kaynakları Terraform ile oluşturuyoruz. Altyapıyı kurmak için şu adımları takip edebilirsiniz:

#### 1.1 **Terraform Konfigürasyonu**

AWS kaynaklarını tanımlayan Terraform modülleri aşağıda açıklanmıştır:

- **eks*: AWS EKS cluster'ını oluşturur.
- **vpc.tf**: AWS VPC ve subnet'lerini tanımlar.
- **ecr.tf**: ECR (Elastic Container Registry) oluşturur ve Docker image'larını depolar.
- **iam.tf**: AWS IAM rolleri ve politikalarını yönetir.

#### 1.2 **Terraform Komutları**

```bash
# Terraform'u başlatın
terraform init

# Planı oluşturun
terraform plan

# Altyapıyı uygulayın
terraform apply
```


2. Frontend ve Backend Uygulamalarının Dockerize Edilmesi
2.1 Frontend (React + Nginx)
React frontend uygulaması Nginx ile container'lanır. Dockerfile içinde gerekli yapılandırma yapılır:

```bash
# Dockerfile oluşturun
docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
```

```Dockerfile
FROM node:18-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app 

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm 

RUN pnpm install

COPY . .

ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

RUN pnpm build 

FROM nginx:stable-alpine 

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]  
```
3. Backend (Node.js + Express)
Node.js ve Express.js backend uygulaması Dockerize edilir. Dockerfile aşağıdaki gibi yapılandırılabilir:

```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN npm install -g pnpm 

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

4. Kubernetes Deployment ve Service Konfigürasyonu

Kubernetes deployment'ları ve service'leri, k8s klasöründe oluşturulur.

```bash
# Kubernetes deployment'ları ve service'leri oluşturun
kubectl apply -f k8s/
```

5. Local Development

Local development için, Docker compose ile container'ların çalıştırılması gerekmektedir.

```bash
# Docker compose ile container'ları çalıştırın
docker compose up -d
```

6. CI/CD Pipeline

GitHub Actions, yeni commit'ler veya pull request'ler ile tetiklenen pipeline'lar ile kodun test edilmesi, Docker image'larının oluşturulması ve ECR'ye push edilmesi işlemlerini otomatikleştirir.

```bash
# GitHub Actions pipeline'ını başlatın
gh workflow run deploy
```

Bu adımlar, AWS EKS üzerinde MERN stack uygulamanızın deploy edilmesi için gerekli olan temel adımları içerir. Projenin tamamının veya herhangi bir bileşenin değiştirilmesi durumunda, bu adımların yeniden yapılandırılması gerekebilir.