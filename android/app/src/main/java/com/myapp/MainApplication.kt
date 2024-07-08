package com.myapp
import com.myapp.ScreenStateModule
import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.shell.MainReactPackage
import com.facebook.soloader.SoLoader
import java.util.Arrays


class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost by lazy {
        object : ReactNativeHost(this) {
            override fun getPackages(): MutableList<ReactPackage> {
                val packages = PackageList(this).packages.toMutableList()
                packages.add(ScreenStateModule())
                return packages
            }

            override fun getJSMainModuleName(): String {
                return "index"
            }

            override fun getUseDeveloperSupport(): Boolean {
                return BuildConfig.DEBUG
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, /* native exopackage */ false)
    }
}
