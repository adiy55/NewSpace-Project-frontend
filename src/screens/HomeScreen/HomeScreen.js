import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, ScrollView, Image, SafeAreaView } from "react-native";
import { screenStyles } from "../../styles";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";

const HomeScreen = () => {
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    try {
      // exif = true to get metadata of image
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        exif: true,
      });
      if (!result.cancelled) {
        setImage(result.uri);
        console.log(result.exif);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={screenStyles.container}>
      <SafeAreaView>
        <Text>Home Screen!</Text>
        <StatusBar style="auto" />
        <Button mode="contained" onPress={pickImage}>
          Pick an image from camera roll
        </Button>
        {image && (
          <>
            <Image
              source={{ uri: image }}
              style={{ margin: 20, width: 200, height: 200 }}
            />
            <Button mode="contained" onPress={() => setImage(null)}>
              Clear Selection
            </Button>
          </>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;
