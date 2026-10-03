# 🚌 CampusGo - University Campus Bus Tracking System
**Dr. Harisingh Gour Vishwavidyalaya (DHSGSU), Sagar, Madhya Pradesh**

[![Android APK Release](https://img.shields.io/badge/Download_APK-v1.0.0-10B981?style=for-the-badge&logo=android&logoColor=white)](https://github.com/parichourasiya007-creator/CampusGo/releases/latest/download/CampusGo-v1.0.0.apk)
[![GitHub Releases](https://img.shields.io/github/v/release/parichourasiya007-creator/CampusGo?style=for-the-badge&color=059669)](https://github.com/parichourasiya007-creator/CampusGo/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/parichourasiya007-creator/CampusGo/android-release.yml?branch=main&style=for-the-badge&logo=github)](https://github.com/parichourasiya007-creator/CampusGo/actions)

> *"Know your bus. Know your arrival."*

---

## 📱 Download Latest Android App (APK)

- 📥 **Direct APK Download**: **[CampusGo-v1.0.0.apk](https://github.com/parichourasiya007-creator/CampusGo/releases/latest/download/CampusGo-v1.0.0.apk)**
- 🏷️ **GitHub Releases Page**: **[View All Version Releases](https://github.com/parichourasiya007-creator/CampusGo/releases)**

> **🔄 Automated CI/CD Updating**: Every time new code changes are pushed to this repository, GitHub Actions automatically builds the latest native Android APK, publishes an updated release, and refreshes the download links above!

---

## 🌟 Overview & Real-World Operator Model

CampusGo is a real-world, production-oriented university transport application engineered for DHSGSU Sagar campus operations.

### Key Architectural Principles:
1. **Bus-Centric Tracking (Not Driver Tracking)**:
   - The operator's phone acts strictly as the vehicle telemetry beacon.
   - Operator personal identity, phone number, and non-trip coordinates are NEVER exposed to student clients.
2. **Foreground Location Service (`BusTrackingForegroundService.kt`)**:
   - Runs continuous GPS tracking inside an Android `ForegroundService` with a persistent notification (`"CampusGo is tracking BUS-01"`).
   - Starts strictly when an authorized conductor taps **START TRIP** and stops immediately when **END TRIP** is confirmed.
3. **Zero Mock Data**:
   - Only active trips transmit live vehicle markers (`🚌 BUS-01`). When no bus is on duty, students see *"No buses are currently active."*

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Native Android App** | **Kotlin + Jetpack Compose** | Material3 UI, Navigation Compose, Coroutines & StateFlow |
| **Maps & Location SDK** | **Google Maps Compose** + `FusedLocationProviderClient` | Real-time map rendering & high-accuracy GPS telemetry |
| **Android Service** | **Foreground Service** | Background/foreground continuous location transmission |
| **Backend API** | **Node.js + Express.js** | RESTful endpoints for Auth, Routes, Stops, Trips & ETA |
| **Real-time Pipeline** | **Socket.IO (WebSockets)** | Bidirectional live location event streaming |
| **Database** | **MongoDB Atlas (Mongoose)** | GeoJSON `2dsphere` spatial indexing for ETA calculations |
| **Automated CI/CD** | **GitHub Actions** | Automated APK Gradle build & GitHub Releases publishing |

---

## 🚀 Quick Start & Installation

### 1. Running Backend Server (`server/`)
```bash
cd server
npm install
node index.js
```
*Backend runs on `http://localhost:5000` with WebSocket support.*

### 2. Building Native Android App (`android/`)
Open `android/` folder in **Android Studio** (Jellyfish / Koala or newer), or build via command line:
```bash
cd android
./gradlew assembleDebug
```
The generated APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

### 3. Running Web Client Portal (`src/`)
```bash
npm install
npm run dev
```
*Web client opens at `http://localhost:5173`.*

---

## 📄 License & Repository Details
- **Repository**: [https://github.com/parichourasiya007-creator/CampusGo](https://github.com/parichourasiya007-creator/CampusGo)
- **Maintainer**: `parichourasiya007` (`parichourasiya007@gmail.com`)
- **Institution**: Dr. Harisingh Gour Vishwavidyalaya (DHSGSU), Sagar, MP
