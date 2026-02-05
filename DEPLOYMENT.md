# 🚀 DEPLOYMENT CHECKLIST - Acro Clinic Shop

## ✅ GOTOWE DO PRODUKCJI

### Frontend
- ✅ Wszystkie hardcoded URLs zmienione na zmienne środowiskowe
- ✅ Build scripts skonfigurowane (`npm run build`, `npm run build:admin`)
- ✅ Responsywny design (mobile-first)
- ✅ SEO friendly routing
- ✅ Optymalizacja obrazów (Cloudinary)
- ✅ Error handling i loading states
- ✅ Toast notifications (sonner)

### Backend
- ✅ Express server z TypeScript
- ✅ Prisma ORM z PostgreSQL (NeonDB)
- ✅ JWT authentication z refresh tokens
- ✅ Rate limiting (express-rate-limit)
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ Email integration (Resend)
- ✅ Payment gateway (PayU)

### Baza danych
- ✅ Prisma schema z wszystkimi modelami
- ✅ Migrations
- ✅ Seed data script
- ✅ NeonDB PostgreSQL (production-ready)

### Bezpieczeństwo
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens z expiration
- ✅ Environment variables dla secrets
- ✅ CORS whitelist
- ✅ Rate limiting na endpoints
- ✅ Input validation (zod)
- ✅ SQL injection protection (Prisma)

---

## 📋 KROKI DEPLOYMENT

### 1. Przygotowanie środowiska produkcyjnego

#### Backend (.env)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL="your-neondb-production-url"
FRONTEND_URL=https://your-domain.com

JWT_SECRET="generate-strong-random-secret"
JWT_REFRESH_SECRET="generate-another-strong-secret"

# PayU Production
PAYU_POS_ID="your-production-pos-id"
PAYU_SECOND_KEY="your-production-key"
PAYU_CLIENT_ID="your-production-client-id"
PAYU_CLIENT_SECRET="your-production-secret"
PAYU_BASE_URL="https://secure.payu.com"
PAYU_SANDBOX="false"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Resend
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM="Acro Clinic <noreply@your-domain.com>"

BACKEND_URL=https://api.your-domain.com
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://api.your-domain.com/api
VITE_SHOP_URL=https://your-domain.com
VITE_ADMIN_URL=https://admin.your-domain.com
```

### 2. Build aplikacji

```bash
# Frontend - Shop
npm run build

# Frontend - Admin Panel
npm run build:admin

# Backend
cd server
npm run build
```

### 3. Deployment opcje

#### ✅ Rekomendowana: Vercel (Frontend + Admin) + Render (Backend)

##### Render - Backend API

1. **Połącz repo z Render:**
   - Idź do https://dashboard.render.com
   - New → Web Service
   - Connect GitHub repository
   - **Root Directory:** `server`

2. **Konfiguracja Build:**
   - **Build Command:** `npm install && npm run build && npx prisma generate`
   - **Start Command:** `npm start`
   - **Environment:** Node

3. **Zmienne środowiskowe (ustaw w Render Dashboard):**
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<twój NeonDB URL>
   FRONTEND_URL=https://twoja-domena.vercel.app
   JWT_SECRET=<wygeneruj silny secret>
   JWT_REFRESH_SECRET=<wygeneruj drugi secret>
   PAYU_POS_ID=<production POS ID>
   PAYU_SECOND_KEY=<production key>
   PAYU_CLIENT_ID=<production client id>
   PAYU_CLIENT_SECRET=<production secret>
   PAYU_BASE_URL=https://secure.payu.com
   PAYU_SANDBOX=false
   CLOUDINARY_CLOUD_NAME=<twój cloud name>
   CLOUDINARY_API_KEY=<twój api key>
   CLOUDINARY_API_SECRET=<twój api secret>
   RESEND_API_KEY=<twój resend key>
   RESEND_FROM=Acro Clinic <noreply@twoja-domena.pl>
   BACKEND_URL=https://twoja-app.onrender.com
   ```

4. **Plik konfiguracyjny:** `server/render.yaml` (już utworzony ✅)

##### Vercel - Sklep (Frontend)

1. **Połącz repo z Vercel:**
   - Idź do https://vercel.com
   - Import → GitHub repository
   - Framework: Vite

2. **Konfiguracja:**
   - **Root Directory:** `.` (główny folder)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Zmienne środowiskowe:**
   ```
   VITE_API_URL=https://twoja-app.onrender.com/api
   ```

4. **Plik konfiguracyjny:** `vercel.json` (już utworzony ✅)

##### Vercel - Admin Panel (osobny projekt)

1. **Nowy projekt w Vercel:**
   - Import → ten sam GitHub repository
   - Framework: Vite

2. **Konfiguracja:**
   - **Root Directory:** `admin`
   - **Build Command:** `cd .. && npm run build:admin`
   - **Output Directory:** `../dist-admin`

3. **Zmienne środowiskowe:**
   ```
   VITE_API_URL=https://twoja-app.onrender.com/api
   ```

4. **Plik konfiguracyjny:** `admin/vercel.json` (już utworzony ✅)

---

## 📦 CACHE - Gdzie co przechowywać

### 1. Obrazy → Cloudinary CDN (już masz ✅)
- Cloudinary automatycznie cachuje obrazy na edge servers globalnie
- Transformacje (resize, format) są cache'owane
- Nie musisz nic robić - działa out of the box

### 2. Statyczne pliki (JS, CSS) → Vercel Edge Cache
- `vercel.json` już skonfigurowany z Cache-Control headers
- Pliki z hashem w nazwie: **1 rok cache** (`immutable`)
- Obrazy lokalne: 1 dzień + stale-while-revalidate

