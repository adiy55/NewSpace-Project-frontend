import { SafeAreaView } from "react-native";
import { Avatar, Button, Text, Banner } from "react-native-paper";
import React, { useContext, useState } from "react";
import { style } from "../../styles";
import { AxiosContext } from "../../context/AxiosContext";
import { StatusBar } from "expo-status-bar";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";

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

  const [isLoading, setLoading] = useState(true);
  const [starsImage, setStarsImage] = useState(null);
  const [visible, setVisible] = useState(false);
  // Get payload to send
  const { imageMetadata, isFromCamera } = route.params;
  let metadata = { ...imageMetadata };
  console.log(metadata);
  const getStarsImage = async () => {
    try {
      if (isFromCamera) {
        // Get location data
        let imgDirection = await Location.getHeadingAsync();
        let location = await Location.getCurrentPositionAsync();
        console.log(location);
        console.log("HERE", imgDirection);
        metadata = {
          ...metadata,
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          gps_img_direction: imgDirection.trueHeading,
          altitude: location.coords.altitude,
        };
      }
      const payload = {
        fov: 60,
        datetime_str: metadata?.DateTimeOriginal,
        latitude: metadata?.GPSLatitude || metadata?.latitude,
        longitude: metadata?.GPSLongitude || metadata?.longitude,
        gps_img_direction:
          metadata?.GPSImgDirection || metadata?.gps_img_direction,
        altitude: metadata?.GPSAltitude || metadata?.altitude,
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
        <Banner
          visible={visible}
          actions={[{ label: "OK", onPress: () => setVisible(false) }]}>
          Image saved successfully!
        </Banner>
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
              .then(() => setVisible(true))
              .catch((e) => console.error(e))
          }>
          Save Image
        </Button>
      </SafeAreaView>
    );
  }
};

export default ResultsScreen;
