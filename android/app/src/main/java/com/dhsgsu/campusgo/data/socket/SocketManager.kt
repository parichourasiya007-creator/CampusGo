package com.dhsgsu.campusgo.data.socket

import android.util.Log
import com.dhsgsu.campusgo.data.model.LiveBusState
import com.google.gson.Gson
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import org.json.JSONObject

class SocketManager {

    private var socket: Socket? = null
    private val gson = Gson()

    private val _busLocationFlow = MutableSharedFlow<LiveBusState>(replay = 1)
    val busLocationFlow: SharedFlow<LiveBusState> = _busLocationFlow.asSharedFlow()

    private val _tripEndedFlow = MutableSharedFlow<String>(replay = 1)
    val tripEndedFlow: SharedFlow<String> = _tripEndedFlow.asSharedFlow()

    fun connect(serverUrl: String = "http://10.0.2.2:5000") {
        try {
            if (socket != null && socket!!.connected()) return

            val options = IO.Options().apply {
                transports = arrayOf("websocket", "polling")
                reconnection = true
                reconnectionAttempts = 10
            }

            socket = IO.socket(serverUrl, options)

            socket?.on(Socket.EVENT_CONNECT) {
                Log.d("SocketManager", "Connected to CampusGo Socket.IO server")
                socket?.emit("student:subscribe")
            }

            socket?.on("student:bus-location-changed") { args ->
                if (args.isNotEmpty() && args[0] != null) {
                    try {
                        val json = args[0].toString()
                        val state = gson.fromJson(json, LiveBusState::class.java)
                        _busLocationFlow.tryEmit(state)
                    } catch (e: Exception) {
                        Log.e("SocketManager", "Error parsing bus location: ${e.message}")
                    }
                }
            }

            socket?.on("student:trip-ended") { args ->
                if (args.isNotEmpty() && args[0] != null) {
                    try {
                        val json = JSONObject(args[0].toString())
                        val busId = json.optString("busId")
                        if (busId.isNotEmpty()) {
                            _tripEndedFlow.tryEmit(busId)
                        }
                    } catch (e: Exception) {
                        Log.e("SocketManager", "Error parsing trip ended: ${e.message}")
                    }
                }
            }

            socket?.connect()
        } catch (e: Exception) {
            Log.e("SocketManager", "Socket connection error: ${e.message}")
        }
    }

    fun emitLocationUpdate(
        busId: String,
        lat: Double,
        lng: Double,
        accuracy: Int,
        speed: Double,
        timestamp: Long
    ) {
        val payload = JSONObject().apply {
            put("busId", busId)
            put("lat", lat)
            put("lng", lng)
            put("accuracy", accuracy)
            put("speed", speed)
            put("timestamp", timestamp)
        }
        socket?.emit("conductor:update-location", payload)
    }

    fun emitStartTrip(busId: String, routeId: String, operatorId: String) {
        val payload = JSONObject().apply {
            put("busId", busId)
            put("routeId", routeId)
            put("conductorId", operatorId)
        }
        socket?.emit("conductor:start-trip", payload)
    }

    fun emitEndTrip(busId: String) {
        val payload = JSONObject().apply {
            put("busId", busId)
        }
        socket?.emit("conductor:end-trip", payload)
    }

    fun disconnect() {
        socket?.disconnect()
        socket?.off()
        socket = null
    }

    companion object {
        @Volatile
        private var INSTANCE: SocketManager? = null

        fun getInstance(): SocketManager {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: SocketManager().also { INSTANCE = it }
            }
        }
    }
}
