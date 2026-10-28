# WorkProof 👷‍♂️📱

> **Mobile-first, offline-ready Progressive Web App (PWA) for daily wage workers and contractors.**  
> Punch in and out with verified GPS location, real-time timestamps, and optional site photos, then share an indisputable proof card directly on WhatsApp.

---

## 💡 The Problem & The Solution

Daily wage workers (construction labourers, loaders, cleaners, helpers) and contractors often face disputes over hours worked, attendance, and physical presence on site. 

**WorkProof** solves this with a 100% front-end, phone-based prototype:
- **Zero backend or database needed**: All records stay stored on the user's phone in browser `localStorage`.
- **Low-literacy ergonomics**: Giant 90px+ touch buttons, clear ticks (✓) and crosses (✗), and high-contrast colors (Green for start/confirm, Red for stop/cancel).
- **Multilingual**: Full support in **English**, **हिंदी (Hindi)**, and **मराठी (Marathi)**.

---

## ⚡ Core Features

### 👷 For Workers
1. **Join Jobs with 5-Digit Code**: Enter contractor job codes (demo codes: `12345` and `67890`). Includes a 5-minute security lockout after 5 wrong attempts.
2. **GPS Geofence Check (150m Radius)**: Automatically checks phone GPS against the contractor's site coordinates using the Haversine formula. Flags if the worker is outside the 150m radius.
3. **Site Photo Capture**: Native camera capture (`capture="environment"`) with client-side canvas compression ($<80\text{ KB}$) so device storage is never overloaded.
4. **Persistent Live Stopwatch**: Accurate real-time timer (`HH:MM:SS`) that survives page reloads, app closure, and phone restarts. Features a 12+ hour reminder alert.
5. **One-Tap WhatsApp Share**: Renders a clean digital proof card with total hours, location map link, and photo, and shares it directly via WhatsApp (as an image or formatted text with Google Maps link).
6. **Past Proofs (History)**: Tap **My Proofs** to inspect or re-share any previous shift.

### 🏗️ For Contractors
1. **Create Jobs with GPS Tagging**: Name the job and tap *"Set site here (GPS)"* to lock the site's center coordinates and 150m radius.
2. **Instant 5-Digit Join Code**: Automatically generates a unique 5-digit code with a 1-tap button to invite workers via WhatsApp.
3. **Live Workforce Roster**: View assigned workers, live status badges (`Working ✓` vs `Not working`), and today's accumulated hours. Remove workers anytime with confirmation.

---

## 🧪 Demo Test Credentials

You can test both Worker and Contractor workflows immediately on the same device:

- **Prototype Login OTP:** `123456` (accepts any 10-digit phone number)
- **Demo Job 1 Code:** `12345` (*Metro Line 3 Pillar Work* - Contractor: Rajesh Sharma)
- **Demo Job 2 Code:** `67890` (*Bandra Heights Civil Site* - Contractor: Amit Patil)
- **Demo Workers:** Preloaded with Ramesh Kumar, Sunita Bai, and Santosh Shinde.
- **Switch Role:** Tap the **Rotate Icon (↻)** in the top header anytime to switch between Worker and Contractor roles or reset demo data.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8 + `vite-plugin-pwa`
- **Styling**: Tailwind CSS v4 + Plus Jakarta Sans & JetBrains Mono
- **Icons**: Lucide React
- **Exporting**: `html-to-image` + Web Share API
- **Storage**: Browser `localStorage` (Zero server costs, offline-first)

---

## 🚀 Running Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/hayato907/WORKPROOF.git
   cd WORKPROOF
