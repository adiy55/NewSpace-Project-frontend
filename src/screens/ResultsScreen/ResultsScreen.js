import { SafeAreaView, Linking, View } from "react-native";
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
  const [urls, setUrls] = useState([]);
  // Get payload to send
  const { imageMetadata, isFromCamera } = route.params;
  let metadata = { ...imageMetadata };
  // console.log(metadata);

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
      // console.log(payload);
      // Check if payload data is complete
      const isValid = isPayloadValid(payload);
      if (isValid) {
        // Send data to backend
        const response = await publicAxios.post("/stars", payload);
        if (response.status === 200) {
          console.log("SUCCESS!");
          const { encBase64, stars_urls } = response.data;
          return [encBase64, stars_urls];
        }
        return [null, null];
      }
    } catch (error) {
      console.error(error);
    }
  };

  // https://stackoverflow.com/questions/61533273/convert-base64-to-png-and-save-in-the-device-react-native-expo
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
    getStarsImage()
      .then(([encodedImage, urls]) => {
        setLoading(false);
        setStarsImage(encodedImage);
        setUrls(urls);
      })
      .catch((e) => {
        console.error(e);
        setStarsImage(null);
        setLoading(false);
        setUrls([]);
      });
    return (
      <SafeAreaView style={style.container}>
        <StatusBar style="auto" />
        <Avatar.Icon icon="autorenew" style={style.iconOrButton} />
        <Text>Processing image, this may take a few moments...</Text>
      </SafeAreaView>
    );
  } else if (isLoading === false && !starsImage) {
    return (
      <SafeAreaView style={style.container}>
        <StatusBar style="auto" />
        <Avatar.Icon icon="exclamation" style={style.iconOrButton} />
        <Text>Could not process image!</Text>
      </SafeAreaView>
    );
  } else {
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
          <>
            <ImageZoom
              source={{ uri: imageUri }}
              resizeMethod="auto"
              resizeMode="contain"
            />
            <Button
              onPress={() =>
                saveImageToLibrary(starsImage)
                  .then(() => setVisible(true))
                  .catch((e) => console.error(e))
              }>
              Save Image
            </Button>
          </>
        )}
        <View style={style.rowView}>
          {urls &&
            urls.map((obj, index) => {
              const key = Object.keys(obj)[0];
              const value = obj[key];
              return (
                <Button
                  key={index}
                  mode="contained"
                  icon="magnify"
                  style={style.iconOrButton}
                  onPress={() =>
                    Linking.openURL(`${value}`)
                      .then()
                      .catch((e) => console.error(e))
                  }>
                  {`${key}`}
                </Button>
              );
            })}
        </View>
      </SafeAreaView>
    );
  }
};

export default ResultsScreen;
