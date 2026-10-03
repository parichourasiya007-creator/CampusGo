package com.dhsgsu.campusgo.ui.student

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dhsgsu.campusgo.data.model.LiveBusState
import com.dhsgsu.campusgo.ui.theme.*
import com.dhsgsu.campusgo.ui.viewmodel.MainViewModel
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudentHomeScreen(
    viewModel: MainViewModel,
    onNavigateToFindMyBus: () -> Unit,
    onNavigateToRoutes: () -> Unit,
    onNavigateToStops: () -> Unit,
    onNavigateToOperator: () -> Unit
) {
    val activeBusesMap by viewModel.activeBuses.collectAsState()
    val selectedBusId by viewModel.selectedBusId.collectAsState()
    val activeBuses = activeBusesMap.values.toList()

    // DHSGSU Sagar Campus Coordinates
    val dhsgsuCampusCenter = LatLng(23.8327, 78.7816)
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(dhsgsuCampusCenter, 15.5f)
    }

    val selectedBusState = activeBuses.find { it.busId == selectedBusId }

    Scaffold(
        topBar = {
            Surface(
                color = CharcoalDark,
                contentColor = SurfaceWhite
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "🚌 ", fontSize = 22.sp)
                        Column {
                            Text(
                                text = "CampusGo",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = SurfaceWhite
                            )
                            Text(
                                text = "DHSGSU Sagar Campus Transport",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextMuted
                            )
                        }
                    }

                    Button(
                        onClick = onNavigateToOperator,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = TransportGreenDark,
                            contentColor = SurfaceWhite
                        ),
                        shape = RoundedCornerShape(20.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Default.Shield, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "Conductor", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        },
        bottomBar = {
            NavigationBar(
                containerColor = SurfaceWhite,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = true,
                    onClick = { },
                    icon = { Icon(Icons.Default.Map, contentDescription = "Home") },
                    label = { Text("Home") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToFindMyBus,
                    icon = { Icon(Icons.Default.Directions, contentDescription = "Find Bus") },
                    label = { Text("Find Bus") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToRoutes,
                    icon = { Icon(Icons.Default.AltRoute, contentDescription = "Routes") },
                    label = { Text("Routes") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToStops,
                    icon = { Icon(Icons.Default.LocationOn, contentDescription = "Stops") },
                    label = { Text("Stops") }
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Main Interactive Google Map View
            GoogleMap(
                modifier = Modifier.fillMaxSize(),
                cameraPositionState = cameraPositionState,
                uiSettings = MapUiSettings(
                    zoomControlsEnabled = false,
                    myLocationButtonEnabled = true
                )
            ) {
                // Campus Stop Markers
                viewModel.officialStops.forEach { stop ->
                    Marker(
                        state = MarkerState(position = LatLng(stop.lat, stop.lng)),
                        title = stop.name,
                        snippet = stop.code
                    )
                }

                // Active Bus Markers
                activeBuses.forEach { bus ->
                    Marker(
                        state = MarkerState(position = LatLng(bus.lat, bus.lng)),
                        title = "🚌 ${bus.busId} ● LIVE",
                        snippet = "Next: ${bus.nextStopName ?: "Central Library"}",
                        onClick = {
                            viewModel.selectBus(bus.busId)
                            true
                        }
                    )
                }
            }

            // Top Over-Map Header Pill: "Where do you want to go?" CTA
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
                    .align(Alignment.TopCenter),
                shape = RoundedCornerShape(16.dp),
                color = SurfaceWhite,
                shadowElevation = 6.dp
            ) {
                Row(
                    modifier = Modifier
                        .clickable { onNavigateToFindMyBus() }
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(TransportGreenBg),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Default.Search,
                                contentDescription = null,
                                tint = TransportGreenDark
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "Where do you want to go?",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = TextPrimary
                            )
                            Text(
                                text = "Find pickup stop, bus & live ETA",
                                fontSize = 12.sp,
                                color = TextSecondary
                            )
                        }
                    }
                    Icon(
                        Icons.Default.ArrowForward,
                        contentDescription = null,
                        tint = TransportGreen
                    )
                }
            }

            // Horizontal Active Buses Strip / No Buses Banner
            Column(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 16.dp)
            ) {
                if (activeBuses.isEmpty()) {
                    Surface(
                        modifier = Modifier
                            .padding(horizontal = 16.dp, vertical = 8.dp),
                        shape = RoundedCornerShape(24.dp),
                        color = CharcoalDark,
                        contentColor = SurfaceWhite
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(TextMuted)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "No buses are currently active on campus.",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                } else {
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(activeBuses) { bus ->
                            Surface(
                                modifier = Modifier.clickable { viewModel.selectBus(bus.busId) },
                                shape = RoundedCornerShape(20.dp),
                                color = if (selectedBusId == bus.busId) TransportGreenBg else SurfaceWhite,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (selectedBusId == bus.busId) TransportGreen else BorderLight
                                ),
                                shadowElevation = 2.dp
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .clip(CircleShape)
                                            .background(LiveRed)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = bus.busId,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        color = if (selectedBusId == bus.busId) TransportGreenDark else TextPrimary
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "● LIVE",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TransportGreenDark
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Draggable / Selected Bus Details Drawer Modal
            if (selectedBusState != null) {
                SelectedBusBottomSheet(
                    busState = selectedBusState,
                    onClose = { viewModel.selectBus(null) }
                )
            }
        }
    }
}

@Composable
fun SelectedBusBottomSheet(
    busState: LiveBusState,
    onClose: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 100.dp),
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
        color = SurfaceWhite,
        shadowElevation = 16.dp
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "🚌 ", fontSize = 24.sp)
                    Column {
                        Text(
                            text = busState.busId,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "CAMPUS SHUTTLE • ONLINE",
                            style = MaterialTheme.typography.labelSmall,
                            color = TransportGreen
                        )
                    }
                }
                IconButton(onClick = onClose) {
                    Icon(Icons.Default.Close, contentDescription = "Close")
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // ETA Hero Banner Box
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = CharcoalDark
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "APPROACHING NEXT STOP",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextMuted
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "📍 ${busState.nextStopName ?: "Science Block"}",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = SurfaceWhite
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "ESTIMATED ETA",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextMuted
                        )
                        Text(
                            text = "${busState.etaMinutes} min",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = TransportGreen
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Speed & Location Metrics Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Speed, contentDescription = null, tint = TextSecondary, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "${busState.speed.toInt()} km/h", fontSize = 13.sp, color = TextSecondary)
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.GpsFixed, contentDescription = null, tint = TextSecondary, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "±${busState.accuracy}m GPS accuracy", fontSize = 13.sp, color = TextSecondary)
                }
            }
        }
    }
}
