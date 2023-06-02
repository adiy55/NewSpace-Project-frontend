import React, { useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, ScrollView, Image, View, SafeAreaView } from "react-native";
import { screenStyles } from "../../styles";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { AxiosContext } from "../../context/AxiosContext";

const HomeScreenOld = () => {
  const { publicAxios } = useContext(AxiosContext);
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const selectImages = async () => {
    try {
      // exif = true to get metadata of image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        exif: true,
      });
      if (!result.cancelled) {
        // DateTimeOriginal, Orientation,
        console.log(result?.exif?.Orientation);
        // DateTimeDigitized, DateTimeOriginal
        console.log(result?.exif?.DateTimeDigitized);
        // GPSLatitude
        console.log(result?.exif?.GPSLatitude);
        // GPSLongitude
        console.log(result?.exif?.GPSLongitude);
        setImage(result);
      }
    } catch (error) {
      console.error(error);
      setImage(null);
    }
  };

  const onImagesSelected = async () => {
    try {
      // const data = {
      //   images: [image.base64],
      // };
      const data = {
        fov: 60,
        datetime_str: image?.exif?.DateTimeOriginal,
        latitude: image?.exif?.GPSLatitude,
        longitude: image?.exif?.GPSLongitude,
      };
      console.log(data);
      const response = await publicAxios.post("/stars", data);
      if (response.status === 200) {
        console.log("SUCCESS!");
        const { encBase64 } = response.data;
        setBase64Image(encBase64);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
    }, [image, base64Image])
  );

  if (base64Image != null) {
    return (
      <SafeAreaView>
        <Image source={base64Image} />
        <Button mode="contained" onPress={() => setImage(null)}>
          Clear Selection
        </Button>
      </SafeAreaView>
    );
  } else {
    return (
      <ScrollView>
        <SafeAreaView style={screenStyles.container}>
          <Text>Home Screen!</Text>
          <StatusBar style="auto" />
          <Button
            mode="contained"
            onPress={() =>
              selectImages()
                .then(() =>
                  onImagesSelected()
                    .then()
                    .catch((e) => console.error(e))
                )
                .catch((e) => console.error(e))
            }>
            Pick an image from camera roll
          </Button>
        </SafeAreaView>
      </ScrollView>
    );
  }
};

export default HomeScreenOld;
