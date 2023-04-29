import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { screenStyles } from "../../styles";

const HomeScreen = () => {
  return (
    <View style={screenStyles.container}>
      <Text>Home Screen!</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default HomeScreen;
