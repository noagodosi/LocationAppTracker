package com.myapp

import android.content.Intent
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager

class ForegroundServiceModule : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> {
        val modules: MutableList<NativeModule> = mutableListOf()
        modules.add(ForegroundServiceNativeModule(reactContext))
        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): MutableList<ViewManager<*, *>> {
        return mutableListOf()
    }


    private class ForegroundServiceNativeModule internal constructor(private val reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

        override fun getName(): String {
            return "ForegroundServiceModule"
        }

        @ReactMethod
        fun startForegroundService(inputExtra: String) {
            val serviceIntent =  Intent(reactContext, ForegroundService::class.java)
            serviceIntent.putExtra("inputExtra", inputExtra)
            reactContext.startService(serviceIntent)
        }

        @ReactMethod
        fun stopForegroundService() {
            val serviceIntent = Intent(reactContext, ForegroundService::class.java)
            reactContext.stopService(serviceIntent)
        }
    }
}
