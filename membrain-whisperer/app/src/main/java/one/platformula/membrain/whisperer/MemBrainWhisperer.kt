package one.platformula.membrain.whisperer

import android.Manifest
import android.content.pm.PackageManager
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MicOff
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.app.ActivityCompat
import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import com.google.android.gms.wearable.DataClient
import com.google.android.gms.wearable.DataEvent
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable
import kotlinx.coroutines.*

/**
 * PlatFormula.ONE powered by JoyceGPT
 * SOTA/BIC MemBrain Whisperer - Live Meeting Co-Pilot
 * Target: Samsung S25 Ultra (Engine) <-> Galaxy Watch 7 (Covert HUD)
 */
class MemBrainWhisperer : ComponentActivity(), DataClient.OnDataChangedListener {

    private var isBiometricallyLocked by mutableStateOf(false)
    private var isRecording by mutableStateOf(false)
    private var liveTranscript by mutableStateOf("")
    private var activeInsight by mutableStateOf("Awaiting investor query...")

    private val dataClient by lazy { Wearable.getDataClient(this) }
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var audioRecord: AudioRecord? = null

    // SOTA Gemini 2.5 Flash with Contextual RAG Injection
    private val geminiModel by lazy {
        GenerativeModel(
            modelName = "gemini-2.5-flash",
            apiKey = BuildConfig.GEMINI_API_KEY,
            systemInstruction = content {
                text("""
                    You are the MemBrain Whisperer. You are a covert intelligence module for Jonathan Behrendt during live VC pitches.
                    CONTEXT (RAG Data):
                    - Company: PlatFormula.ONE
                    - Target Raise: ${'$'}5M Seed
                    - Pre-Money Valuation: ${'$'}25M
                    - CAC: ${'$'}120, LTV: ${'$'}1800, Payback: 4 Months.
                    - Secret Sauce: MemBrain Poly-Modal Biometric Zero-Trust architecture.

                    INSTRUCTION:
                    Analyze the live transcription. If the investor asks a complex metric or aggressive question, instantly output a covert, highly concise data point (MAX 5 WORDS) that can be glanced at on a smartwatch HUD.
                    If no specific question is asked, output "LISTENING".
                """.trimIndent())
            }
        )
    }

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) startAudioCapture() else Log.e("Whisperer", "Microphone permission denied.")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            WhispererDashboard(
                isLocked = isBiometricallyLocked,
                isRecording = isRecording,
                transcript = liveTranscript,
                insight = activeInsight,
                onToggleMic = { toggleRecording() }
            )
        }
        checkPermissions()
    }

    override fun onResume() {
        super.onResume()
        dataClient.addListener(this)
    }

    override fun onPause() {
        super.onPause()
        dataClient.removeListener(this)
        stopAudioCapture()
    }

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
    }

    // MemBrain Biometric Lock Monitor
    override fun onDataChanged(dataEvents: DataEventBuffer) {
        for (event in dataEvents) {
            if (event.type == DataEvent.TYPE_CHANGED && event.dataItem.uri.path == "/membrain/pulse") {
                val dataMap = DataMapItem.fromDataItem(event.dataItem).dataMap
                val timestamp = dataMap.getLong("timestamp")

                // Dead-man's switch: 5-second pulse requirement
                val wasLocked = isBiometricallyLocked
                isBiometricallyLocked = (System.currentTimeMillis() - timestamp < 5000)

                // Instantly sever recording if biometric presence is lost
                if (wasLocked && !isBiometricallyLocked && isRecording) {
                    stopAudioCapture()
                    liveTranscript = "[SYSTEM SECURED: MEMBRAIN DISCONNECTED]"
                }
            }
        }
    }

    private fun checkPermissions() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            requestPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
        }
    }

    private fun toggleRecording() {
        if (!isBiometricallyLocked) return // Zero-Trust Enforcement
        if (isRecording) stopAudioCapture() else startAudioCapture()
    }

    private fun startAudioCapture() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) return

        isRecording = true
        val bufferSize = AudioRecord.getMinBufferSize(16000, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT)
        audioRecord = AudioRecord(MediaRecorder.AudioSource.MIC, 16000, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, bufferSize)

        audioRecord?.startRecording()

        scope.launch {
            // Simulated transcription buffer for MVP (Production replaces with on-device Speech-to-Text)
            val mockInvestorAudio = listOf(
                "Jonathan, your tech looks good, but...",
                "What is your actual customer acquisition cost?",
                "And how long until that pays back?"
            )

            for (phrase in mockInvestorAudio) {
                if (!isRecording) break
                delay(3000)
                liveTranscript = phrase
                processWithGemini(phrase)
            }
        }
    }

    private fun processWithGemini(text: String) {
        scope.launch {
            try {
                val response = geminiModel.generateContent(text)
                val insight = response.text?.trim() ?: "LISTENING"

                if (insight != "LISTENING" && isBiometricallyLocked) {
                    activeInsight = insight
                    transmitCovertInsightToWatch(insight)
                }
            } catch (e: Exception) {
                Log.e("Whisperer", "Gemini API Error", e)
            }
        }
    }

    private fun transmitCovertInsightToWatch(insight: String) {
        val putDataReq = PutDataMapRequest.create("/membrain/whisper").apply {
            dataMap.putString("insight", insight)
            dataMap.putLong("timestamp", System.currentTimeMillis())
            dataMap.putBoolean("trigger_haptic", true) // Tells Watch 7 to vibrate
        }.asPutDataRequest()

        putDataReq.setUrgent() // Force immediate Bluetooth LE dispatch
        dataClient.putDataItem(putDataReq)
    }

    private fun stopAudioCapture() {
        isRecording = false
        audioRecord?.stop()
        audioRecord?.release()
        audioRecord = null
    }
}

