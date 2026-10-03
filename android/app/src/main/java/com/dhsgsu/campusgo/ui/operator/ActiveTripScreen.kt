package com.dhsgsu.campusgo.ui.operator

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.GpsFixed
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dhsgsu.campusgo.ui.theme.*
import com.dhsgsu.campusgo.ui.viewmodel.MainViewModel
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ActiveTripScreen(
    viewModel: MainViewModel,
    onEndTripCompleted: () -> Unit
) {
    val context = LocalContext.current
    val activeBusesMap by viewModel.activeBuses.collectAsState()
    val myBusState = activeBusesMap["BUS_01"]

    var showEndTripDialog by remember { mutableStateOf(false) }

    val busPosition = LatLng(myBusState?.lat ?: 23.8327, myBusState?.lng ?: 78.7816)
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(busPosition, 16f)
    }

    LaunchedEffect(myBusState) {
        if (myBusState != null) {
            cameraPositionState.position = CameraPosition.fromLatLngZoom(LatLng(myBusState.lat, myBusState.lng), 16f)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .clip(CircleShape)
                                .background(LiveRed)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = "LIVE TRIP • BUS 01", fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CharcoalDark, titleContentColor = SurfaceWhite)
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Interactive Map Showing Operator's Live Bus Marker
            GoogleMap(
                modifier = Modifier.fillMaxSize(),
                cameraPositionState = cameraPositionState
            ) {
                Marker(
                    state = MarkerState(position = busPosition),
                    title = "🚌 BUS-01 (YOU ARE HERE)",
                    snippet = "Live location tracking active"
                )
            }

            // Bottom Telemetry Dashboard & END TRIP CTA
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter),
                shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                color = SurfaceWhite,
                shadowElevation = 16.dp
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.GpsFixed, contentDescription = null, tint = TransportGreenDark)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = "LOCATION SHARING ACTIVE", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TransportGreenDark)
                        }

                        Text(text = "±${myBusState?.accuracy ?: 8}m GPS", fontSize = 12.sp, color = TextSecondary)
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Privacy Note
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = OffWhiteBg
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Shield, contentDescription = null, tint = TransportGreenDark, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Your device's location is published strictly as BUS 01 LOCATION. Conductor personal info is never exposed.",
                                fontSize = 11.sp,
                                color = TextSecondary
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // END TRIP Primary CTA Button
                    Button(
                        onClick = { showEndTripDialog = true },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(54.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = LiveRed, contentColor = SurfaceWhite)
                    ) {
                        Icon(Icons.Default.Stop, contentDescription = null, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = "END TRIP", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                }
            }
        }
    }

    // Confirmation Alert Dialog for End Trip
    if (showEndTripDialog) {
        AlertDialog(
            onDismissRequest = { showEndTripDialog = false },
            title = { Text("End this trip?") },
            text = { Text("Live bus location broadcasting will stop immediately and the bus will no longer show as active.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        showEndTripDialog = false
                        viewModel.endOperatorTrip(context)
                        onEndTripCompleted()
                    }
                ) {
                    Text("END TRIP", color = LiveRed, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showEndTripDialog = false }) {
                    Text("CANCEL")
                }
            }
        )
    }
}
