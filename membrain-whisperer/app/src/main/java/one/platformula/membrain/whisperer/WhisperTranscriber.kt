package one.platformula.membrain.whisperer

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.concurrent.TimeUnit

/**
 * SuperWhisper — real-time meeting transcription via OpenAI Whisper API.
 *
 * Accepts raw 16 kHz mono PCM samples (ShortArray), wraps them in a standard
 * WAV container, and POSTs to /v1/audio/transcriptions.  The response_format
 * is "text" so no JSON parsing is needed — the body IS the transcript.
 *
 * Audio is chunked by the caller (see [CHUNK_SAMPLES]).  Each chunk is
 * transcribed independently; consecutive chunks are fed to Gemini so the
 * full conversation context builds naturally over the meeting.
 */
class WhisperTranscriber(private val apiKey: String) {

    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    /**
     * Transcribe one PCM chunk.  Suspend-safe; runs on [Dispatchers.IO].
     * Returns the transcript string, or null if silent / API error.
     */
    suspend fun transcribe(pcmData: ShortArray, sampleRate: Int = SAMPLE_RATE): String? =
        withContext(Dispatchers.IO) {
            try {
                val wavBytes = pcmToWav(pcmData, sampleRate)

                val body = MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("model", "whisper-1")
                    .addFormDataPart("language", "en")
                    .addFormDataPart("response_format", "text")   // plain text, no JSON wrapper
                    .addFormDataPart(
                        "file",
                        "chunk.wav",
                        wavBytes.toRequestBody("audio/wav".toMediaType())
                    )
                    .build()

                val request = Request.Builder()
                    .url("https://api.openai.com/v1/audio/transcriptions")
                    .header("Authorization", "Bearer $apiKey")
                    .post(body)
                    .build()

                val response = client.newCall(request).execute()
                if (response.isSuccessful) {
                    response.body?.string()?.trim()?.takeIf { it.isNotBlank() }
                } else {
                    Log.e(TAG, "Whisper API ${response.code}: ${response.body?.string()}")
                    null
                }
            } catch (e: Exception) {
                Log.e(TAG, "Transcription error", e)
                null
            }
        }

    // ── WAV encoding ──────────────────────────────────────────────────────────

    /**
     * Prepend a standard 44-byte RIFF/WAVE/PCM header to the raw sample data.
     * Whisper accepts audio/wav; this avoids any native codec dependency.
     */
    private fun pcmToWav(pcmData: ShortArray, sampleRate: Int): ByteArray {
        // Convert shorts → little-endian bytes
        val pcmBytes = ByteArray(pcmData.size * 2)
        ByteBuffer.wrap(pcmBytes).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().put(pcmData)

        val out = ByteArrayOutputStream(44 + pcmBytes.size)

        val header = ByteBuffer.allocate(44).order(ByteOrder.LITTLE_ENDIAN).apply {
            put("RIFF".toByteArray())
            putInt(36 + pcmBytes.size)      // total file size − 8
            put("WAVE".toByteArray())
            put("fmt ".toByteArray())
            putInt(16)                      // PCM fmt chunk length
            putShort(1)                     // AudioFormat = PCM
            putShort(1)                     // channels = mono
            putInt(sampleRate)
            putInt(sampleRate * 2)          // byte rate = sampleRate × blockAlign
            putShort(2)                     // block align = channels × (bits/8)
            putShort(16)                    // bits per sample
            put("data".toByteArray())
            putInt(pcmBytes.size)
        }

        out.write(header.array())
        out.write(pcmBytes)
        return out.toByteArray()
    }

    companion object {
        private const val TAG = "SuperWhisper"

        const val SAMPLE_RATE = 16_000          // Hz — matches AudioRecord config
        const val CHUNK_SECONDS = 5             // seconds per Whisper request
        val CHUNK_SAMPLES = SAMPLE_RATE * CHUNK_SECONDS   // 80,000 shorts per chunk
    }
}
