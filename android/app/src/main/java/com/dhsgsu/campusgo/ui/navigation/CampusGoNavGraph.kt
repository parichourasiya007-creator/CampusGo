package com.dhsgsu.campusgo.ui.navigation

sealed class Screen(val route: String) {
    object StudentHome : Screen("student_home")
    object FindMyBus : Screen("find_my_bus")
    object StudentRoutes : Screen("student_routes")
    object StudentStops : Screen("student_stops")
    object OperatorLogin : Screen("operator_login")
    object OperatorHome : Screen("operator_home")
    object ActiveTrip : Screen("active_trip")
}
