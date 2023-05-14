import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, Button, Image } from "react-native";
import { screenStyles } from "../../styles";
import * as ImagePicker from "expo-image-picker";

const HomeScreen = () => {
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      console.log(result.uri);
      if (!result.cancelled) {
        setImage(result.uri);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={screenStyles.container}>
      <Text>Home Screen!</Text>
      <StatusBar style="auto" />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
};

export default HomeScreen;
