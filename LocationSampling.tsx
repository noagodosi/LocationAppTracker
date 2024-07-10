import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  NativeModules,
} from "react-native";
import RNFS from "react-native-fs";
import GetLocation from "react-native-get-location";

const LocationSampling = ({ mode }) => {
  const { ScreenStateModule, LocationModule, ForegroundServiceModule } =
    NativeModules;
  const [currentLocation, setCurrentLocation] = useState("null");
  const [isVisible, setIsVisible] = useState(false);
  const [locationData, setLocationData] = useState([]);
console.log("LocationSampling render")
  // Request permissions
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Request location permission
        const locationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message:
              "This app needs access to your location to function properly.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        // Request background location permission (for Android 10 and above)
        if (PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION) {
          const backgroundLocationGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: "Background Location Permission",
              message:
                "This app needs access to your location in the background.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (
            backgroundLocationGranted === PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log("Background location permission granted");
          } else {
            console.log("Background location permission denied");
          }
        } else {
          console.log(
            "Background location permission not available on this device"
          );
        }

        // Request storage permissions
        const storageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "This app needs access to storage to save data.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        // Check if all permissions are granted
        if (
          locationGranted === PermissionsAndroid.RESULTS.GRANTED &&
          storageGranted === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("location service, and storage permissions granted");
        } else {
          console.log("One or more permissions denied");
        }
      } catch (error) {
        console.warn("Error requesting permissions:", error);
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const startForegroundService = async () => {
      try {
         ForegroundServiceModule.startForegroundService("currentLocation");
         console.log("Foreground service started");

      } catch (error) {
         console.error("Error starting foreground service:", error);
      }
    }
    startForegroundService();

    return () => ForegroundServiceModule.stopForegroundService();
  }, []);

  // Import the existing location data
  useEffect(() => {
    const fetchDataFromFile = async () => {
      try {
        const filePath = `${RNFS.DocumentDirectoryPath}/location_data.json`;
        const fileContent = await RNFS.readFile(filePath, "utf8");
        const parsedData = JSON.parse(fileContent);
        setLocationData(parsedData);
      } catch (error) {
        console.error("Error reading data:", error);
      }
    };
    fetchDataFromFile();
  }, []);

  // Sample user location each 5 second
  useEffect(() => {
    const intervalId = setInterval(async () => {
      console.log("app is running");
      try {
        let location = {};
        if (mode === "react-native-get-location") {
          console.log("react-native-get-location");
          const { latitude, longitude } = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          });
          location = { latitude, longitude };
        } else if (mode === "native Android") {
          console.log("native Android");
          const { latitude, longitude } =
            await LocationModule.getCurrentLocation();
          location = { latitude, longitude };
        }
        if (!Object.keys(location || {})?.length) {
          console.log("failed to get location coordinates");
          return;
        }
        setCurrentLocation(location);

        const locked = await ScreenStateModule.isScreenLocked();
        console.log(locked ? "Locked" : "Unlock");

        const newSample = {
          location,
          timestamp: getCurrentDate(),
          displayState: locked ? "Locked" : "Unlock",
          method: mode,
        };
        setLocationData((prevData) => [newSample, ...prevData]);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId);
  }, [mode]);

  //call saveDataFile function when location update
  useEffect(() => {
    saveDataToFile();
  }, [locationData]);

  const toggleVisible = () => {
    setIsVisible((prevState) => !prevState);
  };

  const saveDataToFile = async () => {
    const filePath = `${RNFS.DocumentDirectoryPath}/location_data.json`;
    const jsonData = JSON.stringify(locationData, null, 2);

    try {
      await RNFS.writeFile(filePath, jsonData, "utf8");
	  console.log("saveDataToFile")
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const getCurrentDate = () => {
    const currentDateObject = new Date();

    const day = String(currentDateObject.getDate()).padStart(2, "0");
    const month = String(currentDateObject.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const year = currentDateObject.getFullYear();

    const hours = String(currentDateObject.getHours()).padStart(2, "0");
    const minutes = String(currentDateObject.getMinutes()).padStart(2, "0");
    const seconds = String(currentDateObject.getSeconds()).padStart(2, "0");

    const date = `${day}-${month}-${year}`;
    const time = `${hours}:${minutes}:${seconds}`;
    return { date, time };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.subtitle}>Please select mode</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.text}>
            {isVisible ? "Hide Location" : "Show Location"}
          </Text>
          <Switch
            trackColor={{ false: "gray", true: "#81b0ff" }}
            thumbColor={isVisible ? "#EEEDEB" : "#f4f3f4"}
            onValueChange={toggleVisible}
            value={isVisible}
            style={{
              transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
              marginTop: 20,
              marginHorizontal: 10,
            }}
          />
        </View>

        {isVisible && (
          <Text style={styles.textLocation}>
            Current Location:{" "}
            {currentLocation
              ? `${currentLocation.latitude}, ${currentLocation.longitude}`
              : "Unknown"}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginBottom: 50,
  },
  subtitle: {
    marginTop: 50,
    fontSize: 18,
    color: "gray",
  },
  switchContainer: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 30,
  },
  text: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  textLocation: {
    textAlign: "center",
    marginTop: 0,
    fontSize: 16,
    color: "#81b0ff",
  },
});

export default LocationSampling;
