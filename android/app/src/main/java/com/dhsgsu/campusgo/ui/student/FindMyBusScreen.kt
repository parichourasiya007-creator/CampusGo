package com.dhsgsu.campusgo.ui.student

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.dhsgsu.campusgo.data.model.CampusStop
import com.dhsgsu.campusgo.ui.theme.*
import com.dhsgsu.campusgo.ui.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FindMyBusScreen(
    viewModel: MainViewModel,
    onNavigateBack: () -> Unit
) {
    val stops = viewModel.officialStops
    val result by viewModel.findMyBusResult.collectAsState()

    var selectedDestinationStop by remember { mutableStateOf(stops.first { it.id == "SCIENCE_BLOCK" }) }

    LaunchedEffect(selectedDestinationStop) {
        viewModel.calculateFindMyBus(null, null, selectedDestinationStop.id)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(text = "Find My Bus", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text(text = "Where do you want to go?", fontSize = 12.sp, color = TextSecondary)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = SurfaceWhite)
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(OffWhiteBg)
                .padding(16.dp)
        ) {
            // Location Input Box
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = SurfaceWhite,
                shadowElevation = 2.dp
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    // Pickup Row
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .clip(CircleShape)
                                .background(TransportGreen)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(text = "FROM (PICKUP)", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextMuted)
                            Text(text = "My Current Location / Gate 1", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Divider(color = BorderLight)
                    Spacer(modifier = Modifier.height(12.dp))

                    // Destination Row
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .clip(CircleShape)
                                .background(LiveRed)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(text = "TO (DESTINATION)", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextMuted)
                            Text(text = selectedDestinationStop.name, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TransportGreenDark)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Calculated Bus Route & ETA Card
            if (result != null) {
                val res = result!!
                if (res.active) {
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        color = CharcoalDark,
                        contentColor = SurfaceWhite
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(text = "🚌 ", fontSize = 20.sp)
                                    Text(
                                        text = res.busId ?: "BUS-01",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = SurfaceWhite
                                    )
                                }
                                Surface(
                                    shape = RoundedCornerShape(12.dp),
                                    color = TransportGreenBg
                                ) {
                                    Text(
                                        text = "● LIVE TRIP",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TransportGreenDark,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(16.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column {
                                    Text(text = "ARRIVES AT PICKUP STOP", fontSize = 10.sp, color = TextMuted)
                                    Text(text = "${res.pickupEtaMinutes} min", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TransportGreen)
                                }

                                Column(horizontalAlignment = Alignment.End) {
                                    Text(text = "EXPECTED ARRIVAL AT DESTINATION", fontSize = 10.sp, color = TextMuted)
                                    Text(text = "${res.destinationArrivalMinutes} min", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = SurfaceWhite)
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))
                            Divider(color = CharcoalSurface)
                            Spacer(modifier = Modifier.height(12.dp))

                            Text(
                                text = "Route: Main Gate → Central Library → Science Block",
                                fontSize = 12.sp,
                                color = TextMuted
                            )
                        }
                    }
                } else {
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        color = SurfaceWhite,
                        border = androidx.compose.foundation.BorderStroke(1.dp, BorderLight)
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = AlertWarning, modifier = Modifier.size(32.dp))
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(text = "No Active Buses", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Text(
                                text = "No buses are currently transmitting live location.",
                                fontSize = 13.sp,
                                color = TextSecondary
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(text = "SELECT DESTINATION STOP", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextMuted)
            Spacer(modifier = Modifier.height(8.dp))

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(stops) { stop ->
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { selectedDestinationStop = stop },
                        shape = RoundedCornerShape(12.dp),
                        color = if (selectedDestinationStop.id == stop.id) TransportGreenBg else SurfaceWhite,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (selectedDestinationStop.id == stop.id) TransportGreen else BorderLight
                        )
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = if (selectedDestinationStop.id == stop.id) TransportGreenDark else TextMuted
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = stop.name,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = if (selectedDestinationStop.id == stop.id) TransportGreenDark else TextPrimary
                                )
                                Text(text = stop.description ?: "", fontSize = 12.sp, color = TextSecondary)
                            }
                        }
                    }
                }
            }
        }
    }
}
