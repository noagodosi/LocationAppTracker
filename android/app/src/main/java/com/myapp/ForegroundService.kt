package com.myapp

import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class ForegroundService : Service() {

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val input = intent?.getStringExtra("inputExtra") ?: ""
        when(intent?.action){
            ACTION_START -> start(input)
            ACTION_STOP -> stop()
        }
        return super.onStartCommand(intent, flags, startId)
    }

    @SuppressLint("NotificationPermission")
    private fun start(input:String) {
        val notificationManager = createNotificationChannel()

        val notification =NotificationCompat.Builder(this,"location")
            .setContentTitle("Tracking location..")
            .setContentText(input)
            .setSmallIcon(R.drawable.ic_launcher_round)
            .setOngoing(true)

        startForeground(1, notification.build())

        val updateNotification = notification.setContentText("updated")
        notificationManager?.notify(1, updateNotification.build());
    }

    private fun stop() {
        stopForeground(false)
//        stopSelf()
    }

    private fun createNotificationChannel() :NotificationManager? {
        var notificationManager:NotificationManager?= null
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "location",
                "Location",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            notificationManager = getSystemService(android.content.Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
        return notificationManager

    }

    companion object {
        const val ACTION_START ="ACTION_START"
        const val ACTION_STOP ="ACTION_STOP"
    }
}
