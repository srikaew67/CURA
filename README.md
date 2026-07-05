# CST Proactive Commerce

แชตบอต AI สำหรับงาน customer service และ proactive commerce ตอบคำถามลูกค้าโดยอ้างอิงข้อมูลสินค้าจากฐานข้อมูลจริง พร้อมระบบจัดการสินค้าสำหรับฝั่งบริษัท ขับเคลื่อนด้วย OpenAI Responses API และ Supabase

## สถาปัตยกรรมระบบ

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│            (React 19 + TypeScript + Vite)                   │
│                    localhost:5173                           │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP API
┌─────────────────────▼───────────────────────────────────────┐
│                        Backend                              │
│                (Node.js Native HTTP Server)                 │
│                    localhost:8000                           │
├─────────────────────────────────────────────────────────────┤
│  handlers/  →  services/  →  clients/                      │
│  (auth, chat, company, product)                             │
└──────────┬──────────────────────────┬───────────────────────┘
           │                          │
           ▼                          ▼
┌──────────────────┐        ┌──────────────────────┐
│   Supabase DB    │        │     OpenAI API        │
│ (PostgreSQL)     │        │  (Responses API)      │
│ ─────────────    │        │                       │
│ companies        │        │ - ตอบคำถามลูกค้า       │
│ products         │        │ - ใช้ product catalog  │
│ conversations    │        │   เป็น context         │
└──────────────────┘        └──────────────────────┘
```

## โครงสร้างโปรเจกต์

```text
.
├── backend/
│   ├── server.js              # โหลด env และเริ่ม HTTP server
│   ├── scripts/
│   │   └── check-syntax.js    # ตรวจ syntax backend
│   └── src/
│       ├── app.js             # routing หลักของ backend
│       ├── clients/           # HTTP client สำหรับ OpenAI และ Supabase
│       ├── config/            # อ่านค่า environment variables
│       ├── handlers/          # request handlers (auth, chat, company, product)
│       ├── services/          # business logic เช่น chat service
│       └── utils/             # helper functions (http, status)
├── frontend/
│   └── src/
│       ├── App.tsx            # route หลักของ frontend
│       ├── page/              # หน้า home, demo, company, customer, login
│       ├── services/          # API wrapper, auth context
│       ├── shared/            # component ที่ใช้ร่วมกัน เช่น Navbar
│       └── utils/             # Supabase client
├── scripts/
│   └── sync-env.js            # sync .env จาก root ไปยัง frontend/.env
├── .env.example               # ตัวอย่าง environment variables ทั้งหมด
├── Makefile
└── README.md
```

## เริ่มต้นใช้งาน

### ข้อกำหนดเบื้องต้น

- Node.js 20+
- บัญชี Supabase พร้อม project ที่ตั้งค่าตาราง `companies`, `products` และ `conversations`
- OpenAI API Key

### 1. ตั้งค่า Environment Variables

โปรเจกต์นี้ใช้ไฟล์ `.env` ไฟล์เดียวที่ **root ของโปรเจกต์** เป็น source of truth ทั้งหมด:

- **Backend** (`server.js`) อ่านค่าจาก root `.env` โดยตรง
- **Frontend** รับค่า `VITE_*` ผ่านสคริปต์ `scripts/sync-env.js` ที่ generate `frontend/.env` ให้อัตโนมัติ

สร้างไฟล์ `.env` จาก template:

```bash
cp .env.example .env
```

แล้วแก้ไขค่าในไฟล์ `.env` ที่ root:

```env
# Backend
PORT=8080
FRONTEND_ORIGIN=http://localhost:5173

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # ถ้ามีจะ override anon key (backend เท่านั้น)

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini

