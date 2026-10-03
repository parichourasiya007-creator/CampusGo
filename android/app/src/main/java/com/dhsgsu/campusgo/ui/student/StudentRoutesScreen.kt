package com.dhsgsu.campusgo.ui.student

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AltRoute
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dhsgsu.campusgo.ui.theme.*
import com.dhsgsu.campusgo.ui.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudentRoutesScreen(
    viewModel: MainViewModel,
    onNavigateBack: () -> Unit
) {
    val routes = viewModel.officialRoutes

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = "Campus Shuttle Routes", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = SurfaceWhite)
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(OffWhiteBg)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(routes) { route ->
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = SurfaceWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderLight)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.AltRoute, contentDescription = null, tint = TransportGreenDark)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = route.code,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = TransportGreenDark
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = route.name, fontWeight = FontWeight.Bold, fontSize = 16.sp)

                        Spacer(modifier = Modifier.height(12.dp))
                        Divider(color = BorderLight)
                        Spacer(modifier = Modifier.height(12.dp))

                        Text(text = "STOPS ON ROUTE", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextMuted)
                        Spacer(modifier = Modifier.height(6.dp))

                        route.stops.forEachIndexed { idx, stop ->
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(text = "${idx + 1}. ", fontSize = 12.sp, color = TextMuted)
                                Text(text = stop.name, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                            }
                        }
                    }
                }
            }
        }
    }
}
