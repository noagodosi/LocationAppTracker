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
import { check, request } from "@react-native-community/permissions";
import RNFS from "react-native-fs";
import GetLocation from "react-native-get-location";

const LocationSampling = ({ mode }) => {
  const { ScreenStateModule, LocationModule } = NativeModules;

  const [currentLocation, setCurrentLocation] = useState(null);
  const [isSampling, setIsSampling] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [isLocked, setIsLocked] = useState<boolean | null>(null);

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

  // Request permissions to get the device location
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
        // Check if both permissions are granted
        if (
          locationGranted === PermissionsAndroid.RESULTS.GRANTED &&
          storageGranted === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("Location and storage permissions granted");
        } else {
          console.log("Location or storage permission denied");
        }
      } catch (error) {
        console.warn("Error requesting permissions:", error);
      }
    };
    requestPermissions();
  }, []);

  // Sample user location each 5 second
  useEffect(() => {
    const intervalId = setInterval(async () => {
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
          console.log("native Android", location);
        }
        if (!Object.keys(location || {})?.length) {
          console.log("failed to get location coordinates");
          return;
        }
        console.log("success to fetch location", location);
        setCurrentLocation(location);
        const locked = await ScreenStateModule.isScreenLocked();
        setIsLocked(locked);

        const newSample = {
          location,
          timestamp: getCurrentDate(),
          displayState:
            locked === null ? "Loading..." : isLocked ? "Locked" : "Unlocked",
          mode,
        };

        const updatedLocationData = [newSample, ...locationData];
        setLocationData(prevData => [newSample, ...prevData]);
        saveDataToFile(updatedLocationData);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId);
  }, [mode]);

  const toggleSampling = () => {
    setIsSampling((prevState) => !prevState);
  };

  const saveDataToFile = async (updatedLocationData) => {
    const filePath = `${RNFS.DocumentDirectoryPath}/location_data.json`;
    const jsonData = JSON.stringify(updatedLocationData, null, 2);

    try {
      await RNFS.writeFile(filePath, jsonData, "utf8");
      console.log("Data saved to file:", filePath);
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
            {isSampling ? "Stop Sampling" : "Start Sampling"}
          </Text>
          <Switch
            trackColor={{ false: "gray", true: "#81b0ff" }}
            thumbColor={isSampling ? "#EEEDEB" : "#f4f3f4"}
            onValueChange={toggleSampling}
            value={isSampling}
            style={{
              transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
              marginTop: 20,
              marginHorizontal: 10,
            }}
          />
        </View>

        <Text style={styles.textLocation}>
          Current Location:{" "}
          {currentLocation
            ? `${currentLocation.latitude}, ${currentLocation.longitude}`
            : "Unknown"}
        </Text>
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
