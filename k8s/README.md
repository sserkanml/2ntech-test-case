# MongoDB Kubernetes Yapılandırması

Bu repository, Kubernetes üzerinde MongoDB deployment'ı için gerekli manifest dosyalarını içerir.

## Bileşenler

### Storage Class
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: mongodb-gp2
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  encrypted: "true"
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

#### Storage Class Özellikleri
- **Provisioner**: AWS EBS CSI Driver
- **Volume Tipi**: GP3
- **Şifreleme**: Aktif
- **Reclaim Policy**: Retain (PV silmez)
- **Volume Genişletme**: Desteklenir
- **Binding Mode**: WaitForFirstConsumer

### StatefulSet Yapılandırması
- Pod'lar sıralı olarak oluşturulur ve yönetilir
- Her pod için kalıcı depolama alanı oluşturulur
- Anti-affinity kuralları ile pod'ların farklı node'lara dağıtılması sağlanır

### Service Yapılandırması
- Headless service ile StatefulSet pod'larına erişim
- Her pod için sabit DNS kaydı

### Secret Yapılandırması
- MongoDB kullanıcı bilgileri
- MongoDB root şifresi
- Uygulama bağlantı bilgileri

## Kurulum

1. Storage Class'ı oluşturun:
```bash
kubectl apply -f storageclass.yaml
```

2. Secret'ı oluşturun:
```bash
kubectl apply -f secret.yaml
```

3. Service'i oluşturun:
```bash
kubectl apply -f service.yaml
```

4. StatefulSet'i deploy edin:
```bash
kubectl apply -f statefulset.yaml
```

## Doğrulama

```bash
# Storage Class kontrolü
kubectl get sc mongodb-gp2

# Pod'ların durumu
kubectl get pods -l app=mongodb

# PVC'lerin durumu
kubectl get pvc -l app=mongodb
```

## Bakım

### Volume Genişletme
```bash
kubectl edit pvc <pvc-name>
# storage: değerini güncelleyin
```

### Backup
- Pod'lardan birini kullanarak mongodump alın
- EBS snapshot'ları kullanın

## Dikkat Edilmesi Gerekenler

- Storage Class oluşturulmadan önce EBS CSI Driver'ın kurulu olduğundan emin olun
- Pod'lar silinse bile veriler korunur (Retain policy)
- Volume şifrelemesi varsayılan olarak aktiftir


# Todo Backend Mimarisi

## Mimari Yaklaşım

Backend servisimiz Kubernetes üzerinde çalışan bir NodeJS uygulamasıdır. LoadBalancer tipi servis kullanarak dış dünyaya açılmaktadır.

### Neden LoadBalancer?

1. **Frontend-Backend İletişimi**: 
   - Frontend uygulaması browser'da çalıştığı için backend'e internet üzerinden erişmesi gerekiyor
   - LoadBalancer, AWS üzerinde otomatik olarak Application Load Balancer (ALB) oluşturur
   - ALB, güvenli ve ölçeklenebilir bir endpoint sağlar

2. **Yük Dengeleme**:
   - İki replika pod arasında trafik otomatik olarak dağıtılır
   - Pod hatalarında trafik sağlıklı pod'lara yönlendirilir
   - Yatay ölçeklendirme durumunda yeni pod'lar otomatik olarak load balancer'a eklenir

### Güvenlik Yapılandırması

1. **Ortam Değişkenleri**:
   - Hassas bilgiler (MongoDB URI, JWT Secret) Kubernetes Secret'larında saklanır
   - Secret'lar base64 ile encode edilir ve etcd'de şifreli olarak saklanır

2. **Network Güvenliği**:
   - LoadBalancer sadece 80 portunu dış dünyaya açar
   - Backend servisi container içinde 3000 portunda çalışır
   - ALB üzerinden SSL/TLS terminasyonu yapılabilir

### Resource Yönetimi

- **CPU ve Memory Limitleri**:
  - Minimum kaynak garantisi ile kararlı çalışma
  - Maximum limit ile cluster kaynaklarının korunması
  - Pod'lar arası adil kaynak dağılımı

### Ölçeklenebilirlik

- Birden fazla replika ile yüksek erişilebilirlik
- Pod'lar farklı node'lara dağıtılarak risk minimizasyonu
- LoadBalancer ile otomatik trafik dağıtımı
- Yatay ölçeklendirme imkanı

