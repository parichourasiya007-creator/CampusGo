package com.dhsgsu.campusgo.ui.operator

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DirectionsBus
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.dhsgsu.campusgo.data.model.UserRole
import com.dhsgsu.campusgo.ui.theme.*
import com.dhsgsu.campusgo.ui.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OperatorHomeScreen(
    viewModel: MainViewModel,
    onStartTripSuccess: () -> Unit,
    onSwitchToStudent: () -> Unit
) {
    val context = LocalContext.current
    val currentUser by viewModel.currentUser.collectAsState()
    val isTripActive by viewModel.isTripActive.collectAsState()

    var permissionError by remember { mutableStateOf<String?>(null) }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val fineGranted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] ?: false
        val coarseGranted = permissions[Manifest.permission.ACCESS_COARSE_LOCATION] ?: false
        if (fineGranted || coarseGranted) {
            permissionError = null
            viewModel.startOperatorTrip(context)
            onStartTripSuccess()
        } else {
            permissionError = "Location permission is required to track this bus."
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = "Operator Cockpit", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CharcoalDark, titleContentColor = SurfaceWhite),
                actions = {
                    TextButton(onClick = {
                        viewModel.setUserRole(UserRole.STUDENT)
                        onSwitchToStudent()
                    }) {
                        Text(text = "Student View →", color = TransportGreen)
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(OffWhiteBg)
                .padding(20.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                // Operator Info Header Card
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = SurfaceWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderLight)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = TransportGreenBg,
                            modifier = Modifier.size(48.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(Icons.Default.Shield, contentDescription = null, tint = TransportGreenDark)
                            }
                        }
                        Spacer(modifier = Modifier.width(14.dp))
                        Column {
                            Text(text = currentUser?.name ?: "Authorized Conductor", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Text(text = "ID: ${currentUser?.universityId ?: "EMP-DHSGSU-501"}", fontSize = 12.sp, color = TextSecondary)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Assigned Vehicle & Route Details
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = SurfaceWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderLight)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.DirectionsBus, contentDescription = null, tint = TransportGreenDark)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = "ASSIGNED VEHICLE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = TextMuted)
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = "🚌 BUS 01 (MP 15 UA 0101)", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TransportGreenDark)

                        Spacer(modifier = Modifier.height(14.dp))
                        Divider(color = BorderLight)
                        Spacer(modifier = Modifier.height(14.dp))

                        Text(text = "OPERATING ROUTE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = TextMuted)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "CAMPUS ROUTE 1: Main Gate → Central Library → Science Block → Hostels",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                if (permissionError != null) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(text = permissionError!!, color = LiveRed, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
            }

            // Primary START TRIP Action Box
            Column {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = SurfaceWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderLight)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Starting the trip will share this phone's live location as the current location of the assigned bus.",
                            fontSize = 12.sp,
                            color = TextSecondary,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Button(
                            onClick = {
                                val fineCheck = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
                                val coarseCheck = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION)

                                if (fineCheck == PackageManager.PERMISSION_GRANTED || coarseCheck == PackageManager.PERMISSION_GRANTED) {
                                    viewModel.startOperatorTrip(context)
                                    onStartTripSuccess()
                                } else {
                                    permissionLauncher.launch(
                                        arrayOf(
                                            Manifest.permission.ACCESS_FINE_LOCATION,
                                            Manifest.permission.ACCESS_COARSE_LOCATION
                                        )
                                    )
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(56.dp),
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = TransportGreenDark, contentColor = SurfaceWhite)
                        ) {
                            Icon(Icons.Default.PlayArrow, contentDescription = null, modifier = Modifier.size(24.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = "START TRIP", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                    }
                }
            }
        }
    }
}
