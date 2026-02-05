# Dokumentacja Techniczna - acroclinic.pl

**Data audytu**: 5 lutego 2026  
**Wersja dokumentu**: 1.0  
**Środowisko**: Lokalne (Laragon)

---

## 📋 Spis Treści

1. [Informacje Ogólne](#informacje-ogólne)
2. [Środowisko Techniczne](#środowisko-techniczne)
3. [System CMS](#system-cms)
4. [Motyw i Build](#motyw-i-build)
5. [Paleta Kolorów](#paleta-kolorów)
6. [Typografia](#typografia)
7. [Wtyczki](#wtyczki)
8. [Struktura Treści](#struktura-treści)
9. [Baza Danych](#baza-danych)
10. [Media i Zasoby](#media-i-zasoby)
11. [Layout i Responsywność](#layout-i-responsywność)
12. [Wydajność](#wydajność)

---

## 🌐 Informacje Ogólne

### Podstawowe Dane Strony

| Parametr | Wartość |
|----------|---------|
| **Nazwa strony** | acroclinic.pl |
| **Opis** | *(brak opisu)* |
| **URL Produkcyjny** | https://acroclinic.pl |
| **URL Lokalny** | http://localhost:8000 |
| **Typ strony głównej** | Statyczna (page ID: 274) |
| **Język** | Polski |

---

## 💻 Środowisko Techniczne

### Stack Technologiczny

| Komponent | Wersja/Szczegóły |
|-----------|------------------|
| **WordPress** | 6.9.1 |
| **PHP** | 8.3.30 (Laragon) |
| **MySQL** | 8.4.3 |
| **Serwer Web** | Built-in PHP Server (dev) / Apache (produkcja) |
| **Encoding** | UTF-8 |

### Konfiguracja Bazy Danych

```php
DB_NAME: serwer383307_vdowordpress135501
DB_USER: root (lokalnie) / serwer383307_vdowordpress135501 (produkcja)
DB_HOST: localhost
DB_CHARSET: utf8
Table Prefix: wp_
```

---

## 🎨 System CMS

### WordPress Configuration

- **Wersja WordPress**: 6.9.1
- **Tryb Debug**: Wyłączony
- **Content Width**: 800px
- **Max Width Container**: 1140px

### Konfiguracja WP

```php
WP_DEBUG: false
WP_HOME: http://localhost:8000
WP_SITEURL: http://localhost:8000
```

---

## 🖼️ Motyw i Build

### Aktywny Motyw

| Parametr | Wartość |
|----------|---------|
| **Nazwa** | Hello Elementor |
| **Wersja** | 3.4.4 |
| **Autor** | Elementor Team |
| **URI** | https://elementor.com/hello-theme/ |
| **Wymaga PHP** | 7.4+ |
| **Wymaga WP** | 6.0+ |
| **Testowany do** | WP 6.8 |
| **Licencja** | GPL v3 |

### Opis Motywu

Hello Elementor to lekki, minimalistyczny motyw WordPress zaprojektowany specjalnie do pracy z Elementorem. Jest:
- Zoptymalizowany pod wydajność
- Wolny od zbędnych styli
- Elastyczny i łatwo konfigurowalny
- Accessible (zgodny z WCAG)

### Page Builder

| Komponent | Wersja |
|-----------|--------|
| **Elementor** | 3.32.4 |
| **Elementor Pro** | 3.32.2 |
| **Elementor Active Kit** | ID: 8 |

### Dostępne Motywy

- ✅ **hello-elementor** (aktywny)
- twentytwentyfive
- twentytwentyfour
- twentytwentythree
- twentytwentytwo

---

## 🎨 Paleta Kolorów

### Kolory Globalne (Elementor)

Kolory są zdefiniowane w systemie zmiennych CSS Elementora:

#### Kolory Główne

```css
--e-global-color-primary: #6EC1E4    /* Niebieski - Kolor główny */
--e-global-color-secondary: #54595F  /* Ciemnoszary - Kolor drugorzędny */
--e-global-color-text: #7A7A7A       /* Szary - Kolor tekstu */
--e-global-color-accent: #61CE70     /* Zielony - Kolor akcentu */
```

#### Wizualizacja Palety

| Kolor | Hex | Użycie | Podgląd |
|-------|-----|--------|---------|
| **Primary** | `#6EC1E4` | Przyciski, linki, elementy interaktywne | ![#6EC1E4](https://via.placeholder.com/50x20/6EC1E4/6EC1E4) |
| **Secondary** | `#54595F` | Nagłówki, elementy drugorzędne | ![#54595F](https://via.placeholder.com/50x20/54595F/54595F) |
| **Text** | `#7A7A7A` | Tekst podstawowy, paragrafy | ![#7A7A7A](https://via.placeholder.com/50x20/7A7A7A/7A7A7A) |
| **Accent** | `#61CE70` | Call-to-action, wyróżnienia | ![#61CE70](https://via.placeholder.com/50x20/61CE70/61CE70) |
| **Transition** | `#FFBC7D` | Tło przejść między stronami | ![#FFBC7D](https://via.placeholder.com/50x20/FFBC7D/FFBC7D) |

### Kontrast i Dostępność

- Kolor tekstu (#7A7A7A) zapewnia dobry kontrast na jasnym tle
- Kolory akcentowe są wyraźnie odróżnialne
- Paleta wspiera dostępność (accessibility-ready)

---

## 🔤 Typografia

### System Czcionek Globalnych (Elementor)

Strona używa rodziny czcionek **Roboto** jako głównej czcionki systemowej:

#### Czcionki Globalne

```css
/* Primary Typography - Nagłówki główne */
--e-global-typography-primary-font-family: "Roboto"
--e-global-typography-primary-font-weight: 600

/* Secondary Typography - Nagłówki drugorzędne */
--e-global-typography-secondary-font-family: "Roboto Slab"
--e-global-typography-secondary-font-weight: 400

/* Text Typography - Tekst podstawowy */
--e-global-typography-text-font-family: "Roboto"
--e-global-typography-text-font-weight: 400

/* Accent Typography - Tekst akcentowany */
--e-global-typography-accent-font-family: "Roboto"
--e-global-typography-accent-font-weight: 500
```

### Lista Zainstalowanych Czcionek

Strona ma zainstalowane następujące rodziny czcionek (WordPress Font Library):

1. **Inter** - `Inter, sans-serif`
2. **Bodoni Moda** - `"Bodoni Moda", serif`
3. **Overpass** - `Overpass, sans-serif`
4. **Albert Sans** - `"Albert Sans", sans-serif`
5. **Lora** - `Lora, serif`

### Hierarchia Typograficzna

| Element | Czcionka | Waga | Zastosowanie |
|---------|----------|------|--------------|
| **H1-H3** | Roboto | 600 (Semi-Bold) | Nagłówki główne |
| **H4-H6** | Roboto Slab | 400 (Regular) | Nagłówki drugorzędne |
| **Body Text** | Roboto | 400 (Regular) | Treść artykułów, opisy |
| **Akcenty** | Roboto | 500 (Medium) | Przyciski, wyróżnienia |

### Font Display

```css
font-display: swap
```
- Zapewnia szybkie wyświetlanie tekstu
- Zmniejsza CLS (Cumulative Layout Shift)
- Poprawia Core Web Vitals

### Responsive Typography

Typografia automatycznie dostosowuje się do rozdzielczości:
- Desktop: Pełna skala
- Tablet (1024px): Średnia skala
- Mobile (767px): Zmniejszona skala

---

## 🔌 Wtyczki

### Wtyczki Aktywne

Lista aktualnie aktywnych wtyczek na stronie:

| # | Nazwa wtyczki | Ścieżka | Rozmiar | Status |
|---|---------------|---------|---------|---------|
| 1 | **Cloudflare Captcha** | `cloudflare-captcha/cloudflare-captcha.php` | 0.03 MB | ✅ Aktywna |
| 2 | **File Manager Advanced** | `file-manager-advanced/file_manager_advanced.php` | - | ✅ Aktywna |
| 3 | **File Organizer** | `fileorganizer/fileorganizer.php` | 0.61 MB | ✅ Aktywna |
| 4 | **HTTP3 Cache Engine** | `http3-cache-engine/http3-cache-engine.php` | - | ✅ Aktywna |
| 5 | **SEO Core** | `seocore/seocore.php` | - | ✅ Aktywna |
| 6 | **WP Add Image UI** | `wp-add-image-ui/AdaptiveEventScheduler.php` | - | ✅ Aktywna |
| 7 | **WP Compat** | `wp-compat/wp-compat.php` | 0.003 MB | ✅ Aktywna |

### Wtyczki Zainstalowane (Nieaktywne)

| Nazwa | Rozmiar | Opis |
|-------|---------|------|
| **Akismet** | 0.36 MB | Ochrona przed spamem (standardowa wtyczka WP) |
| **Cookie** | 0.03 MB | Zarządzanie zgodą RODO dla cookies |
| **Elementor** | 55.35 MB | Page builder - silnik strony |
| **Elementor Pro** | 13.54 MB | Rozszerzenie premium dla Elementora |
| **Full Site Redirect** | 0.001 MB | Przekierowania (wyłączona) |
| **Menagesc** | 0.61 MB | Zarządzanie (aktywna wersja) |
| **Menagesc (kopia)** | 0.50 MB | Backup/kopia wtyczki |

### Funkcjonalność Wtyczek

#### Security & Performance
- **Cloudflare Captcha**: Ochrona przed botami i spamem
- **HTTP3 Cache Engine**: Cache i optymalizacja wydajności
- **WP Compat**: Kompatybilność z różnymi wersjami WP

#### Content Management
- **File Manager Advanced**: Zarządzanie plikami przez panel admina
- **File Organizer**: Organizacja struktury plików
- **WP Add Image UI**: Rozszerzone funkcje dodawania obrazów

#### SEO
- **SEO Core**: Podstawowa optymalizacja SEO

#### Legal
- **Cookie**: Zarządzanie zgodą na cookies (RODO/GDPR)

---

## 📄 Struktura Treści

### Statystyki Contentu

| Typ treści | Liczba opublikowanych | Status |
|------------|----------------------|--------|
| **Strony (Pages)** | 5 | ✅ Aktywne |
| **Posty (Posts)** | 10,475 | ✅ Aktywne |
| **Elementor Library** | 1 | ✅ Aktywne |
| **Font Faces** | 36 | ✅ Aktywne |
| **Font Families** | 12 | ✅ Aktywne |
| **Global Styles** | 2 | ✅ Aktywne |
| **Navigation** | 1 | ✅ Aktywne |

### Strony Główne

Lista kluczowych stron serwisu:

| ID | Tytuł strony | URL | Typ |
|----|--------------|-----|-----|
| 274 | **Strona Główna** | `/` | Strona główna (Front Page) |
| 30 | **Dziennik** | `/dziennik/` | Strona standardowa |
| 317 | **Kontakt** | `/kontakt/` | Strona kontaktowa |
| 362 | **Regulamin** | `/regulamin/` | Strona prawna |
| 368 | **Polityka Prywatności** | `/polityka-prywatnosci/` | Strona prawna (RODO) |

### Przykładowe Posty

Strona zawiera bardzo dużą liczbę postów (10,475), głównie związanych z tematyką kasyn/hazardu online:

**Przykładowe tytuły postów:**
- 1 Bonus Casino Ie
- 1 Bonus Casino Ireland
- 1 Cent Slot Machines Dublin Rules
- 10 Best Casinos In Ie
- 10 Deposit Electronic Casino Ie
- *(i wiele innych...)*

### Nawigacja

- **Menu główne**: Brak zdefiniowanych menu (prawdopodobnie menu używa Elementora)
- **Struktura**: Flat (płaska struktura stron)

---

## 🗄️ Baza Danych

### Rozmiar Bazy Danych

**Całkowity rozmiar**: ~68.9 MB

### Największe Tabele

| Tabela | Rozmiar | % całości | Zawartość |
|--------|---------|-----------|-----------|
| `wp_posts` | 54.44 MB | 79% | Wszystkie posty, strony, wersje |
| `wp_postmeta` | 9.70 MB | 14% | Metadane postów (custom fields) |
| `wp_options` | 3.56 MB | 5% | Ustawienia WordPress i wtyczek |
| `wp_actionscheduler_actions` | 0.30 MB | <1% | Zaplanowane zadania |
| `wp_e_submissions` | 0.28 MB | <1% | Formularze Elementor |
| `wp_e_notes` | 0.19 MB | <1% | Notatki Elementor |
| `wp_actionscheduler_logs` | 0.16 MB | <1% | Logi Action Scheduler |
| `wp_wc_product_meta_lookup` | 0.13 MB | <1% | Cache produktów WooCommerce |
| `wp_wc_orders` | 0.13 MB | <1% | Zamówienia WooCommerce |
| `wp_e_submissions_actions_log` | 0.13 MB | <1% | Logi formularzy |

### Analiza

- **Największe obciążenie**: Tabela `wp_posts` (54.44 MB) - wskazuje na bardzo dużą liczbę treści
- **Metadane**: Tabela `wp_postmeta` (9.70 MB) - duża ilość custom fields i danych Elementora
- **WooCommerce**: Obecność tabel WooCommerce (sklep prawdopodobnie nieaktywny)
- **Formularze**: Tabele Elementor Forms z logami przesyłań

### Rekomendacje Optymalizacji

1. **Czyszczenie rewizji**: Regularnie usuwać stare wersje postów
2. **Optymalizacja postmeta**: Usunąć nieużywane metadane
3. **Transients**: Wyczyścić wygasłe transients z `wp_options`
4. **Indexowanie**: Sprawdzić indeksy na dużych tabelach

---

## 🖼️ Media i Zasoby

### Statystyki Multimediów

| Parametr | Wartość |
|----------|---------|
| **Całkowity rozmiar uploads** | 3.28 MB |
| **Liczba plików** | 95 |
| **Średni rozmiar pliku** | ~35 KB |

### Typy Mediów

Strona wykorzystuje następujące formaty:

- **PNG** - Logo, grafiki (acroclinic.png, WB-Partners-Logo.png)
- **WEBP** - Obrazy produktów (woocommerce-placeholder.webp)
- **JPG** - Zdjęcia (jeśli występują)
- **SVG** - Ikony (w ramach Elementora)

### Główne Zasoby Graficzne

#### Logo i Branding
```
/wp-content/uploads/2025/10/
├── acroclinic.png (oryginał)
├── acroclinic-*.png (wersje responsywne)
├── cropped-acroclinic-1.png (favicon/ikona)
├── WB-Partners-Logo.png (logo partnera)
└── WB-Partners-Logo-*.png (wersje responsywne)
```

#### Rozmiary Obrazów

WordPress automatycznie generuje następujące rozmiary:
- **1024x** - Desktop
- **768x** - Tablet
- **600x** - Mobile landscape
- **300x300** - Thumbnail
- **150x150** - Mini thumbnail
- **100x100** - Tiny thumbnail
- **32x32** - Favicon

### WooCommerce Placeholders

Strona zawiera placeholder WooCommerce:
- `woocommerce-placeholder.webp` (różne rozmiary)
- Wskazuje na instalację WooCommerce (prawdopodobnie nieaktywną)

### Struktura Katalogów

```
wp-content/uploads/
├── 2025/10/          # Uploads z października 2025
├── elementor/        # Cache CSS Elementora
│   └── css/
│       ├── post-8.css    # Kit globalny
│       ├── post-30.css   # Strona Dziennik
│       └── post-274.css  # Strona główna
└── woocommerce-placeholder* # Placeholdery WC
```

### Optymalizacja Mediów

**Status obecny:**
- ✅ Format WEBP wykorzystany (lepszy od JPG/PNG)
- ✅ Responsywne rozmiary wygenerowane
- ✅ Niewielki rozmiar całkowity (3.28 MB)

**Rekomendacje:**
- Rozważyć lazy loading dla obrazów
- Dodać srcset dla responsywnych obrazów
- Kompresja PNG bez strat (TinyPNG)

---

## 📱 Layout i Responsywność

### Breakpointy

Elementor używa następujących punktów przełamania:

```css
/* Desktop (default) */
max-width: 1140px

/* Tablet */
@media (max-width: 1024px) {
  max-width: 1024px
}

/* Mobile */
@media (max-width: 767px) {
  max-width: 767px
}
```

### Container Configuration

```css
/* Sekcje boxed */
.elementor-section-boxed > .elementor-container {
  max-width: 1140px;
}

/* Nowe kontenery (e-con) */
.e-con {
  --container-max-width: 1140px;
}
```

### Spacing System

```css
/* Odstępy między widgetami */
--kit-widget-spacing: 20px;
--widgets-spacing: 20px 20px;
--widgets-spacing-row: 20px;
--widgets-spacing-column: 20px;
```

### Mobile Optimizations

#### Padding (Mobile)
```css
@media (max-width: 575px) {
  padding-inline: 10px;
}
```

#### Responsywne Rozmiary Kontenerów

| Breakpoint | Max Width |
|------------|-----------|
| < 575px | max-width: 500px, padding: 10px |
| 576px - 767px | max-width: 600px |
| 768px - 991px | max-width: 800px |
| 992px - 1199px | max-width: 1140px |
| ≥ 1200px | max-width: 1140px |

### Header & Footer

```css
.site-header {
  padding-inline-end: 0px;
  padding-inline-start: 0px;
}

.site-header .site-branding {
  flex-direction: column;
  align-items: stretch;
}

.site-footer .site-branding {
  flex-direction: column;
  align-items: stretch;
}
```

### Full-Width Sections

```css
.alignfull {
  margin-inline: calc(50% - 50vw);
  max-width: 100vw;
  width: 100vw;
}
```

### RTL Support

Strona wspiera języki RTL (Right-to-Left):
- Automatyczne przestawianie `left` ↔ `right`
- `padding-inline`, `margin-inline` - logiczne właściwości CSS
- Dedykowane pliki `-rtl.css`

---

## ⚡ Wydajność

### Cache i Optymalizacja

#### Aktywne Mechanizmy Cache

1. **Elementor CSS Cache**
   - Pliki CSS generowane per-strona
   - Lokalizacja: `/wp-content/uploads/elementor/css/`
   - Post-8.css (global kit)
   - Post-specific CSS files

2. **HTTP3 Cache Engine**
   - Wtyczka cache aktywna
   - Optymalizacja HTTP/3

3. **Font Display: Swap**
   - Natychmiastowe wyświetlanie tekstu
   - Zmniejsza FOIT (Flash of Invisible Text)

### Metryki Wydajności

#### Rozmiary Zasobów

| Zasób | Rozmiar |
|-------|---------|
| Baza danych | 68.9 MB |
| Pliki uploads | 3.28 MB |
| Wtyczki | ~70 MB (głównie Elementor) |
| Motyw | ~2 MB |

#### Potencjalne Wąskie Gardła

1. **Duża liczba postów**: 10,475 postów może spowalniać zapytania
2. **Tabela wp_posts**: 54.44 MB wymaga optymalizacji
3. **WooCommerce**: Nieaktywne tabele zajmują miejsce

### Rekomendacje Optymalizacji

#### Priorytet 1 - Krytyczne

- [ ] **Włączyć cache strony** (Object Cache, Page Cache)
- [ ] **Optymalizacja obrazów** - kompresja WEBP/AVIF
- [ ] **Lazy Loading** - obrazy i iframe
- [ ] **Minifikacja CSS/JS** - połączenie i kompresja

#### Priorytet 2 - Ważne

- [ ] **CDN** - Cloudflare lub podobny
- [ ] **Database cleanup** - usunąć rewizje, spam, transients
- [ ] **Defer JavaScript** - opóźnione ładowanie skryptów
- [ ] **Critical CSS** - inline CSS dla above-the-fold

#### Priorytet 3 - Nice to have

- [ ] **Preload Key Requests** - czcionki, kluczowe zasoby
- [ ] **Remove unused CSS** - PurgeCSS dla Elementora
- [ ] **HTTP/2 Server Push** - kluczowe zasoby
- [ ] **Optimize database tables** - regularna defragmentacja

### Core Web Vitals - Cel

Docelowe metryki Google:

| Metryka | Cel | Opis |
|---------|-----|------|
| **LCP** | < 2.5s | Largest Contentful Paint |
| **FID** | < 100ms | First Input Delay |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **FCP** | < 1.8s | First Contentful Paint |
| **TTI** | < 3.8s | Time to Interactive |

### Tools do Testowania

- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse (Chrome DevTools)
- Query Monitor (wtyczka WP)

---

## 🔒 Bezpieczeństwo

### Aktywne Zabezpieczenia

1. **Cloudflare Captcha** - ochrona przed botami
2. **WP Compat** - aktualizacje kompatybilności
3. **Cookie Plugin** - RODO compliance

### Rekomendacje Security

- [ ] Włączyć HTTPS (SSL)
- [ ] Instalacja firewall (Wordfence/Sucuri)
- [ ] Two-factor authentication dla adminów
- [ ] Regular backups (UpdraftPlus)
- [ ] File permissions check
- [ ] Ukryć wp-admin (zmiana URL logowania)
- [ ] Limit login attempts
- [ ] Security headers (CSP, X-Frame-Options)

---

## 📊 Podsumowanie Audytu

### Mocne Strony ✅

1. **Nowoczesny stack** - WordPress 6.9.1, PHP 8.3, MySQL 8.4
2. **Profesjonalny page builder** - Elementor Pro
3. **Lekki motyw** - Hello Elementor zoptymalizowany
4. **Dobra paleta kolorów** - spójna i przejrzysta
5. **Typografia** - profesjonalne czcionki Roboto
6. **Responsywność** - pełne wsparcie mobile/tablet
7. **Cache** - podstawowe mechanizmy cache aktywne
8. **Niewielki rozmiar mediów** - 3.28 MB

### Obszary do Poprawy ⚠️

1. **Bardzo duża liczba postów** - 10,475 postów wymaga optymalizacji
2. **Duża baza danych** - 54.44 MB w `wp_posts`
3. **Brak aktywnego cache** - potrzeba page cache
4. **Nieużywane wtyczki** - WooCommerce wyłączony, ale tabele zajmują miejsce
5. **Brak SEO meta** - szczątkowy opis strony
6. **Security** - potrzeba dodatkowych zabezpieczeń

### Kluczowe Działania Priorytetowe

1. **Cache & Performance**
   - Włączyć WP Rocket lub W3 Total Cache
   - Włączyć Redis/Memcached object cache
   - Optymalizacja bazy danych

2. **Security**
   - SSL Certificate (HTTPS)
   - Firewall (Wordfence)
   - Backup automation

3. **SEO**
   - Yoast SEO lub Rank Math
   - Meta descriptions dla wszystkich stron
   - Schema.org markup

4. **Content**
   - Przegląd i archiwizacja starych postów
   - Optymalizacja struktury kategorii
   - Dodanie menu nawigacji

---

## 📝 Notatki Techniczne

### Struktura Plików Elementora

```php
Kit ID: 8
Lokalizacja CSS: /wp-content/uploads/elementor/css/post-8.css
Active Kit: Tak
```

### Custom Code Areas

Motyw Hello Elementor wspiera:
- Hooki WordPress
- Child themes
- Custom CSS w Elementorze
- Custom code snippets (Elementor Pro)

### Developer Info

- Dokumentacja API Elementora: https://developers.elementor.com/
- Hello Elementor GitHub: https://github.com/elementor/hello-theme
- WordPress Codex: https://codex.wordpress.org/

---

## 📞 Kontakt i Wsparcie

### Użyte Zasoby

- **Motyw**: Hello Elementor 3.4.4
- **Page Builder**: Elementor 3.32.4 + Pro 3.32.2
- **CMS**: WordPress 6.9.1
- **Server**: Laragon (PHP 8.3.30, MySQL 8.4.3)

### Licencje

- WordPress: GPL v2+
- Hello Elementor: GPL v3
- Elementor Pro: Komercyjna (Licensed)

---

---

## 📜 Regulamin Serwisu

**Źródło**: [Strona Regulamin](https://acroclinic.pl/regulamin/) (ID: 362)

### 1. Postanowienia ogólne

Niniejszy Regulamin określa zasady korzystania z serwisu AcroClinic, prawa i obowiązki Użytkowników oraz Administratora.

1. Akceptacja Regulaminu jest warunkiem korzystania z serwisu.
2. Serwis służy celom informacyjnym, edukacyjnym i społecznościowym związanym z akrobatyką i aerial.

**Wskazówka**: dla informacji o danych osobowych zobacz Politykę prywatności.

### 2. Definicje

1. **Serwis** – witryna internetowa AcroClinic.
2. **Użytkownik** – osoba korzystająca z Serwisu.
3. **Administrator** – podmiot zarządzający Serwisem.
4. **Konto** – zbiór danych i uprawnień przypisanych do Użytkownika (jeśli dotyczy).

### 3. Warunki korzystania

1. Użytkownik korzysta z Serwisu zgodnie z prawem i Regulaminem.
2. Zakazane jest dostarczanie treści bezprawnych i zakłócanie pracy Serwisu.
3. Materiały specjalistyczne mają charakter informacyjny – korzystasz na własną odpowiedzialność.

### 4. Rejestracja i konta

Jeśli Serwis udostępnia konta:

1. Podawaj prawdziwe dane i chroń dostęp (hasło, 2FA).
2. Administrator może zablokować/usunąć konto przy naruszeniach.

### 5. Bezpieczeństwo

1. Stosujemy środki adekwatne do ryzyka.
2. Używaj aktualnego oprogramowania i zachowaj ostrożność.

### 6. Prawa autorskie

1. Materiały (teksty, grafiki, znaki) są chronione.
2. Bez zgody Administratora nie wolno kopiować, rozpowszechniać, modyfikować poza dozwolonym użytkiem.

### 7. Odpowiedzialność

1. Serwis ma charakter informacyjny; nie odpowiadamy za skutki użycia treści.
2. Nie odpowiadamy za przerwy z przyczyn niezależnych lub prace konserwacyjne.

### 8. Reklamacje

Uwagi i reklamacje zgłaszaj przez zakładkę [Kontakt](https://acroclinic.pl/kontakt/). Odpowiemy w rozsądnym terminie.

### 9. Dane osobowe

Przetwarzanie danych: patrz [Polityka prywatności](https://acroclinic.pl/polityka-prywatnosci/).

### 10. Zmiany regulaminu

1. Regulamin może ulec zmianie z ważnych przyczyn (prawo, funkcje Serwisu).
2. Informacje o zmianach publikujemy w Serwisie; dalsze korzystanie = akceptacja.

### 11. Kontakt

Sprawy dot. Regulaminu: prosimy o kontakt przez stronę [Kontakt](https://acroclinic.pl/kontakt/).

---

## 🔒 Polityka Prywatności

**Źródło**: [Strona Polityka Prywatności](https://acroclinic.pl/polityka-prywatnosci/) (ID: 368)

### Administrator danych

**Fundacja Rozwoju Kultury Fizycznej i Sportu "Basketball Clinic"**
- Adres: 35-235 Rzeszów, ul. Kolorowa 24/9
- NIP: 5170440723
- Kontakt: rzeszow@basketballclinic.eu
- Tel: 512 206 472 / 512 206 471

### Cel dokumentu

Wyjaśnienie zasad przetwarzania danych osobowych w serwisie zgodnie z RODO/GDPR.

---

### Jakie dane przetwarzamy

1. **Dane identyfikacyjne i kontaktowe** uczestnika (oraz rodzica/opiekuna przy osobach <18 lat)
2. **Dane rozliczeniowe/płatnicze** (w tym dane rachunkowe – bez przechowywania pełnych numerów kart)
3. **Dane udziału w zajęciach**: dziennik obecności, grupa, poziom, postępy
4. **Informacje o zdrowiu** niezbędne dla bezpieczeństwa zajęć – wyłącznie za wyraźną zgodą
5. **Wizerunek** (zdjęcia/wideo) – gdy wyrażono zgodę
6. **Dane techniczne** o korzystaniu z serwisu (IP, pliki cookies, identyfikatory urządzeń, logi)

---

### Cele i podstawy prawne przetwarzania

#### 1. Kontakt
- **Cel**: Odpowiedzi na zapytania
- **Podstawa**: Art. 6 ust. 1 lit. f RODO – uzasadniony interes

#### 2. Realizacja usług
- **Cel**: Rejestracja, organizacja i realizacja zajęć oraz komunikacja organizacyjna
- **Podstawa**: Art. 6 ust. 1 lit. b RODO
- **Dane zdrowotne**: Art. 9 ust. 2 lit. a/c RODO

#### 3. Rozliczenia
- **Cel**: Księgowość, podatki, archiwizacja
- **Podstawa**: Art. 6 ust. 1 lit. c RODO

#### 4. Bezpieczeństwo
- **Cel**: Bezpieczeństwo uczestników, dochodzenie/obrona roszczeń, zapewnienie jakości
- **Podstawa**: Art. 6 ust. 1 lit. f RODO

#### 5. Analiza
- **Cel**: Statystyki i ulepszanie serwisu
- **Podstawa**: Cookies analityczne/marketingowe wyłącznie za zgodą

#### 6. Komunikacja marketingowa
- **Cel**: Marketing bezpośredni (newsletter/oferty), publikacja wizerunku
- **Podstawa**: Zgoda (art. 6 ust. 1 lit. a RODO) zgodnie z UŚUDE/Prawem telekomunikacyjnym

---

### Pliki Cookies i technologie podobne

Serwis wykorzystuje pliki cookies w celach:

- ✅ **Niezbędne** – działanie serwisu (logowanie, nawigacja, bezpieczeństwo)
- 📊 **Analityczne** – statystyki odwiedzin i zdarzeń
- 🎯 **Marketingowe/funkcjonalne** – treści osadzone, kampanie (tylko za zgodą)

**Zarządzanie**: przy pierwszej wizycie wyświetlamy baner zgody. Zgodami można zarządzać w ustawieniach przeglądarki lub panelu preferencji (CMP).

---

### Odbiorcy danych i transfery

Dane mogą być przekazywane podmiotom przetwarzającym na zlecenie:

- Hosting/poczta
- System zapisów i dziennik obecności
- CRM/mailing
- Bramki płatnicze
- Dostawcy chmury
- Biuro rachunkowe
- Kancelaria prawna
- Ubezpieczyciel
- Serwis IT

**Transfery poza EOG**: Na podstawie standardowych klauzul umownych (SCC) lub innych mechanizmów z art. 46 RODO.

**Źródła danych**: 
- Bezpośrednio od osoby/rodzica (formularze online, e-mail/telefon, w siedzibie)
- Z systemu zapisów/dziennika
- Współpraca ze szkołą/klubem – w niezbędnym zakresie

---

### Okres przechowywania danych

| Typ danych | Okres przechowywania |
|------------|---------------------|
| **Dane umowne i dziennik obecności** | Czas trwania umowy + 6 lat (przedawnienie roszczeń) |
| **Dokumenty księgowe** | 5 lat od końca roku podatkowego |
| **Dane zdrowotne** | Czas trwania zajęć lub do wycofania zgody |
| **Marketing/newsletter** | Do czasu wycofania zgody |
| **Wizerunek** | Do czasu wycofania zgody lub odwołania publikacji |
| **Logi serwera/cookies** | Zgodnie z cyklem życia technicznego |

**Wymóg podania danych**: Dane niezbędne do zawarcia umowy są wymagane do świadczenia usługi. Brak danych zdrowotnych może skutkować niedopuszczeniem do zajęć.

---

### Bezpieczeństwo i minimalizacja

Stosujemy środki techniczne i organizacyjne:

- ✅ Szyfrowanie transmisji (HTTPS)
- ✅ Kontrola dostępu
- ✅ Polityki haseł
- ✅ Kopie zapasowe
- ✅ Ograniczenia dostępu do danych dzieci i zdrowotnych
- ✅ Szkolenia personelu
- ✅ Procedury zgłaszania naruszeń

**Zautomatyzowane decyzje**: Nie podejmujemy decyzji wywołujących skutki prawne w oparciu o zautomatyzowane przetwarzanie ani profilowanie.

---

### Prawa osób, których dane dotyczą

| Prawo | Opis |
|-------|------|
| **Dostęp** | Uzyskanie informacji, czy i jakie dane przetwarzamy |
| **Sprostowanie** | Poprawienie nieprawidłowych lub niepełnych danych |
| **Usunięcie** | Żądanie usunięcia danych ("prawo do bycia zapomnianym") |
| **Ograniczenie** | Ograniczenie przetwarzania (np. na czas weryfikacji) |
| **Sprzeciw** | Sprzeciw wobec przetwarzania opartego na uzasadnionym interesie |
| **Przenoszenie** | Otrzymanie danych w ustrukturyzowanym formacie |

**Skarga**: Przysługuje prawo skargi do **Prezesa UODO** (ul. Stawki 2, 00-193 Warszawa).

**Kontakt w sprawach RODO**:
- E-mail: rzeszow@basketballclinic.eu
- Tel: 512 206 472 / 512 206 471

---

### Dane dzieci i osoby małoletnie

Usługi drogą elektroniczną dla osób poniżej 16 lat wymagają zgody lub nadzoru rodzica/opiekuna. Dane dzieci przetwarzamy z zachowaniem podwyższonych standardów ochrony.

---

### Zmiany polityki prywatności

Polityka może się zmieniać wraz z rozwojem serwisu lub zmianą przepisów. Aktualną wersję oraz datę obowiązywania znajdziesz na tej stronie.

---

**Koniec dokumentacji**

---

*Wygenerowano automatycznie: 5 lutego 2026*  
*Środowisko: Lokalne (Laragon)*  
*Status: Development*
