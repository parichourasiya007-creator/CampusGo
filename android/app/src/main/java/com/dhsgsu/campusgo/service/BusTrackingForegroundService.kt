package com.dhsgsu.campusgo.service

import android.annotation.SuppressLint
import android.app.*
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import com.dhsgsu.campusgo.MainActivity
import com.dhsgsu.campusgo.R
import com.dhsgsu.campusgo.data.model.LiveBusState
import com.dhsgsu.campusgo.data.repository.CampusRepository
import com.google.android.gms.location.*

class BusTrackingForegroundService : Service() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    private val repository = CampusRepository()

    private var activeBusId: String = "BUS_01"
    private var activeRouteId: String = "ROUTE_DHSGSU_01"

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        createNotificationChannel()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                for (location in locationResult.locations) {
                    val speedKmH = if (location.hasSpeed()) (location.speed * 3.6) else 0.0
                    val accuracyMeters = if (location.hasAccuracy()) location.accuracy.toInt() else 0

                    val liveState = LiveBusState(
                        busId = activeBusId,
                        routeId = activeRouteId,
                        lat = location.latitude,
                        lng = location.longitude,
                        accuracy = accuracyMeters,
                        speed = speedKmH,
                        timestamp = location.time
                    )

                    Log.d("BusTrackingService", "Real GPS update for $activeBusId: ${location.latitude}, ${location.longitude} ($speedKmH km/h)")
                    repository.updateBusLocation(liveState)
                }
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        if (action == ACTION_STOP) {
            stopTrackingService()
            return START_NOT_STICKY
        }

        activeBusId = intent?.getStringExtra(EXTRA_BUS_ID) ?: "BUS_01"
        activeRouteId = intent?.getStringExtra(EXTRA_ROUTE_ID) ?: "ROUTE_DHSGSU_01"

        startForegroundNotification()
        startLocationUpdates()

        return START_STICKY
    }

    @SuppressLint("MissingPermission")
    private fun startLocationUpdates() {
        val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 4000L)
            .setMinUpdateIntervalMillis(2000L)
            .setMinUpdateDistanceMeters(3.0f)
            .build()

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
        } catch (e: Exception) {
            Log.e("BusTrackingService", "Failed to start location updates: ${e.message}")
        }
    }

    private fun startForegroundNotification() {
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("CampusGo Bus Tracking")
            .setContentText("CampusGo is tracking $activeBusId")
            .setSmallIcon(android.R.drawable.ic_menu_compass)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }
    }

    private fun stopTrackingService() {
        fusedLocationClient.removeLocationUpdates(locationCallback)
        repository.endTrip(activeBusId)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(STOP_FOREGROUND_REMOVE)
        } else {
            @Suppress("DEPRECATION")
            stopForeground(true)
        }
        stopSelf()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "CampusGo Bus Tracking Channel",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows persistent status while bus tracking is active"
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        fusedLocationClient.removeLocationUpdates(locationCallback)
        super.onDestroy()
    }

    companion object {
        const val CHANNEL_ID = "campusgo_bus_tracking_channel"
        const val NOTIFICATION_ID = 1001
        const val ACTION_START = "com.dhsgsu.campusgo.ACTION_START"
        const val ACTION_STOP = "com.dhsgsu.campusgo.ACTION_STOP"
        const val EXTRA_BUS_ID = "EXTRA_BUS_ID"
        const val EXTRA_ROUTE_ID = "EXTRA_ROUTE_ID"

        fun startService(context: Context, busId: String, routeId: String) {
            val intent = Intent(context, BusTrackingForegroundService::class.java).apply {
                action = ACTION_START
                putExtra(EXTRA_BUS_ID, busId)
                putExtra(EXTRA_ROUTE_ID, routeId)
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stopService(context: Context) {
            val intent = Intent(context, BusTrackingForegroundService::class.java).apply {
                action = ACTION_STOP
            }
            context.startService(intent)
        }
    }
}
