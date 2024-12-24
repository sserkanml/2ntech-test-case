# Frontend ve Backend CI/CD Pipeline Dokümantasyonu

Bu doküman, MERN stack uygulamasının frontend (client) ve backend (server) bölümlerinin Amazon EKS kümesine dağıtımı için CI/CD pipeline yapılandırmasını açıklar. Pipeline, işlemleri otomatikleştirmek için GitHub Actions kullanır.

---

## Frontend CI/CD
Aşağıda `client.yml` ve `server.yml` GitHub Actions workflow dosyasının yapılandırması yer almaktadır:

### Tetikleyiciler
Workflow şu durumlarda tetiklenir:
- **Push olayları** `master` dalına yapıldığında.
- **Manuel çalıştırma** `workflow_dispatch` eventi kullanılarak.

### Ortam Değişkenleri
Frontend workflow için aşağıdaki ortam değişkenleri ayarlanır:
- **AWS_REGION**: Kaynakların konuşlandırıldığı AWS bölgesi (ör. `us-west-2`).
- **ECR_REPOSITORY**: Frontend Docker imajları için Amazon Elastic Container Registry (ECR) deposu (ör. `mern-app-repo/client`).
- **EKS_CLUSTER**: Amazon EKS kümesinin adı (ör. `mern-app-eks`).
- **DEPLOYMENT_NAME**: Frontend için Kubernetes dağıtım adı (ör. `todo-frontend`).

### İşler ve Adımlar
`build-and-deploy` işi, `ubuntu-latest` runner üzerinde çalışır ve şu adımları içerir:

#### 1. Kodun Checkout Edilmesi
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
Bu adım, en son kodu depodan çeker.

#### 2. AWS Kimlik Bilgilerinin Yapılandırılması
```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ env.AWS_REGION }}
```
AWS kaynaklarına güvenli erişim sağlamak için GitHub Secrets kullanılarak AWS kimlik bilgileri ayarlanır.

#### 3. Amazon ECR'ye Giriş
```yaml
- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2
```
Docker imajlarının yüklenebilmesi için Amazon ECR'ye giriş yapılır.

#### 4. Docker İmajının Oluşturulması ve Yüklenmesi
```yaml
- name: Build and push Docker image
  env:
    ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    IMAGE_TAG: ${{ github.sha }}
  working-directory: ./client
  run: |
    docker build --build-arg VITE_SERVER_URL=${{ secrets.BACKEND_URL }} -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
    docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
```
Frontend uygulaması için Docker imajı oluşturulur:
- Backend URL'sini enjekte etmek için `VITE_SERVER_URL` argümanı kullanılır.
- İmaj, geçerli Git commit SHA'si ile etiketlenir.
- İmaj, belirtilen ECR deposuna yüklenir.

#### 5. Kubernetes Config'in Güncellenmesi
```yaml
- name: Update kube config
  run: aws eks update-kubeconfig --name ${{ env.EKS_CLUSTER }} --region ${{ env.AWS_REGION }}
```
Belirtilen EKS kümesiyle etkileşim sağlamak için yerel kubeconfig güncellenir.

#### 6. EKS'ye Dağıtım
```yaml
- name: Deploy to EKS
  env:
    ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    IMAGE_TAG: ${{ github.sha }}
  run: |
    kubectl set image deployment/$DEPLOYMENT_NAME $DEPLOYMENT_NAME=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
    kubectl rollout status deployment/$DEPLOYMENT_NAME
```
Yeni Docker imajı ile frontend dağıtımı EKS üzerinde güncellenir ve dağıtım durumu izlenir.

---

## Backend CI/CD
Aşağıda `backend-ci-cd.yml` GitHub Actions workflow dosyasının yapılandırması yer almaktadır:

### Tetikleyiciler
Workflow şu durumlarda tetiklenir:
- **Push olayları** `master` dalına yapıldığında.
- **Manuel çalıştırma** `workflow_dispatch` eventi kullanılarak.

### Ortam Değişkenleri
Backend workflow için aşağıdaki ortam değişkenleri ayarlanır:
- **AWS_REGION**: Kaynakların konuşlandırıldığı AWS bölgesi (ör. `us-west-2`).
- **ECR_REPOSITORY**: Backend Docker imajları için Amazon Elastic Container Registry (ECR) deposu (ör. `mern-app-repo/server`).
- **EKS_CLUSTER**: Amazon EKS kümesinin adı (ör. `mern-app-eks`).
- **DEPLOYMENT_NAME**: Backend için Kubernetes dağıtım adı (ör. `todo-backend`).

### İşler ve Adımlar
`build-and-deploy` işi, `ubuntu-latest` runner üzerinde çalışır ve şu adımları içerir:

#### 1. Kodun Checkout Edilmesi
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
Bu adım, en son kodu depodan çeker.

#### 2. AWS Kimlik Bilgilerinin Yapılandırılması
```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ env.AWS_REGION }}
```
AWS kaynaklarına güvenli erişim sağlamak için GitHub Secrets kullanılarak AWS kimlik bilgileri ayarlanır.

#### 3. Amazon ECR'ye Giriş
```yaml
- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2
```
Docker imajlarının yüklenebilmesi için Amazon ECR'ye giriş yapılır.

#### 4. Docker İmajının Oluşturulması ve Yüklenmesi
```yaml
- name: Build and push Docker image
  env:
    ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    IMAGE_TAG: ${{ github.sha }}
  working-directory: ./server
  run: |
    docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
    docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
```
Backend uygulaması için Docker imajı oluşturulur:
- İmaj, geçerli Git commit SHA'si ile etiketlenir.
- İmaj, belirtilen ECR deposuna yüklenir.

#### 5. Kubernetes Config'in Güncellenmesi
```yaml
- name: Update kube config
  run: aws eks update-kubeconfig --name ${{ env.EKS_CLUSTER }} --region ${{ env.AWS_REGION }}
```
Belirtilen EKS kümesiyle etkileşim sağlamak için yerel kubeconfig güncellenir.

#### 6. EKS'ye Dağıtım
```yaml
- name: Deploy to EKS
  env:
    ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    IMAGE_TAG: ${{ github.sha }}
  run: |
    kubectl set image deployment/$DEPLOYMENT_NAME $DEPLOYMENT_NAME=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
    kubectl rollout status deployment/$DEPLOYMENT_NAME
```
Yeni Docker imajı ile backend dağıtımı EKS üzerinde güncellenir ve dağıtım durumu izlenir.

---

## Secrets
Her iki workflow için aşağıdaki GitHub Secrets gereklidir:
- **AWS_ACCESS_KEY_ID**: AWS erişim anahtarı kimliği.
- **AWS_SECRET_ACCESS_KEY**: AWS gizli erişim anahtarı.
- **BACKEND_URL** (sadece frontend için): Backend API'sinin temel URL'si (Docker build sürecinde `VITE_SERVER_URL` olarak kullanılır).

---

## Notlar
- `./client` ve `./server` dizinlerinin sırasıyla frontend ve backend uygulamalarını içerdiği varsayılmaktadır.
- EKS kümesi ve dağıtım adlarının ortam değişkenlerinde belirtilen değerlerle eşleştiğinden emin olun.
- Backend URL'sinde değişiklik olması durumunda, `BACKEND_URL` secret'ını güncelleyip frontend workflow'unu tekrar çalıştırın.

---

Bu doküman, MERN uygulamasının frontend ve backend bileşenleri için CI/CD pipeline'larını özetlemektedir. Her workflow, yapılandırma, yükleme ve dağıtım süreçlerini ayrı ayrı ele alarak modülerlik ve sürdürülebilirlik sağlar.

