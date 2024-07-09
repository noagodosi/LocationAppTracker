package com.myapp

import android.app.KeyguardManager
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.uimanager.ViewManager

class ScreenStateModule : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> {
        val modules: MutableList<NativeModule> = mutableListOf()
        modules.add(ScreenStateNativeModule(reactContext))
        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): MutableList<ViewManager<*, *>> {
        return mutableListOf()
    }


    private class ScreenStateNativeModule internal constructor(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

        override fun getName(): String {
            return "ScreenStateModule"
        }

        @ReactMethod
        fun isScreenLocked(promise: Promise) {
            try {
                val keyguardManager = reactContext.getSystemService(android.content.Context.KEYGUARD_SERVICE) as KeyguardManager
                val isLocked = keyguardManager.isKeyguardLocked
                promise.resolve(isLocked)
            } catch (e: Exception) {
                promise.reject(e)
            }
        }
    }
}
