package com.picklepulse.wear

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.wear.compose.material.*
import com.google.android.gms.wearable.DataClient
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable

class MainActivity : ComponentActivity() {
    private lateinit var dataClient: DataClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        dataClient = Wearable.getDataClient(this)

        setContent {
            WearAppTheme {
                MainScreen(
                    onScoreA = { sendScore("SCORE_A") },
                    onScoreB = { sendScore("SCORE_B") },
                    onUndo = { sendScore("UNDO") }
                )
            }
        }
    }

    private fun sendScore(action: String) {
        val putDataReq = PutDataMapRequest.create("/score_action").run {
            dataMap.putString("action", action)
            dataMap.putLong("timestamp", System.currentTimeMillis())
            asPutDataRequest()
        }
        dataClient.putDataItem(putDataReq)
    }
}

@Composable
fun MainScreen(
    onScoreA: () -> Unit,
    onScoreB: () -> Unit,
    onUndo: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize().padding(8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            Button(
                onClick = onScoreA,
                colors = ButtonDefaults.buttonColors(backgroundColor = Color.Blue)
            ) {
                Text("US")
            }
            
            Button(
                onClick = onScoreB,
                colors = ButtonDefaults.buttonColors(backgroundColor = Color.Red)
            ) {
                Text("THEM")
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(
            onClick = onUndo,
            colors = ButtonDefaults.buttonColors(backgroundColor = Color.DarkGray)
        ) {
            Text("UNDO")
        }
    }
}

@Composable
fun WearAppTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colors = Colors(
            primary = Color.Blue,
            secondary = Color.Red,
            error = Color.Red,
            onPrimary = Color.White,
            onSecondary = Color.White,
            onError = Color.White
        ),
        content = content
    )
}
