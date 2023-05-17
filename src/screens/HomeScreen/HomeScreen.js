import React, { useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, ScrollView, Image, SafeAreaView } from "react-native";
import { screenStyles } from "../../styles";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { AxiosContext } from "../../context/AxiosContext";

const HomeScreen = () => {
  const { publicAxios } = useContext(AxiosContext);
  const [images, setImages] = useState([]);

  const selectImages = async () => {
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
      }
    } catch (error) {
      console.error(error);
      setImages([]);
    }
  };

  const onImagesSelected = async () => {
    try {
      const data = {
        images: images.map((img) => {
          return img.base64;
        }),
      };
      console.log(data);
      const response = await publicAxios.post("/image", data);
      if (response.status === 200) {
        console.log("SUCCESS!");
        const { filenames } = response.data;
        console.log(filenames);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(React.useCallback(() => {}, [images]));

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={screenStyles.container}>
        <Text>Home Screen!</Text>
        <StatusBar style="auto" />
        <Button mode="contained" onPress={selectImages}>
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
            <Button
              mode="contained"
              onPress={() =>
                onImagesSelected()
                  .then()
                  .catch((e) => console.error(e))
              }>
              Apply Selection
            </Button>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
