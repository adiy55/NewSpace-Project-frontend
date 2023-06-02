import React from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { style } from "../../styles";
import { Text } from "react-native-paper";

const HistoryScreen = () => {
  return (
    <View style={style.container}>
      <Text>History Screen!</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default HistoryScreen;
