/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  View,
  Switch
} from 'react-native';

import MenuBar from './MenuBar';
import LocationSampling from './LocationSampling';



const App = () =>{
  const [selectedOption, setSelectedOption] = useState("native Android");

  const handleOptionSelect = (option) => {
     setSelectedOption(option);
  };

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Location Tracker App</Text>
      <LocationSampling/>
      <Text style={styles.text}>Method : {selectedOption}</Text>
      <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={[styles.button, selectedOption === 'native Android' && styles.selectedButton]}
        onPress={() => handleOptionSelect('native Android')}>
        <Text style={[styles.buttonText, selectedOption === 'native Android' && styles.selectedButtonText]}>native Android</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedOption === 'react-native-get-location ' && styles.selectedButton]}
        onPress={() => handleOptionSelect('react-native-get-location ')}>
        <Text style={[styles.buttonText, selectedOption === 'react-native-get-location ' && styles.selectedButtonText]}>react-native-get-location </Text>
      </TouchableOpacity>
      </View>
    </View>
    <View style={styles.menu}>
    <MenuBar/>
    </View>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    content:{
    paddingTop:50,
            paddingHorizontal:40,
    },
    menu:{
    flex:1,
    paddingHorizontal:0,
    width:"100%"
    },
       title:{
            fontWeight:"600",
            fontSize:24,
            color:"#478CCF"
            },
        text: {
        textAlign:"center",
          marginTop: 20,
          fontSize: 18,
          color:"gray"
        },
            buttonsContainer: {
              flexDirection: 'column',
              justifyContent: 'center',
              marginTop: 10,
              gap:10
            },
            button: {
              paddingVertical: 10,
              paddingHorizontal: 20,
               borderWidth:1.5,
                           borderColor: '#dee2e6',
                            borderRadius: 10,
            },
            buttonText: {
              fontSize: 18,
              color: 'gray',
              textAlign: 'center',
            },
            selectedButton: {
             borderColor: '#81b0ff',
            },
            selectedButtonText: {
              fontSize:18,
              color:"#81b0ff"
            },
});

export default App;