package com.dhsgsu.campusgo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.dhsgsu.campusgo.data.model.UserRole
import com.dhsgsu.campusgo.ui.navigation.Screen
import com.dhsgsu.campusgo.ui.operator.ActiveTripScreen
import com.dhsgsu.campusgo.ui.operator.OperatorHomeScreen
import com.dhsgsu.campusgo.ui.operator.OperatorLoginScreen
import com.dhsgsu.campusgo.ui.student.FindMyBusScreen
import com.dhsgsu.campusgo.ui.student.StudentHomeScreen
import com.dhsgsu.campusgo.ui.student.StudentRoutesScreen
import com.dhsgsu.campusgo.ui.student.StudentStopsScreen
import com.dhsgsu.campusgo.ui.theme.CampusGoTheme
import com.dhsgsu.campusgo.ui.viewmodel.MainViewModel

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate()
        setContent {
            CampusGoTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val viewModel: MainViewModel = viewModel()
                    val navController = rememberNavController()
                    val userRole by viewModel.userRole.collectAsState()

                    NavHost(
                        navController = navController,
                        startDestination = Screen.StudentHome.route
                    ) {
                        composable(Screen.StudentHome.route) {
                            StudentHomeScreen(
                                viewModel = viewModel,
                                onNavigateToFindMyBus = { navController.navigate(Screen.FindMyBus.route) },
                                onNavigateToRoutes = { navController.navigate(Screen.StudentRoutes.route) },
                                onNavigateToStops = { navController.navigate(Screen.StudentStops.route) },
                                onNavigateToOperator = { navController.navigate(Screen.OperatorLogin.route) }
                            )
                        }

                        composable(Screen.FindMyBus.route) {
                            FindMyBusScreen(
                                viewModel = viewModel,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }

                        composable(Screen.StudentRoutes.route) {
                            StudentRoutesScreen(
                                viewModel = viewModel,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }

                        composable(Screen.StudentStops.route) {
                            StudentStopsScreen(
                                viewModel = viewModel,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }

                        composable(Screen.OperatorLogin.route) {
                            OperatorLoginScreen(
                                viewModel = viewModel,
                                onLoginSuccess = { navController.navigate(Screen.OperatorHome.route) },
                                onSwitchToStudent = { navController.navigate(Screen.StudentHome.route) }
                            )
                        }

                        composable(Screen.OperatorHome.route) {
                            OperatorHomeScreen(
                                viewModel = viewModel,
                                onStartTripSuccess = { navController.navigate(Screen.ActiveTrip.route) },
                                onSwitchToStudent = { navController.navigate(Screen.StudentHome.route) }
                            )
                        }

                        composable(Screen.ActiveTrip.route) {
                            ActiveTripScreen(
                                viewModel = viewModel,
                                onEndTripCompleted = { navController.navigate(Screen.OperatorHome.route) }
                            )
                        }
                    }
                }
            }
        }
    }
}
