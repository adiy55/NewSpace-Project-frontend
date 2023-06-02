import { View, Image, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import { style } from "../../styles";

const ResultsScreen = ({ route, navigation }) => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const { image } = route.params;
  const base64Image = image?.base64;
  console.log(base64Image == null);
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
