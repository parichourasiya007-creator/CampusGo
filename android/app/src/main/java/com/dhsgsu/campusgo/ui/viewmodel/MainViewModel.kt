package com.dhsgsu.campusgo.ui.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dhsgsu.campusgo.data.model.*
import com.dhsgsu.campusgo.data.repository.CampusRepository
import com.dhsgsu.campusgo.service.BusTrackingForegroundService
import kotlinx.coroutines.flow.*

class MainViewModel(
    private val repository: CampusRepository = CampusRepository()
) : ViewModel() {

    private val _userRole = MutableStateFlow(UserRole.STUDENT)
    val userRole: StateFlow<UserRole> = _userRole.asStateFlow()

    private val _currentUser = MutableStateFlow<User?>(
        User("STD_01", "DHSGSU-2024-1001", "DHSGSU Student", UserRole.STUDENT)
    )
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()

    val activeBuses: StateFlow<Map<String, LiveBusState>> = repository.activeBuses

    private val _selectedBusId = MutableStateFlow<String?>(null)
    val selectedBusId: StateFlow<String?> = _selectedBusId.asStateFlow()

    private val _isTripActive = MutableStateFlow(false)
    val isTripActive: StateFlow<Boolean> = _isTripActive.asStateFlow()

    private val _findMyBusResult = MutableStateFlow<FindMyBusResult?>(null)
    val findMyBusResult: StateFlow<FindMyBusResult?> = _findMyBusResult.asStateFlow()

    val officialStops = repository.defaultStops
    val officialRoutes = repository.defaultRoutes
    val officialBuses = repository.defaultBuses

    fun setUserRole(role: UserRole) {
        _userRole.value = role
        if (role == UserRole.OPERATOR) {
            _currentUser.value = User(
                id = "COND_01",
                universityId = "EMP-DHSGSU-501",
                name = "Authorized Conductor",
                role = UserRole.OPERATOR,
                assignedBusId = "BUS_01"
            )
        } else {
            _currentUser.value = User(
                id = "STD_01",
                universityId = "DHSGSU-2024-1001",
                name = "DHSGSU Student",
                role = UserRole.STUDENT
            )
        }
    }

    fun selectBus(busId: String?) {
        _selectedBusId.value = busId
    }

    fun startOperatorTrip(context: Context, busId: String = "BUS_01", routeId: String = "ROUTE_DHSGSU_01") {
        val operatorId = _currentUser.value?.id ?: "COND_01"
        repository.startTrip(busId, routeId, operatorId)
        BusTrackingForegroundService.startService(context, busId, routeId)
        _isTripActive.value = true
    }

    fun endOperatorTrip(context: Context, busId: String = "BUS_01") {
        BusTrackingForegroundService.stopService(context)
        repository.endTrip(busId)
        _isTripActive.value = false
    }

    fun calculateFindMyBus(fromLat: Double?, fromLng: Double?, toStopId: String) {
        val stops = officialStops
        val destinationStop = stops.find { it.id == toStopId } ?: stops.last()

        val activeList = activeBuses.value.values.toList()
        if (activeList.isEmpty()) {
            _findMyBusResult.value = FindMyBusResult(
                active = false,
                pickupStop = stops.first(),
                destinationStop = destinationStop,
                message = "No buses are currently active on campus."
            )
            return
        }

        val activeBus = activeList.first()
        val pickupStop = stops.first()

        _findMyBusResult.value = FindMyBusResult(
            active = true,
            busId = activeBus.busId,
            routeId = activeBus.routeId ?: "ROUTE_DHSGSU_01",
            pickupStop = pickupStop,
            destinationStop = destinationStop,
            pickupEtaMinutes = 6,
            destinationArrivalMinutes = 16,
            distanceKm = "2.4"
        )
    }

    fun clearFindMyBus() {
        _findMyBusResult.value = null
    }
}