Bu mimarinin temel odak noktası, güvenli ve ölçeklenebilir bir şekilde frontend-backend iletişimini sağlamaktır. LoadBalancer kullanımı, bu hedefi AWS'nin managed servisleri ile gerçekleştirmemizi sağlar.


# Todo Frontend Mimarisi


1. Kubernetes Kullanımı ve LoadBalancer Service
Frontend uygulamanızın AWS EKS (Elastic Kubernetes Service) üzerinde çalışabilmesi için Kubernetes cluster'ı içerisinde bir Deployment ve Service nesnesi kullanıyoruz.

Kubernetes Deployment: Uygulamanızın pod'larını (container'larını) yönetmek için Deployment kullanılır. Bu nesne, uygulamanızın container'larını tanımlar, gerekli sürümleri belirtir ve Kubernetes'in uygulamanızı düzgün bir şekilde çalıştırmasını sağlar. Aynı zamanda, uygulamanın ölçeklenebilmesini (replicas) ve yüksek erişilebilirlik sağlamasını yönetir.

Replicas: replicas: 2 ile belirttiğimizde, Kubernetes 2 adet pod çalıştırmaya çalışacaktır. Bu, frontend uygulamanızın yüksek erişilebilirliğini sağlar. Eğer bir pod düşerse, diğer pod hala çalışır ve trafiği taşır.
Container Image: Uygulamanızın Docker image'ı Amazon ECR'den çekilir. Böylece uygulamanızın en güncel sürümü her zaman Kubernetes'e dağıtılır. Bu Docker image, uygulamanızın tüm bağımlılıklarını içerir, böylece her ortamda aynı şekilde çalışır.
Kubernetes Service: Frontend uygulamanızın dış dünyaya erişebilmesi için bir Service kullanıyoruz. Bu, Kubernetes içerisinde çalışan pod'ların dış dünyadan erişilmesini sağlar.

Type: LoadBalancer: type: LoadBalancer belirtildiğinde, AWS bu servisi dış dünyaya açmak için bir Elastic Load Balancer (ELB) oluşturur. Bu, uygulamanızın internete açık hale gelmesini sağlar ve otomatik olarak trafiği frontend pod'larına yönlendirir. Bu yaklaşım, ağ trafiği ve yük dengelemesi için güvenilir bir çözüm sunar.
2. Environment Variable ve ConfigMap Kullanımı
Uygulamanızın çalıştığı ortamı doğru şekilde yapılandırmak için ConfigMap kullanıyoruz. VITE_SERVER_URL gibi environment variable'lar, frontend uygulamanızın API'ye nasıl bağlanacağını belirler. Bu URL'nin dinamik bir şekilde değiştirilmesi gerektiğinde, sadece Kubernetes ConfigMap'ini güncelleyebilirsiniz. Böylece uygulama tekrar başlatılmadan, API URL'si güncellenmiş olur.

ConfigMap: Kubernetes'teki ConfigMap, uygulamanızın çalışma zamanında ihtiyaç duyacağı konfigürasyon bilgilerini yönetmek için kullanılır. Burada, API URL'sini bir ConfigMap içerisinde tanımlayıp, frontend container'ına environment variable olarak geçiriyoruz. Böylece backend uygulamanızın URL'si frontend'e dinamik olarak aktarılır.
3. Kaynak Yönetimi (Resource Requests ve Limits)
Kubernetes, her pod için CPU ve memory kaynaklarını yönetebilir. Bu kaynaklar, uygulamanızın her bir container'ı için belirlenir.

Requests: cpu: "100m" ve memory: "128Mi" olarak belirtilen değerler, Kubernetes'e container'ın başlangıçta ne kadar kaynak kullanacağını söyler. Bu, pod'un çalışma için ne kadar kaynağa ihtiyacı olduğunu belirtir.
Limits: cpu: "300m" ve memory: "256Mi" ise pod'un alabileceği maksimum kaynak miktarını belirler. Bu sınırları aşarsa, Kubernetes container'ı otomatik olarak sonlandırabilir.
Bu kaynak yönetimi, uygulamanızın her bir pod'unun verimli çalışmasını sağlamak için önemlidir. Aynı zamanda, cluster'da gereksiz kaynak tüketiminin önüne geçer ve yüksek erişilebilirlik sağlamak adına pod'ların ölçeklenmesini kolaylaştırır.