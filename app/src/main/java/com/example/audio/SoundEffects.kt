package com.example.audio

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlin.math.sin

/**
 * High-performance, zero-asset dynamic sound synthesizer for party games.
 * Generates polished, satisfying procedural sound effects via AudioTrack:
 * - Button Pop / Tap
 * - Dare Drop Thud / Whoosh
 * - Success / Fanfare Chime
 * - Skip / Swish
 * - Player Reel Tick
 */
object SoundEffects {
    private val scope = CoroutineScope(Dispatchers.Default)
    private var isMuted = false

    fun toggleMute(): Boolean {
        isMuted = !isMuted
        return isMuted
    }

    fun isMuted(): Boolean = isMuted

    /**
     * Crisp, snappy bubble pop for clicks & button taps
     */
    fun playTap() {
        if (isMuted) return
        scope.launch {
            playTonalSweep(startFreq = 380f, endFreq = 720f, durationMs = 45, volume = 0.5f)
        }
    }

    /**
     * Distinct mechanical tick for player shuffle roulette
     */
    fun playTick() {
        if (isMuted) return
        scope.launch {
            playTonalSweep(startFreq = 600f, endFreq = 400f, durationMs = 25, volume = 0.4f)
        }
    }

    /**
     * Satisfying bassy drop with high-to-low whoosh impact
     */
    fun playDrop() {
        if (isMuted) return
        scope.launch {
            // Whoosh down followed by punchy bass thump
            playTonalSweep(startFreq = 850f, endFreq = 220f, durationMs = 120, volume = 0.7f)
            playTonalSweep(startFreq = 180f, endFreq = 65f, durationMs = 140, volume = 0.85f)
        }
    }

    /**
     * Celebratory major triad chime (C5 - E5 - G5 - C6)
     */
    fun playSuccess() {
        if (isMuted) return
        scope.launch {
            val notes = listOf(523.25f, 659.25f, 783.99f, 1046.50f)
            notes.forEachIndexed { index, freq ->
                playChimeNote(freq = freq, durationMs = 110, volume = 0.75f)
                kotlinx.coroutines.delay(65)
            }
        }
    }

    /**
     * Quick airy swish for skipping or passing
     */
    fun playSkip() {
        if (isMuted) return
        scope.launch {
            playTonalSweep(startFreq = 420f, endFreq = 950f, durationMs = 85, volume = 0.5f)
        }
    }

    /**
     * Player added / success tag tone
     */
    fun playAddPlayer() {
        if (isMuted) return
        scope.launch {
            playChimeNote(freq = 587.33f, durationMs = 70, volume = 0.6f)
            kotlinx.coroutines.delay(45)
            playChimeNote(freq = 880.00f, durationMs = 90, volume = 0.7f)
        }
    }

    private fun playTonalSweep(
        startFreq: Float,
        endFreq: Float,
        durationMs: Int,
        volume: Float
    ) {
        val sampleRate = 22050
        val numSamples = (sampleRate * (durationMs / 1000f)).toInt().coerceAtLeast(1)
        val buffer = ShortArray(numSamples)

        var currentPhase = 0.0
        val twoPi = 2.0 * Math.PI

        for (i in 0 until numSamples) {
            val progress = i.toFloat() / numSamples
            // Linear frequency interpolation
            val currentFreq = startFreq + (endFreq - startFreq) * progress
            // Smooth decay envelope to avoid clicks
            val envelope = (1.0f - progress) * (1.0f - progress)
            currentPhase += twoPi * currentFreq / sampleRate

            val sample = (sin(currentPhase) * envelope * volume * Short.MAX_VALUE).toInt()
            buffer[i] = sample.coerceIn(Short.MIN_VALUE.toInt(), Short.MAX_VALUE.toInt()).toShort()
        }

        playPcm(buffer, sampleRate)
    }

    private fun playChimeNote(
        freq: Float,
        durationMs: Int,
        volume: Float
    ) {
        val sampleRate = 22050
        val numSamples = (sampleRate * (durationMs / 1000f)).toInt().coerceAtLeast(1)
        val buffer = ShortArray(numSamples)

        var currentPhase = 0.0
        val twoPi = 2.0 * Math.PI

        for (i in 0 until numSamples) {
            val progress = i.toFloat() / numSamples
            // Bell-like exponential decay envelope
            val envelope = (1.0f - progress).let { it * it * it }
            currentPhase += twoPi * freq / sampleRate

            // Fundamental + gentle second harmonic for bell richness
            val fundamental = sin(currentPhase)
            val harmonic = sin(currentPhase * 2.0) * 0.25
            val sample = ((fundamental + harmonic) * envelope * volume * Short.MAX_VALUE).toInt()

            buffer[i] = sample.coerceIn(Short.MIN_VALUE.toInt(), Short.MAX_VALUE.toInt()).toShort()
        }

        playPcm(buffer, sampleRate)
    }

    private fun playPcm(buffer: ShortArray, sampleRate: Int) {
        try {
            val audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_GAME)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                        .build()
                )
                .setBufferSizeInBytes(buffer.size * 2)
                .setTransferMode(AudioTrack.MODE_STATIC)
                .build()

            audioTrack.write(buffer, 0, buffer.size)
            audioTrack.play()
            // Clean up after playback
            scope.launch {
                kotlinx.coroutines.delay((buffer.size * 1000L / sampleRate) + 50)
                try {
                    audioTrack.stop()
                    audioTrack.release()
                } catch (_: Exception) {}
            }
        } catch (_: Exception) {
            // Gracefully ignore audio hardware initialization errors
        }
    }
}
