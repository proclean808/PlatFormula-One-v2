# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.kts.

# Keep Wearable Data Layer classes
-keep class com.google.android.gms.wearable.** { *; }

# Keep Gemini SDK
-keep class com.google.ai.client.generativeai.** { *; }

# Kotlin coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
