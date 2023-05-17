import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, ScrollView, Image, SafeAreaView } from "react-native";
import { screenStyles } from "../../styles";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    try {
      // exif = true to get metadata of image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 2,
        base64: true,
        exif: true,
      });
      if (!result.cancelled) {
        const imageArray = result.selected.filter((img) => !img.cancelled);
        setImages(imageArray);
        console.log("ARR", imageArray);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setImages([]);
    }
  };

  useFocusEffect(React.useCallback(() => {}, [images]));

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={screenStyles.container}>
        <Text>Home Screen!</Text>
        <StatusBar style="auto" />
        <Button mode="contained" onPress={pickImage}>
          Pick an image from camera roll
        </Button>
        {images.length > 0 && (
          <>
            {images.map((img, idx) => (
              <Image
                key={idx}
                source={img.uri}
                style={{ margin: 20, width: 200, height: 200 }}
              />
            ))}
            <Button mode="contained" onPress={() => setImages([])}>
              Clear Selection
            </Button>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