# Frontend (Vite) — sync-env.js จะ copy ค่าเหล่านี้ไปยัง frontend/.env อัตโนมัติ
VITE_API_URL=http://localhost:8080
```

> **หมายเหตุ:** ห้าม commit ไฟล์ `.env` หรือ secret key ขึ้น repository

### 2. ติดตั้ง Backend

```bash
cd backend
npm install
```

### 3. ติดตั้ง Frontend

```bash
cd frontend
npm install
```

### 4. รันโปรเจกต์

เปิด terminal สองหน้าต่าง แล้วรันแยกกัน:

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

### 5. เข้าใช้งาน

| บริการ | URL |
| --- | --- |
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Health Check | http://localhost:8080/health |

## API หลักของ Backend

| Method | Path | หน้าที่ |
| --- | --- | --- |
| `GET` | `/health` | ตรวจสอบว่า backend ทำงานอยู่ |
| `POST` | `/api/chat` | ส่งข้อความไปให้ AI agent ตอบ |
| `POST` | `/api/auth/login` | login สำหรับบริษัท |
| `GET` | `/api/companies` | ดึงรายชื่อบริษัท |
| `GET` | `/api/products/catalog` | ดึงรายการสินค้าทั้งหมด (พร้อมชื่อบริษัท) |
| `GET` | `/api/products?company_id=...` | ดึงสินค้าของบริษัท |
| `POST` | `/api/products` | เพิ่มสินค้า |
| `PUT` | `/api/products?id=...` | แก้ไขสินค้า |
| `DELETE` | `/api/products?id=...` | ลบสินค้า |

## ฐานข้อมูล (Supabase)

| ตาราง | หน้าที่ |
| --- | --- |
| `companies` | เก็บข้อมูลบริษัทและใช้ยืนยันตัวตนตอน login |
| `products` | เก็บข้อมูลสินค้าของแต่ละบริษัท |
| `conversations` | บันทึกประวัติการสนทนาพร้อม `previous_response_id` เพื่อให้บทสนทนาต่อเนื่อง |

## ฟีเจอร์หลัก

- **หน้า Landing/Home** — แนะนำภาพรวมของระบบ
- **หน้า Demo** — ทดลองคุยกับ customer service AI
- **หน้า Product Catalog** — ให้ลูกค้าดูรายการสินค้าทั้งหมด
- **หน้า Company Dashboard** — เพิ่ม แก้ไข และลบสินค้า (ต้อง login)
- **AI ที่อ้างอิงข้อมูลจริง** — OpenAI Responses API ใช้ product catalog จาก Supabase เป็น context
- **Session Memory** — บันทึก `previous_response_id` เพื่อให้บทสนทนาต่อเนื่อง
- **รองรับสองภาษา** — ตอบเป็นภาษาไทยหรืออังกฤษตามภาษาที่ผู้ใช้ถาม

## การ Login ฝั่งบริษัท

ระบบ login ทำแบบง่ายสำหรับ demo โดย username และ password ต้องเหมือนกัน และจะ match แบบ case-insensitive กับชื่อบริษัทในตาราง `companies`

```text
username: acme
password: acme
```

## การตรวจสอบก่อนส่งงาน

```bash
# ตรวจ syntax backend
cd backend && npm run check

# Build และ type-check frontend
cd frontend && npm run build

# ตรวจ lint frontend
cd frontend && npm run lint
```

## สิ่งที่ได้เรียนรู้จากโปรเจกต์นี้

โปรเจกต์นี้ช่วยให้ได้ฝึกทำระบบแบบ full-stack ตั้งแต่ frontend, backend, API routing, การเชื่อมต่อฐานข้อมูล Supabase และการเรียกใช้ OpenAI API จุดที่น่าสนใจคือการทำให้ AI ไม่ได้ตอบจากความรู้ทั่วไปอย่างเดียว แต่ใช้ข้อมูลสินค้าจากฐานข้อมูลมาประกอบคำตอบ ซึ่งใกล้เคียงกับงานจริงมากขึ้น


## แนวทางพัฒนาต่อ

- เพิ่มระบบ authentication ที่ปลอดภัยกว่านี้ เช่น Supabase Auth
- เพิ่ม role ของผู้ใช้ เช่น admin, company และ customer
- เพิ่มระบบ upload รูปสินค้า
- เพิ่มหน้าประวัติการสนทนาของลูกค้า
- เพิ่มระบบ recommendation สินค้าจากพฤติกรรมหรือคำถามของลูกค้า
- เพิ่ม test สำหรับ backend และ frontend