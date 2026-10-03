package com.dhsgsu.campusgo.data.model

import com.google.gson.annotations.SerializedName

enum class UserRole {
    STUDENT,
    OPERATOR
}

data class User(
    val id: String,
    val universityId: String,
    val name: String,
    val role: UserRole,
    val assignedBusId: String? = null
)

data class CampusStop(
    val id: String,
    val name: String,
    val code: String,
    val lat: Double,
    val lng: Double,
    val description: String? = null
)

data class CampusRoute(
    val id: String,
    val code: String,
    val name: String,
    val stops: List<CampusStop>,
    val waypoints: List<List<Double>> = emptyList()
)

data class BusInfo(
    val id: String,
    val busNumber: String,
    val registrationNumber: String,
    val capacity: Int,
    val assignedRouteId: String
)

data class LiveBusState(
    @SerializedName("busId") val busId: String,
    @SerializedName("routeId") val routeId: String? = null,
    @SerializedName("lat") val lat: Double,
    @SerializedName("lng") val lng: Double,
    @SerializedName("accuracy") val accuracy: Int = 0,
    @SerializedName("speed") val speed: Double = 0.0,
    @SerializedName("timestamp") val timestamp: Long = System.currentTimeMillis(),
    val nextStopName: String? = "Central Library",
    val etaMinutes: Int = 4,
    val status: String = "LIVE"
)

data class FindMyBusResult(
    val active: Boolean,
    val busId: String? = null,
    val routeId: String? = null,
    val pickupStop: CampusStop? = null,
    val destinationStop: CampusStop? = null,
    val pickupEtaMinutes: Int = 0,
    val destinationArrivalMinutes: Int = 0,
    val distanceKm: String? = null,
    val message: String? = null
)

data class TripSession(
    val tripId: String,
    val busId: String,
    val operatorId: String,
    val routeId: String,
    val startTime: String,
    val status: String = "ACTIVE"
)

data class LoginRequest(
    val universityId: String,
    val role: String
)

data class LoginResponse(
    val success: Boolean,
    val user: User
)
