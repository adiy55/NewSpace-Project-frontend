import { SafeAreaView, Dimensions } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import React, { useContext, useState } from "react";
import { style } from "../../styles";
import { AxiosContext } from "../../context/AxiosContext";
import { StatusBar } from "expo-status-bar";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

// ImageZoom: https://www.npmjs.com/package/@likashefqet/react-native-image-zoom

const isPayloadValid = (payloadDict) => {
  let isValid = true;
  for (const key in payloadDict) {
    if (!payloadDict[key]) {
      // Value is undefined!
      isValid = false;
      console.log(key, payloadDict[key]);
      break;
    }
  }
  return isValid;
};

const ResultsScreen = ({ route, navigation }) => {
  const { publicAxios } = useContext(AxiosContext);
  const { width, height } = Dimensions.get("window");

  const [isLoading, setLoading] = useState(true);
  const [starsImage, setStarsImage] = useState(null);

  const getStarsImage = async () => {
    try {
      // Get payload to send
      const { imageMetadata } = route.params;
      console.log(imageMetadata);
      const payload = {
        fov: 60,
        datetime_str: imageMetadata?.DateTimeOriginal,
        latitude: imageMetadata?.GPSLatitude || imageMetadata?.latitude,
        longitude: imageMetadata?.GPSLongitude || imageMetadata?.longitude,
        gps_img_direction:
          imageMetadata?.GPSImgDirection || imageMetadata?.gps_img_direction,
          altitude: imageMetadata?.GPSAltitude || imageMetadata?.altitude,
      };
      console.log(payload);
      // Check if payload data is complete
      const isValid = isPayloadValid(payload);
      if (isValid) {
        // Send data to backend
        const response = await publicAxios.post("/stars", payload);
        if (response.status === 200) {
          console.log("SUCCESS!");
          const { encBase64 } = response.data;
          return encBase64;
        }
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveImageToLibrary = async (base64Image) => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        const filename = "image.jpg";
        const fileUri = FileSystem.documentDirectory + filename;
        await FileSystem.writeAsStringAsync(fileUri, base64Image, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // Save image to media library
        await MediaLibrary.saveToLibraryAsync(fileUri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render proper component
  if (isLoading) {
    console.log("HERE1!");
    getStarsImage()
      .then((encodedImage) => {
        setLoading(false);
        setStarsImage(encodedImage);
      })
      .catch((e) => {
        console.error(e);
        setStarsImage(null);
        setLoading(false);
      });
    return (
      <SafeAreaView style={style.container}>
        <StatusBar style="auto" />
        <Avatar.Icon icon="autorenew" style={style.iconOrButton} />
        <Text>Processing image, this may take a few moments...</Text>
      </SafeAreaView>
    );
  } else if (isLoading === false && !starsImage) {
    console.log("HERE2!");
    return (
      <SafeAreaView style={style.container}>
        <StatusBar style="auto" />
        <Avatar.Icon icon="exclamation" style={style.iconOrButton} />
        <Text>Could not process image!</Text>
      </SafeAreaView>
    );
  } else {
    console.log("HERE3!");
    const imageUri = `data:image/jpeg;base64,${starsImage}`;
    return (
      <SafeAreaView style={{ flex: 1, width: "100%", height: "100%" }}>
        <StatusBar style="auto" />
        {starsImage && (
          <ImageZoom
            source={{ uri: imageUri }}
            resizeMethod="auto"
            resizeMode="contain"
          />
        )}
        <Button
          onPress={() =>
            saveImageToLibrary(starsImage)
              .then()
              .catch((e) => console.error(e))
          }>
          Save Image
        </Button>
      </SafeAreaView>
    );
  }
};

export default ResultsScreen;
