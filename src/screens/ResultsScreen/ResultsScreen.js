import { View, Image, Dimensions } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import React, { useContext } from "react";
import { style } from "../../styles";
import { AxiosContext } from "../../context/AxiosContext";

const ResultsScreen = ({ route, navigation }) => {
  const { publicAxios } = useContext(AxiosContext);

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const { image } = route.params;
  const base64Image = image?.base64;
  const imageMetadata = image?.exif;
  console.log(imageMetadata);
  const payload = {
    fov: 60,
    datetime_str: imageMetadata?.DateTimeOriginal,
    latitude: imageMetadata?.GPSLatitude,
    longitude: imageMetadata?.GPSLongitude,
  };
  console.log(payload);

  return (
    <View style={style.container}>
      {base64Image && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${base64Image}` }}
          style={{ width: width, height: height }}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

export default ResultsScreen;
