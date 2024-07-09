package com.myapp

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ViewManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import android.util.Log

class LocationModule : ReactPackage {

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): MutableList<NativeModule> {
        val modules: MutableList<NativeModule> = mutableListOf()
        modules.add(LocationNativeModule(reactContext))
        return modules
    }

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): MutableList<ViewManager<*, *>> {
        return mutableListOf()
    }

    private class LocationNativeModule internal constructor(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), LocationListener {

        private var locationManager: LocationManager? = null
        private var locationPromise: Promise? = null

        init {
            locationManager =
                reactContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        }

        override fun getName(): String {
            return "LocationModule"
        }

        @SuppressLint("MissingPermission")
        @ReactMethod
        fun getCurrentLocation(promise: Promise) {
            locationPromise = promise
            locationManager?.requestSingleUpdate(LocationManager.GPS_PROVIDER, this, null)
        }

        override fun onLocationChanged(location: Location) {
            locationManager?.removeUpdates(this)

            val locationMap = Arguments.createMap()
            locationMap.putDouble("latitude", location.latitude)
            locationMap.putDouble("longitude", location.longitude)

            locationPromise?.resolve(locationMap)
            locationPromise = null
        }

        override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {
            // Handle location provider status changes if needed
        }

        override fun onProviderEnabled(provider: String) {
            // Handle provider enabled
        }

        override fun onProviderDisabled(provider: String) {
            // Handle provider disabled
        }
    }
}
