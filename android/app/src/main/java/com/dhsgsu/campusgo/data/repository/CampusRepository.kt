package com.dhsgsu.campusgo.data.repository

import com.dhsgsu.campusgo.data.model.*
import com.dhsgsu.campusgo.data.socket.SocketManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class CampusRepository(private val socketManager: SocketManager = SocketManager.getInstance()) {

    private val scope = CoroutineScope(Dispatchers.IO)

    // Configured Official Campus Stops at DHSGSU Sagar
    val defaultStops = listOf(
        CampusStop("GATE_1", "Gate No. 1 (Main Entrance)", "G1", 23.8315, 78.7780, "Main campus entrance from Sagar city road"),
        CampusStop("GOUR_BHAWAN", "Gour Bhawan / VC Office", "GB", 23.8328, 78.7802, "University administration headquarters"),
        CampusStop("CENTRAL_LIBRARY", "Jawaharlal Nehru Central Library", "CL", 23.8340, 78.7820, "Central library & digital research wing"),
        CampusStop("SCIENCE_BLOCK", "School of Applied Sciences", "SB", 23.8355, 78.7845, "Physics, Chemistry & Applied Geology complex"),
        CampusStop("ARTS_COMMERCE_BLOCK", "Arts & Commerce Complex", "AC", 23.8362, 78.7830, "Social Sciences & Humanities building"),
        CampusStop("STUDENT_HOSTELS", "Tagore & Rani Laxmibai Hostels", "SH", 23.8385, 78.7870, "Residential student hostel area"),
        CampusStop("HEALTH_CANTEEN", "Health Centre & Canteen", "HC", 23.8332, 78.7838, "University health centre & central canteen")
    )

    // Configured Official Campus Routes
    val defaultRoutes = listOf(
        CampusRoute(
            id = "ROUTE_DHSGSU_01",
            code = "CAMPUS ROUTE 1",
            name = "Main Gate → Central Library → Science Block → Student Hostels",
            stops = defaultStops.take(6)
        ),
        CampusRoute(
            id = "ROUTE_DHSGSU_02",
            code = "CAMPUS ROUTE 2",
            name = "Main Gate → Health Centre → Arts Block → Science Block",
            stops = listOf(defaultStops[0], defaultStops[6], defaultStops[4], defaultStops[3])
        )
    )

    val defaultBuses = listOf(
        BusInfo("BUS_01", "BUS 01", "MP 15 UA 0101", 52, "ROUTE_DHSGSU_01"),
        BusInfo("BUS_02", "BUS 02", "MP 15 UA 0102", 48, "ROUTE_DHSGSU_02")
    )

    private val _activeBuses = MutableStateFlow<Map<String, LiveBusState>>(emptyMap())
    val activeBuses: StateFlow<Map<String, LiveBusState>> = _activeBuses.asStateFlow()

    init {
        socketManager.connect()

        scope.launch {
            socketManager.busLocationFlow.collect { newState ->
                val current = _activeBuses.value.toMutableMap()
                current[newState.busId] = newState
                _activeBuses.value = current
            }
        }

        scope.launch {
            socketManager.tripEndedFlow.collect { endedBusId ->
                val current = _activeBuses.value.toMutableMap()
                current.remove(endedBusId)
                _activeBuses.value = current
            }
        }
    }

    fun updateBusLocation(newState: LiveBusState) {
        val current = _activeBuses.value.toMutableMap()
        current[newState.busId] = newState
        _activeBuses.value = current
        socketManager.emitLocationUpdate(
            busId = newState.busId,
            lat = newState.lat,
            lng = newState.lng,
            accuracy = newState.accuracy,
            speed = newState.speed,
            timestamp = newState.timestamp
        )
    }

    fun startTrip(busId: String, routeId: String, operatorId: String) {
        socketManager.emitStartTrip(busId, routeId, operatorId)
    }

    fun endTrip(busId: String) {
        val current = _activeBuses.value.toMutableMap()
        current.remove(busId)
        _activeBuses.value = current
        socketManager.emitEndTrip(busId)
    }
}
