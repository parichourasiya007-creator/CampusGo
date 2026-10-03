# Changelog

All notable changes to the **CampusGo** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-03

### Added
- **Native Android Architecture (Kotlin + Jetpack Compose)**:
  - Initial native Android application codebase using Material 3 UI design system.
  - Interactive Google Maps Compose integration (`com.google.maps.android:maps-compose`).
  - Native Play Services Location integration (`FusedLocationProviderClient`) for high-accuracy vehicle tracking.
- **Android Foreground Location Service (`BusTrackingForegroundService.kt`)**:
  - Continuous location updates bound to an Android `ForegroundService` with persistent status notification (`"CampusGo is tracking BUS-01"`).
  - Controlled strictly via START TRIP / END TRIP operator triggers.
- **Student Mobility Features**:
  - `StudentHomeScreen`: Full interactive Google Map with active bus markers (`🚌 BUS-01 ● LIVE`), campus stop markers, and expandable bottom sheet.
  - `FindMyBusScreen`: "Where do you want to go?" destination planner calculating pickup stop, route, bus ETA to pickup, expected destination arrival time, and distance.
  - `StudentRoutesScreen` & `StudentStopsScreen`: Official DHSGSU Sagar campus corridors and stop schedules.
- **Conductor / Operator Cockpit**:
  - `OperatorLoginScreen`: Secure employee authentication.
  - `OperatorHomeScreen`: Assigned vehicle (`BUS 01 - MP 15 UA 0101`) verification, location permissions request, and primary **START TRIP** action.
  - `ActiveTripScreen`: 1-handed live operator cockpit with telemetry display, privacy guarantee note, and confirmation **END TRIP** action.
- **Node.js + Socket.IO + MongoDB Backend**:
  - Express.js REST APIs for auth, buses, routes, stops, and ETA computations.
  - MongoDB Atlas Mongoose schemas (`User`, `Bus`, `Route`, `Trip`, `LiveLocation`) featuring GeoJSON `2dsphere` spatial indexes.
  - Real-time Socket.IO handler (`trackingHandler.js`) streaming `student:bus-location-changed` events.
- **Automated CI/CD Release Pipeline**:
  - `.github/workflows/android-release.yml`: GitHub Actions workflow compiling `CampusGo-v1.0.0.apk` via Gradle and creating GitHub Releases automatically on code push.
