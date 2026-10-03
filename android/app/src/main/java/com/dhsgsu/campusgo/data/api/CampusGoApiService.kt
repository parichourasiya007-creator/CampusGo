package com.dhsgsu.campusgo.data.api

import com.dhsgsu.campusgo.data.model.*
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

data class FindBusBody(
    val fromLat: Double?,
    val fromLng: Double?,
    val toStopId: String
)

data class StartTripBody(
    val busId: String,
    val routeId: String,
    val operatorId: String
)

data class EndTripBody(
    val busId: String
)

interface CampusGoApiService {

    @POST("api/auth/login")
    suspend fun login(@Body body: LoginRequest): Response<LoginResponse>

    @GET("api/transport/buses")
    suspend fun getBuses(): Response<List<BusInfo>>

    @GET("api/transport/routes")
    suspend fun getRoutes(): Response<List<CampusRoute>>

    @GET("api/transport/stops")
    suspend fun getStops(): Response<List<CampusStop>>

    @POST("api/eta/find-bus")
    suspend fun findMyBus(@Body body: FindBusBody): Response<FindMyBusResult>

    @POST("api/transport/trip/start")
    suspend fun startTrip(@Body body: StartTripBody): Response<TripSession>

    @POST("api/transport/trip/end")
    suspend fun endTrip(@Body body: EndTripBody): Response<Map<String, Any>>
}
