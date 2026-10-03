package com.dhsgsu.campusgo.ui.operator

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dhsgsu.campusgo.data.model.UserRole
import com.dhsgsu.campusgo.ui.theme.*
import com.dhsgsu.campusgo.ui.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OperatorLoginScreen(
    viewModel: MainViewModel,
    onLoginSuccess: () -> Unit,
    onSwitchToStudent: () -> Unit
) {
    var employeeId by remember { mutableStateOf("EMP-DHSGSU-501") }
    var password by remember { mutableStateOf("••••••••") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Operator Portal", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CharcoalDark, titleContentColor = SurfaceWhite),
                actions = {
                    TextButton(onClick = onSwitchToStudent) {
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
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = CharcoalDark,
                modifier = Modifier.size(64.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.Shield, contentDescription = null, tint = TransportGreen, modifier = Modifier.size(36.dp))
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            Text(text = "CampusGo Conductor Panel", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(text = "DHSGSU Sagar Transport Operations", fontSize = 13.sp, color = TextSecondary)

            Spacer(modifier = Modifier.height(32.dp))

            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = SurfaceWhite,
                shadowElevation = 4.dp
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    OutlinedTextField(
                        value = employeeId,
                        onValueChange = { employeeId = it },
                        label = { Text("Employee ID / Mobile Number") },
                        leadingIcon = { Icon(Icons.Default.Badge, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = { Text("Password") },
                        leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
                        visualTransformation = PasswordVisualTransformation(),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    Button(
                        onClick = {
                            viewModel.setUserRole(UserRole.OPERATOR)
                            onLoginSuccess()
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = CharcoalDark, contentColor = SurfaceWhite)
                    ) {
                        Text(text = "LOGIN TO CONDUCTOR PANEL", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }
            }
        }
    }
}