### 3. API Responses → Opcjonalnie Redis (dla dużego ruchu)

Dla sklepu o małym/średnim ruchu **NIE potrzebujesz Redis**.
Prisma + NeonDB z connection pooling wystarczy.

Jeśli w przyszłości potrzebujesz cache dla API:

**Opcja A: Upstash Redis (serverless, darmowy tier - REKOMENDOWANE)**
```bash
# Zarejestruj się na upstash.com
# Utwórz Redis database (region: Frankfurt)
# Dodaj zmienne:
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

**Opcja B: Render Redis ($7/mies)**
```bash
# W Render Dashboard: New → Redis
# Dodaj zmienną: REDIS_URL=<render redis url>
```

### 4. Session/Auth → JWT + Cookies (już masz ✅)
- JWT tokens są stateless - nie wymagają cache
- Refresh tokens w httpOnly cookies
- Brak dodatkowych wymagań

### 5. Koszyk → Baza danych + localStorage
- Gość: localStorage (client-side)
- Zalogowany: baza danych (już zaimplementowane ✅)

---

## 🔄 Architektura Produkcyjna (Diagram)

```
┌──────────────────────────────────────────────────────────────┐
│                        UŻYTKOWNIK                            │
└──────────────────────────┬───────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   VERCEL     │  │   VERCEL     │  │  CLOUDINARY  │
│   (Sklep)    │  │   (Admin)    │  │  (Obrazy)    │
│   FREE TIER  │  │   FREE TIER  │  │   FREE TIER  │
│              │  │              │  │              │
│ Edge Cache:  │  │ Edge Cache:  │  │ CDN Cache:   │
│ JS/CSS/HTML  │  │ JS/CSS/HTML  │  │ Transformacje│
└──────┬───────┘  └──────┬───────┘  └──────────────┘
       │                 │
       └────────┬────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│                    RENDER (Backend API)                      │
│                    Starter: $7/mies                          │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  Express Server │  │  Upstash Redis  │ ◄── OPCJONALNIE   │
│  │  (Node.js)      │  │  (Darmowy tier) │                   │
│  └────────┬────────┘  └─────────────────┘                   │
│           │                                                  │
└───────────┼──────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────────┐
│                      NEONDB (PostgreSQL)                     │
│              Serverless - Darmowy tier (0.5GB)               │
│              Pro: $19/mies (10GB + autoscaling)              │
└──────────────────────────────────────────────────────────────┘
```

---

## 💰 Szacunkowe koszty (miesięcznie)

| Usługa       | Plan         | Koszt    |
|--------------|--------------|----------|
| Vercel       | Free/Hobby   | $0       |
| Render       | Starter      | $7       |
| NeonDB       | Free/Pro     | $0-19    |
| Cloudinary   | Free         | $0       |
| Upstash      | Free         | $0       |
| **RAZEM**    |              | **$7-26** |

---

#### Opcja B: VPS (DigitalOcean, Hetzner, etc.)

3. Start command: `npm start`
4. Build command: `npm run build`

#### Opcja B: VPS (DigitalOcean, Hetzner, etc.)

```bash
# Nginx jako reverse proxy
# PM2 do zarządzania procesami Node.js
# Certbot dla SSL (Let's Encrypt)
```

### 4. Baza danych (NeonDB)

- ✅ NeonDB już skonfigurowany
- Skopiuj production DATABASE_URL
- Uruchom migracje: `npx prisma migrate deploy`
- Opcjonalnie seed data: `npm run db:seed`

### 5. DNS Configuration

```
A     @              -> IP serwera lub Vercel
A     api            -> IP backend serwera
A     admin          -> IP serwera lub Vercel
```

### 6. SSL Certificates

- Użyj Let's Encrypt (certbot) dla VPS
- Vercel/Railway automatycznie zapewniają SSL

---

## ⚠️ PRZED DEPLOYMENT - DO ZROBIENIA

### Krytyczne:
1. **Zmienić klucze API PayU na produkcyjne**
2. **Wygenerować silne JWT secrets**
3. **Skonfigurować domenę w Resend** (zamiast onboarding@resend.dev)
4. **Zaktualizować CORS allowedOrigins** na produkcyjne domeny
5. **Zmienić admin password** (current: `Admin123!`)

### Opcjonalne:
1. Dodać Google Analytics
2. Skonfigurować monitoring (Sentry)
3. Dodać backup bazy danych
4. Skonfigurować CDN dla obrazów
5. Dodać cache layer (Redis)

---

## 🧪 TESTOWANIE PRZED LIVE

```bash
# Test buildu lokalnie
npm run build
npm run preview

# Test backend w production mode
cd server
NODE_ENV=production npm start
```

---

## 📊 MONITORING (post-deployment)

- Backend health: `https://api.your-domain.com/api/health`
- Database: NeonDB dashboard
- Errors: Sprawdzaj logi serwera
- PayU: Dashboard PayU dla transakcji

---

## 🔧 MAINTENANCE

### Update dependencies:
```bash
npm update
cd server && npm update
```

### Database migrations:
```bash
cd server
npx prisma migrate deploy
```

### Restart services:
```bash
pm2 restart all  # dla VPS
```

---

## 📞 WSPARCIE

Email: support@wb-partners.pl
Telefon: 570 034 367

---

**Status:** ✅ GOTOWE DO DEPLOYMENT
**Ostatnia aktualizacja:** 5 lutego 2026
