# 🚌 CampusGo - University Campus Bus Tracking System
**Dr. Harisingh Gour Vishwavidyalaya (DHSGSU), Sagar, Madhya Pradesh, India**

[![Android APK Release](https://img.shields.io/badge/Download_APK-v1.0.0-10B981?style=for-the-badge&logo=android&logoColor=white)](https://github.com/parichourasiya007-creator/CampusGo/releases/latest/download/CampusGo-v1.0.0.apk)
[![GitHub Releases](https://img.shields.io/github/v/release/parichourasiya007-creator/CampusGo?style=for-the-badge&color=059669)](https://github.com/parichourasiya007-creator/CampusGo/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/parichourasiya007-creator/CampusGo/android-release.yml?branch=main&style=for-the-badge&logo=github)](https://github.com/parichourasiya007-creator/CampusGo/actions)

> *"Know your bus. Know your arrival."*

---

## 📥 Download APK

- 📦 **Latest Stable APK**: **[CampusGo-v1.0.0.apk](https://github.com/parichourasiya007-creator/CampusGo/releases/latest/download/CampusGo-v1.0.0.apk)**
- 🏷️ **GitHub Releases Page**: **[View All Release Versions](https://github.com/parichourasiya007-creator/CampusGo/releases)**

> **🔄 Automated CI/CD Publishing**: Every time new updates are pushed to the `main` branch, GitHub Actions (`.github/workflows/android-release.yml`) automatically compiles the Native Kotlin Android APK via Gradle, publishes an updated version tag (`v1.0.0`), and refreshes the direct download links.

---

## 🌟 Overview & Core Purpose

CampusGo is a real-world, production-ready university transport tracking application built for **Dr. Harisingh Gour Vishwavidyalaya (DHSGSU), Sagar, MP**. 

Students can track active university shuttle buses live on Google Maps, view route schedules, check stop arrivals, and calculate pickup ETAs. Authorized bus conductors/operators use the exact same application to start and end location broadcasting during their shifts.

---

## 🔒 Key Architectural Principles & Privacy

### 1. Bus-Centric Tracking (Not Person Tracking)
- The operator's Android phone acts strictly as the vehicle telemetry beacon for their assigned bus (`BUS-01`).
- Location updates are bound to `busId` and `tripId`. Operator personal identity, phone number, private profile, and non-trip coordinates are **NEVER** broadcast to student clients.

### 2. Shift Model & Operator Handoff
- Multiple authorized conductors can log into the system independently.
- Operator A starts duty on `BUS-01` -> GPS starts -> `BUS-01` becomes LIVE.
- Operator A finishes duty -> Taps **END TRIP** -> GPS tracking stops -> `BUS-01` becomes inactive.
- Later, Operator B logs into the same app, selects `BUS-01`, and starts a new trip. Students track the **BUS**, regardless of who is operating it.

### 3. Android Foreground Location Service (`BusTrackingForegroundService.kt`)
- Runs continuous location tracking inside a native Android `ForegroundService` with a transparent persistent notification (`"CampusGo is tracking BUS-01"`).
- Tracking begins strictly when the conductor confirms **START TRIP** and terminates immediately upon **END TRIP**.

### 4. Zero Fake Data Policy
- Only active trips with live GPS telemetry display on the map. When no bus is on duty, students see *"No buses are currently active on campus."*

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Native Android App** | **Kotlin + Jetpack Compose** | Native Android project with Material 3 UI, ViewModels, and Coroutines |
| **Maps SDK** | **Google Maps SDK for Android** (`maps-compose:4.3.3`) | Real-time map rendering & custom vehicle markers |
| **Location Services** | `FusedLocationProviderClient` + **Foreground Service** | Android high-accuracy GPS telemetry with background persistence |
| **Backend Framework** | **Node.js + Express.js** | RESTful APIs for Auth, Buses, Routes, Trips & ETA computations |
| **Real-time Pipeline** | **Socket.IO (WebSockets)** | Bidirectional live location event streaming |
| **Database** | **MongoDB Atlas (Mongoose)** | GeoJSON `2dsphere` spatial indexing for ETA queries |
| **CI/CD Build Pipeline** | **GitHub Actions** | Automated Gradle APK compilation & GitHub Release attachment |

---

## 📱 Native Android Project Architecture (`android/`)

```text
android/
  app/
    build.gradle.kts (SDK 34, Kotlin Compose, Maps Compose, Socket.io)
    src/
      main/
        AndroidManifest.xml (Permissions & Foreground Service declaration)
        java/com/dhsgsu/campusgo/
          MainActivity.kt (NavHost & theme entry point)
          data/
            api/CampusGoApiService.kt (Retrofit endpoints)
            model/Models.kt (Bus, Route, Stop, Trip, LiveBusState)
            repository/CampusRepository.kt (Repository state flows)
            socket/SocketManager.kt (Socket.IO client manager)
          service/
            BusTrackingForegroundService.kt (Foreground location service)
          ui/
            navigation/CampusGoNavGraph.kt (Navigation destinations)
            operator/
              ActiveTripScreen.kt (Conductor active trip cockpit)
              OperatorHomeScreen.kt (Vehicle verification & START TRIP)
              OperatorLoginScreen.kt (Conductor authentication)
            student/
              FindMyBusScreen.kt ("Where do you want to go?" ETA calculator)
              StudentHomeScreen.kt (Google Map & bus bottom sheet)
              StudentRoutesScreen.kt (Official DHSGSU shuttle corridors)
              StudentStopsScreen.kt (Campus stop schedule)
            theme/ (Color.kt, Type.kt, Theme.kt)
            viewmodel/MainViewModel.kt (Shared UI state manager)
```

---

## 🎯 Key Features

### For Students:
1. **Interactive Google Map (`StudentHomeScreen.kt`)**: Displays live bus markers (`🚌 BUS-01 ● LIVE`), campus stops, and expandable modal bottom sheet with live ETA and next stop name (`📍 School of Applied Sciences`).
2. **Find My Bus (`FindMyBusScreen.kt`)**: "Where do you want to go?" destination planner calculating pickup stop, route, bus ETA to pickup, expected destination arrival time, and total travel distance.
3. **Campus Routes & Stops (`StudentRoutesScreen.kt`, `StudentStopsScreen.kt`)**: Official DHSGSU campus corridors (`CAMPUS ROUTE 1`, `CAMPUS ROUTE 2`) and stop schedules.

### For Operators:
1. **Simple 1-Handed Cockpit**: Quick vehicle selection (`BUS 01 - MP 15 UA 0101`) and primary **START TRIP** CTA.
2. **Transparent GPS Tracking**: Persistent status bar notification and 1-tap **END TRIP** confirmation action.

---

## 💻 Development & Build Setup

### 1. Opening Native Project in Android Studio
1. Launch **Android Studio** (Koala / Ladybug or newer).
2. Open the `android/` directory as an existing Android project.
3. Sync Gradle and run on an Android device or emulator (Android 7.0+ / API 24+).

### 2. Command Line APK Build
```bash
cd android
./gradlew assembleDebug
```
The compiled APK will be generated at `android/app/build/outputs/apk/debug/app-debug.apk`.

### 3. Running Backend Server (`server/`)
```bash
cd server
npm install
node index.js
```
*Runs on `http://localhost:5000` with WebSocket real-time tracking capabilities.*

---

## 🤖 AI-Assisted Development Disclosure

In accordance with transparent development practices, AI assistance was utilized during the creation of CampusGo for:
- Initial architectural ideation & UI mockup structuring.
- Kotlin Jetpack Compose boilerplate layout generation.
- Express / Socket.IO event handler template drafting.
- Documentation & CHANGELOG layout formatting.

The final codebase has been reviewed, integrated, tested, configured, and deployed by the human engineering team to ensure high quality, production readiness, and adherence to Android platform standards.

---

## 📄 License & Maintainer
- **Repository**: [https://github.com/parichourasiya007-creator/CampusGo](https://github.com/parichourasiya007-creator/CampusGo)
- **Maintainer**: `parichourasiya007` (`parichourasiya007@gmail.com`)
- **Institution**: Dr. Harisingh Gour Vishwavidyalaya (DHSGSU), Sagar, MP, India
