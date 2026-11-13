# Docora Web Sitesi — Kurulum, Test ve GitHub Pages Rehberi

Bu proje, **Docora** için hazırlanmış, harici bağımlılığı olmayan, hafif, modern, responsive ve 3 dilli (TR / EN / DE) statik web sitesidir (Pazarlama, Destek, Gizlilik Politikası ve Hizmet Şartları).

Resmi Docora logosu (`assets/logo.png`), faviconları ve marka renkleri (`#c80d25`) tüm sayfalara entegre edilmiştir.

---

## 1) Web'de Açma ve Yerel Olarak Test Etme

Sitenin çalışmasını ve tasarımını bilgisayarınızda hemen test etmek için terminalde şu yöntemlerden birini kullanabilirsiniz:

### Yöntem A: Doğrudan Tarayıcıda Açma (En Hızlı)
Herhangi bir sunucu başlatmadan doğrudan dosyayı açabilirsiniz:
```bash
# macOS'ta varsayılan tarayıcınızda açar:
open index.html

# Veya doğrudan destek/gizlilik sayfalarını açmak için:
open support.html
open privacy.html
open terms.html
```

### Yöntem B: Yerel Web Sunucusu ile Açma (Önerilen)
Python'ın dahili web sunucusuyla tam bir HTTP ortamında test etmek için:
```bash
# 1. Proje dizininde sunucuyu başlatın:
python3 -m http.server 8000

# 2. Tarayıcıda adresi açın:
open http://localhost:8000
```
> Sunucuyu durdurmak istediğinizde terminalde `Ctrl + C` tuşlarına basmanız yeterlidir.

### Yöntem C: Node.js / npx ile Açma
Eğer Node.js kullanıyorsanız:
```bash
npx serve .
```

---

## 2) Git ile GitHub'a Yükleme Adımları

Projeyi GitHub'a göndermek için aşağıdaki komutları sırasıyla terminalde çalıştırın:

### Adım 1: Depoyu Hazırlayın (Zaten sizin için ilklendirildi)
```bash
git add .
git commit -m "feat: integrate official Docora logo, favicon and branding"
```

### Adım 2: GitHub'da Depo Oluşturun
1. [github.com/new](https://github.com/new) adresine gidin.
2. Depo adını `docora-support` yapın.
3. Gizliliği **Public** seçin (GitHub Pages için gereklidir).
4. README veya .gitignore ekleme seçeneğini **işaretlemeyin** (çünkü projemizde zaten var).
5. **Create repository** butonuna tıklayın.

### Adım 3: Depoyu GitHub'a Gönderin
GitHub'da size verilen linki kullanarak:
```bash
# GitHub kullanıcı adınızı 'alperrd' yerine kendi kullanıcı adınızla kontrol edin:
git remote add origin https://github.com/alperrd/docora-support.git
git branch -M main
git push -u origin main
```

*(Eğer daha önceden GitHub CLI `gh` kullanıyorsanız tek komutla da oluşturup atabilirsiniz:)*
```bash
gh repo create docora-support --public --source=. --remote=origin --push
```

### Adım 4: GitHub Pages'i Aktif Edin
1. GitHub'daki deponuzda **Settings** sekmesine tıklayın.
2. Sol menüden **Pages** bölümüne gelin.
3. **Build and deployment** başlığı altından:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` ve `/ (root)` seçin.
4. **Save** butonuna tıklayın.
5. 1-2 dakika içinde siteniz yayına alınacaktır.

---

## 3) Beklenen Yayındaki Bağlantılar

`alperrd` hesabı ve `docora-support` depo adı için adresler:

- **Ana / Pazarlama Sayfası:** `https://alperrd.github.io/docora-support/index.html`
- **Destek Merkezi:** `https://alperrd.github.io/docora-support/support.html`
- **Gizlilik Politikası:** `https://alperrd.github.io/docora-support/privacy.html`
- **Hizmet Şartları:** `https://alperrd.github.io/docora-support/terms.html`

---

## 4) Mağaza Konsollarında Kullanılacak Alanlar

| Konsol | Alan Adı | Kullanılacak Link |
| --- | --- | --- |
| **App Store Connect** | Marketing URL (Opsiyonel) | `.../index.html` |
| **App Store Connect** | Support URL (Zorunlu) | `.../support.html` |
| **App Store Connect** | Privacy Policy URL (Zorunlu) | `.../privacy.html` |
| **Google Play Console** | Gizlilik Politikası (Zorunlu) | `.../privacy.html` |
| **Google Play Console** | Hizmet Şartları (Ticari beyan) | `.../terms.html` |

---

## 5) Yapılan Güncellemeler ve Logo Dosyaları

- `assets/logo.png`: Yüklediğiniz 512x512 orijinal Docora logosu.
- `assets/favicon.svg`: Sekmeler için vektörel SVG favicon.
- `assets/favicon-32x32.png` & `assets/favicon-16x16.png`: Standart tarayıcı faviconları.
- `assets/apple-touch-icon.png`: Apple cihazlar için 180x180 web clip ikonu.
- `assets/style.css`: Logo rengine uygun `#c80d25` kırmızı teması ve duyarlı stiller.
- `assets/main.js`: Logo, header, footer ve interaktif hero mockup ekranına yerleştirildi.
