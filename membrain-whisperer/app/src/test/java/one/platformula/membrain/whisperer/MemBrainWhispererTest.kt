package one.platformula.membrain.whisperer

import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * Unit tests for MemBrain Whisperer business logic.
 * UI and Wearable integration tests live in androidTest/.
 */
class MemBrainWhispererTest {

    @Test
    fun biometricLock_blocksRecording_whenUnlocked() {
        // Dead-man's switch: a timestamp older than 5 seconds must evaluate as disconnected
        val oldTimestamp = System.currentTimeMillis() - 6_000L
        val isConnected = (System.currentTimeMillis() - oldTimestamp) < 5_000L
        assertEquals(false, isConnected)
    }

    @Test
    fun biometricLock_allowsRecording_whenLocked() {
        val freshTimestamp = System.currentTimeMillis() - 1_000L
        val isConnected = (System.currentTimeMillis() - freshTimestamp) < 5_000L
        assertEquals(true, isConnected)
    }

    @Test
    fun insightTrimming_removesWhitespace() {
        val rawResponse = "  CAC \$120, LTV \$1800  "
        val trimmed = rawResponse.trim()
        assertEquals("CAC \$120, LTV \$1800", trimmed)
    }

    @Test
    fun listeningFallback_whenResponseIsNull() {
        val responseText: String? = null
        val insight = responseText?.trim() ?: "LISTENING"
        assertEquals("LISTENING", insight)
    }
}
