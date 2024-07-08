import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MenuBar = () => {
  const handleHomePress = () => {
    console.log('Home button pressed');
  };

  const handleHistoryPress = () => {
    console.log('History button pressed');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleHomePress}>
        <Icon name="home-outline" size={30} color="#ced4da" />
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleHistoryPress}>
        <Icon name="time-outline" size={30} color="#ced4da" />
        <Text style={styles.buttonText}>History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  button: {
  padding:5,
    flex: 1,
   borderTopWidth: 1.5,
       borderTopColor: '#dee2e6',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    margin: 5,
    color: 'gray',
  },
});

export default MenuBar;
