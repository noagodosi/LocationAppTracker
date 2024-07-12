import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LocationSampling from "./frontend/LocationSampling";
import { ModeEnum } from "./frontend/types";

const App = () => {
  const [selectedOption, setSelectedOption] = useState<ModeEnum>(ModeEnum.NATIVE_ANDROID);

  const locationMethod = (name: ModeEnum) => (
    <TouchableOpacity
      style={[styles.button, selectedOption === name && styles.selectedButton]}
      onPress={() => setSelectedOption(name)}
    >
      <Text
        style={[
          styles.buttonText,
          selectedOption === name && styles.selectedButtonText,
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Location Tracker App</Text>
        <LocationSampling mode={selectedOption} />
        <Text style={styles.text}>Method : {selectedOption}</Text>
        <View style={styles.buttonsContainer}>
          {locationMethod(ModeEnum.NATIVE_ANDROID)}
          {locationMethod(ModeEnum.REACT_NATIVE)}
        </View>
      </View>
      <View style={styles.menu}>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 50,
    paddingHorizontal: 40,
  },
  menu: {
    flex: 1,
    paddingHorizontal: 0,
    width: "100%",
  },
  title: {
    fontWeight: "600",
    fontSize: 24,
    color: "#478CCF",
    textAlign: "center",
  },
  text: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "#dee2e6",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },
  selectedButton: {
    borderColor: "#81b0ff",
  },
  selectedButtonText: {
    fontSize: 18,
    color: "#81b0ff",
  },
});

export default App;
