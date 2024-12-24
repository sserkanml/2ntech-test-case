# Server README

Bu README dosyası, MERN uygulamanızın sunucu (backend) tarafını çalıştırmak ve yönetmek için rehber niteliğindedir. Ayrıca, projede kullanılan pnpm paket yöneticisinin avantajları ve Docker ile çalıştırma süreçleri hakkında bilgiler içerir.

---

## pnpm Paket Yöneticisi

Projede **pnpm** paket yöneticisi kullanılmaktadır. İşte pnpm'in sağladığı bazı avantajlar:

1. **Performans**: pnpm, bağımlılıkları global bir depoda saklar ve sembolik bağlantılar kullanarak aynı bağımlılıkların tekrar yüklenmesini önler. Bu, hem disk alanından tasarruf sağlar hem de yükleme sürelerini azaltır.
2. **Deterministik Yükleme**: pnpm, bağımlılıkların tam olarak aynı sürümde yüklenmesini sağlar, bu da proje uyumluluğunu garanti eder.
3. **Mono-Repo Desteği**: pnpm, birden fazla paketi bir arada yönetmek için harika bir araçtır ve bu tür projelerde performans avantajı sunar.

Paketlerinizi yüklemek için şu komutu kullanabilirsiniz:

```bash
pnpm install
```

---

## Projeyi Çalıştırma

### Gerekli Bağımlılıkları Yükleme
Projede kullanılan bağımlılıkları yüklemek için aşağıdaki komutu çalıştırın:

```bash
pnpm install
```

### Geliştirme Ortamını Başlatma
Sunucu uygulamasını geliştirme modunda çalıştırmak için şu komutu kullanabilirsiniz:

```bash
pnpm dev
```
Bu komut, **ts-node-dev** ile sunucuyu çalıştırır ve kod değişikliklerini otomatik olarak algılar.

### Uygulamayı Derleme
Uygulamayı TypeScript'ten JavaScript'e derlemek için şu komutu kullanabilirsiniz:

```bash
pnpm build
```
Bu komut, `dist` klasörüne derlenmiş dosyaları oluşturur.

### Üretim Ortamını Başlatma
Derlenmiş dosyaları kullanarak uygulamayı başlatmak için şu komutu kullanabilirsiniz:

```bash
pnpm start
```
Bu komut, `dist/src/index.js` dosyasını çalıştırır.

---

## Docker ile Çalıştırma

Docker kullanarak sunucuyu bir konteyner içerisinde çalıştırabilirsiniz. Bunun için aşağıdaki adımları izleyin:

### Docker İmajını Oluşturma
Docker imajını oluşturmak için şu komutu kullanabilirsiniz:

```bash
docker build -t mern-server .
```
Bu komut, Dockerfile'ı kullanarak `mern-server` isimli bir imaj oluşturur.

### Docker Konteynerini Çalıştırma
Oluşturulan imajı kullanarak bir konteyner çalıştırmak için şu komutu kullanabilirsiniz:

```bash
docker run -d -p 4000:4000 --name mern-server-container mern-server
```
Bu komut:
- Konteyneri arka planda çalıştırır.
- Sunucuya dış dünyadan 4000 numaralı port üzerinden erişim sağlar.

---

## Scriptler

### Kullanılan Scriptler
Projede aşağıdaki npm scriptleri tanımlıdır:

1. **`dev`**: Geliştirme ortamını başlatır.
   ```bash
   pnpm dev
   ```
2. **`build`**: Uygulamayı derler.
   ```bash
   pnpm build
   ```
3. **`start`**: Üretim ortamını başlatır.
   ```bash
   pnpm start
   ```

---


