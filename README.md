# 📦 FastParcel Express — Full-Stack MERN Parcel Delivery System

A complete, production-grade **MERN (MongoDB, Express, React, Node.js)** Parcel Delivery & Logistics Management Platform with real-time consignment tracking, live price calculation, multi-role access (Customer, Driver, Admin Dispatcher), and printable official airbill shipping labels.

Developed in: `X:\Simple Website\Parcel Delivery website`

---

## 🌟 Key Highlights & Features

### 1. 🔍 Consignment Tracking Engine
- **Instant Public Tracking**: Enter tracking numbers (e.g., `TRK-784920`) without requiring login.
- **Visual Checkpoint Timeline**: Step-by-step progress tracking (Order Placed &rarr; Driver Assigned &rarr; Picked Up &rarr; In Transit &rarr; At Sorting Hub &rarr; Out for Delivery &rarr; Delivered).
- **Proof of Delivery**: Displays recipient digital signature, timestamp, and courier delivery notes upon completion.
- **Printable Air Waybill Shipping Label**: Generate printable labels with simulated barcodes, QR codes, shipper/consignee address blocks, and weight classifications.

### 2. 💰 Intelligent Rate Estimator
- Instant dynamic price calculator based on:
  - Base freight rate
  - Weight in KG (sliding scale)
  - Speed tier: Standard (3-5 days), Express (1-2 days), Same Day (Today), Priority Overnight
  - Package category handling: Documents, Fragile, Electronics, Heavy Goods
  - Regulatory tax breakdown (5%)
- Service comparison matrix comparing delivery windows and total costs.

### 3. 📦 Online Parcel Booking
- Multi-step parcel creation:
  - Sender (shipper) address, city, pickup notes
  - Recipient (consignee) address, city, delivery instructions
  - Cargo specifications (weight, dimensions, declared value, category)
  - Flexible payment modes: Cash on Delivery (COD), Credit Card, Online Payment
- Instant consignment generation with unique alphanumeric tracking numbers (e.g., `TRK-XXXXXX`).

### 4. 🚚 Driver Task Board & Delivery App
- View assigned deliveries separated into **Active Tasks** and **Completed Archive**.
- Status updater: Move parcels from *Picked Up* &rarr; *In Transit* &rarr; *Out for Delivery* &rarr; *Delivered*.
- Capture digital recipient signature name and proof-of-delivery notes.
- Driver online/offline availability switch.
- Driver ratings and completed delivery milestones.

### 5. 🛡️ Dispatcher & Admin Operations Center
- High-level logistics analytics: Total Consignments, In Transit Pipeline, Delivered % Rate, Gross Revenue, and Active Fleet Drivers.
- Consignment Dispatch Ledger: Filter by status, search by sender/recipient/tracking code.
- **Driver Allocation**: 1-click driver assignment modal for unassigned consignments.
- **Manual Status & Hub Override**: Dispatcher override tool for linehaul updates.
- Fleet management & user directory.

### 6. ⚡ 1-Click Demo Logins
- Switch between **Admin**, **Driver**, and **Customer** roles with 1 click from the navigation bar or login page!

---

## 🔑 Demo Accounts & Sample Tracking Codes

### Pre-Seeded Credentials:
| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **🛡️ Admin Dispatcher** | `admin@fastparcel.com` | `admin123` | Full Operations Command, Driver Assignment, Revenue Analytics |
| **🚚 Courier Driver** | `driver1@fastparcel.com` | `driver123` | Task Sheet, Status Updater, Proof of Delivery |
| **📦 Customer / Shipper** | `customer@gmail.com` | `customer123` | Booking, Shipment History, Invoices & Labels |

*Tip: You can also register new customer or driver accounts at `/register`.*

### Sample Pre-Seeded Tracking Numbers:
- `TRK-784920` — **Delivered** (Ceramic tea set, Boston destination, signed by recipient)
- `TRK-552190` — **Out for Delivery** (Electronics, Same-Day delivery)
- `TRK-392014` — **In Transit** (Clothing, cross-country corridor)
- `TRK-902381` — **Order Placed** (Awaiting driver assignment)

---

## 🚀 How to Run the Application

### Option A: 1-Click Launch (Recommended for Windows)
Simply double-click the included batch launcher:
```text
start-all.bat
```
This automatically starts the backend API (port 5000), frontend dev server (port 5173), and opens `http://localhost:5173` in your default browser!

---

### Option B: Manual Terminal Execution

#### 1. Backend Server
```powershell
cd "X:\Simple Website\Parcel Delivery website\backend"
npm run dev
```
*Backend runs on: `http://localhost:5000`*

#### 2. Frontend Application
```powershell
cd "X:\Simple Website\Parcel Delivery website\frontend"
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

#### 3. Re-seed Database (Anytime)
To reset and re-populate the MongoDB database with demo accounts, sample parcels, and distribution hubs:
```powershell
cd "X:\Simple Website\Parcel Delivery website\backend"
node src/seeders/seed.js
```
*(Or double-click `seed-db.bat`)*

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 19 + Vite 8
  - Tailwind CSS v4
  - Lucide React Icons
  - React Router DOM v7
  - Axios HTTP Client
- **Backend**:
  - Node.js + Express.js (ES Modules)
  - MongoDB 8.2 + Mongoose ODM
  - JSON Web Tokens (JWT) & bcryptjs
  - Morgan Logging & CORS
