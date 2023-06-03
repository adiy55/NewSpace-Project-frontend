import { View, Dimensions } from "react-native";
import { Avatar, Text } from "react-native-paper";
import React, { useContext, useState } from "react";
import { style } from "../../styles";
import { AxiosContext } from "../../context/AxiosContext";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";

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
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const [isLoading, setLoading] = useState(true);
  const [starsImage, setStarsImage] = useState(null);

  const getStarsImage = async () => {
    try {
      // Get payload to send
      const { image } = route.params;
      const imageMetadata = image?.exif;
      const payload = {
        fov: 60,
        datetime_str: imageMetadata?.DateTimeOriginal,
        latitude: imageMetadata?.GPSLatitude,
        longitude: imageMetadata?.GPSLongitude,
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
          setStarsImage(encBase64);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setStarsImage(null);
      setLoading(false);
    }
  };

  if (isLoading) {
    getStarsImage()
      .then()
      .catch((e) => console.error(e));
    return (
      <View style={style.container}>
        <Avatar.Icon icon="autorenew" style={style.iconOrButton} />
        <Text>Processing image, this may take a few moments...</Text>
      </View>
    );
  } else if (isLoading === false && starsImage === null) {
    return (
      <View style={style.container}>
        <Avatar.Icon icon="exclamation" style={style.iconOrButton} />
        <Text>Could not process image!</Text>
      </View>
    );
  } else {
    const imageUri = `data:image/jpeg;base64,${starsImage}`;
    return (
      <View style={style.container}>
        {starsImage && (
          <ImageZoom
            source={{ uri: imageUri }}
            style={{ width: width, height: height }}
            resizeMode="contain"
          />
        )}
      </View>
    );
  }
};

export default ResultsScreen;
