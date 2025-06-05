# REST API dengan Elysia.js

Proyek ini adalah implementasi REST API menggunakan Elysia.js, sebuah framework web TypeScript yang cepat dan efisien. API ini menyediakan manajemen pengguna dan produk dengan autentikasi JWT.

## Fitur

- **Autentikasi JWT**: Login dan register pengguna
- **Manajemen Pengguna**: CRUD untuk pengguna (Admin dan User)
- **Manajemen Produk**: CRUD untuk produk

## Teknologi yang Digunakan

- **Elysia.js**: Framework web TypeScript yang cepat dan efisien
- **Prisma**: ORM untuk manajemen database
- **SQLite**: Database lokal
- **JWT**: Untuk autentikasi
- **Swagger**: Untuk dokumentasi API
- **Bcrypt**: Untuk hashing password

## Struktur Proyek

```
src/
├── db/
│   └── index.ts         # Konfigurasi Prisma client
├── routes/
│   ├── auth/           # Rute autentikasi
│   │   ├── handlers.ts  # Handler untuk login dan register
│   │   └── index.ts     # Definisi rute auth
│   ├── products/       # Rute produk
│   │   ├── handlers.ts  # Handler CRUD untuk produk
│   │   └── index.ts     # Definisi rute produk
│   └── users/          # Rute pengguna
│       ├── handlers.ts  # Handler CRUD untuk pengguna
│       └── index.ts     # Definisi rute pengguna
├── utils/
│   ├── hash.ts         # Fungsi untuk hashing password
│   └── jwt.config.ts   # Konfigurasi JWT
└── index.ts            # Entry point aplikasi
```

## Model Data

Proyek ini menggunakan Prisma dengan SQLite sebagai database. Model data meliputi:

### User

- `id`: String (Primary Key, auto-generated)
- `email`: String (Unique)
- `name`: String
- `password`: String (Hashed)
- `role`: Enum (ADMIN, USER)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Product

- `id`: String (Primary Key, auto-generated)
- `name`: String
- `description`: String (Optional)
- `price`: Float
- `stock`: Integer
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Endpoint API

API ini dikelompokkan dalam beberapa kategori:

### Root

- `GET /`: Halaman selamat datang dengan link ke dokumentasi
- `GET /v1/swagger`: Dokumentasi Swagger

### Auth

- `POST /v1/api/auth/login`: Login pengguna
- `POST /v1/api/auth/register`: Registrasi pengguna baru

### Users (Memerlukan autentikasi)

- `GET /v1/api/user`: Mendapatkan semua pengguna
- `GET /v1/api/user/:id`: Mendapatkan pengguna berdasarkan ID
- `POST /v1/api/user`: Membuat pengguna baru
- `PATCH /v1/api/user/:id`: Memperbarui pengguna
- `DELETE /v1/api/user/:id`: Menghapus pengguna

### Products (Memerlukan autentikasi)

- `GET /v1/api/product`: Mendapatkan semua produk
- `GET /v1/api/product/:id`: Mendapatkan produk berdasarkan ID
- `POST /v1/api/product`: Membuat produk baru
- `PATCH /v1/api/product/:id`: Memperbarui produk
- `DELETE /v1/api/product/:id`: Menghapus produk

## Autentikasi

API ini menggunakan autentikasi Bearer Token JWT. Untuk mengakses endpoint yang dilindungi, sertakan token dalam header:

```
Authorization: Bearer <your_token>
```

Token diperoleh setelah login berhasil.

## Cara Menjalankan

### Prasyarat

- Node.js
- npm atau yarn

### Langkah-langkah

1. Clone repositori

```bash
git clone <repository-url>
cd rest-api-elysia-js
```

2. Install dependensi

```bash
npm install
```

3. Siapkan database

```bash
npx prisma migrate dev
```

4. Jalankan dalam mode development

```bash
npm run dev
```

5. Build untuk production

```bash
npm run build
```

6. Jalankan dalam mode production

```bash
npm start
```

Server akan berjalan di http://localhost:3000 secara default.

## Variabel Lingkungan

Buat file `.env` di root proyek dengan variabel berikut:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
PORT=3000
```