@Composable
fun WhispererDashboard(
    isLocked: Boolean,
    isRecording: Boolean,
    transcript: String,
    insight: String,
    onToggleMic: () -> Unit
) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            background = Color(0xFF0A0A0A),
            surface = Color(0xFF141414),
            primary = Color(0xFF00FF00),
            error = Color(0xFFFF0000)
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("MEMBRAIN WHISPERER", color = Color.DarkGray, fontWeight = FontWeight.Black, letterSpacing = 2.sp)
                Icon(
                    imageVector = Icons.Default.VisibilityOff,
                    contentDescription = "Covert Mode",
                    tint = Color.DarkGray,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.height(48.dp))

            // Security Status
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .border(1.dp, if (isLocked) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error, RoundedCornerShape(12.dp))
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Security,
                        contentDescription = "Security",
                        tint = if (isLocked) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = if (isLocked) "BIOMETRIC LOCK ACTIVE" else "HARDWARE DISCONNECTED",
                            color = if (isLocked) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                        Text(
                            text = if (isLocked) "S25 Engine Linked to Watch 7 HUD" else "Audio Capture Disabled",
                            color = Color.Gray,
                            fontSize = 11.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(48.dp))

            // Central Mic / Status
            IconButton(
                onClick = onToggleMic,
                enabled = isLocked,
                modifier = Modifier
                    .size(120.dp)
                    .clip(CircleShape)
                    .background(if (!isLocked) Color.DarkGray else if (isRecording) Color(0xFF1A1A1A) else MaterialTheme.colorScheme.primary)
                    .border(2.dp, if (isRecording) MaterialTheme.colorScheme.primary else Color.Transparent, CircleShape)
            ) {
                Icon(
                    imageVector = if (isRecording) Icons.Default.Mic else Icons.Default.MicOff,
                    contentDescription = "Mic",
                    tint = if (!isLocked) Color.Black else if (isRecording) MaterialTheme.colorScheme.primary else Color.Black,
                    modifier = Modifier.size(48.dp)
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Live Stream
            AnimatedVisibility(visible = isRecording) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("LIVE TRANSCRIPT", color = Color.Gray, fontSize = 10.sp, letterSpacing = 1.sp)
                    Text(
                        text = "\"$transcript\"",
                        color = Color.LightGray,
                        fontSize = 16.sp,
                        modifier = Modifier.padding(top = 8.dp, bottom = 24.dp)
                    )

                    Text("COVERT HUD PUSH (WATCH 7)", color = Color.Gray, fontSize = 10.sp, letterSpacing = 1.sp)
                    Text(
                        text = insight,
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }
            }
        }
    }
}
