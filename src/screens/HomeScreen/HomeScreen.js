import React, { useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, SafeAreaView } from "react-native";
import { style } from "../../styles";
import * as ImagePicker from "expo-image-picker";
import { Button, Card, Dialog, Paragraph, Portal } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import MilkyWay from "../../../assets/MilkyWay.jpg";

/* 
Useful example on how to handle permissions for camera and media
https://www.kindacode.com/article/image-picker-in-react-native/
*/
const HomeScreen = ({ navigation }) => {
  const [image, setImage] = useState();
  const [isVisible, setVisible] = useState(false);
  useFocusEffect(React.useCallback(() => {}, []));

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const selectImageFromLibrary = async () => {
    try {
      // Ask the user for the permission to access the media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your photos!");
        return;
      }
      let selectedImage = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        exif: true,
        base64: true,
      });
      if (!selectedImage.cancelled) {
        setImage(selectedImage);
        setVisible(false);
        navigation.navigate("Results", { image: image });
      }
    } catch (error) {
      console.error("selectImageFromLibrary", error);
      setImage();
    }
  };

  const captureImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your camera!");
        return;
      }
      let selectedImage = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        exif: true,
        base64: true,
      });
      if (!selectedImage.cancelled) {
        setImage(selectedImage);
        setVisible(false);
        navigation.navigate("Results", { image: image });
      }
    } catch (error) {
      console.error("captureImage", error);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <Card>
        <Card.Title
          title="Star Tracker"
          titleVariant="titleLarge"
          subtitle="Tool for detecting stars in images"
          subtitleVariant="titleMedium"
        />
        <Card.Content>
          <Paragraph>
            This tool returns an image of the sky based on your location. It
            marks planets, stars, and constellations.
          </Paragraph>
        </Card.Content>
        <Card.Cover style={{ margin: 10 }} source={MilkyWay} />
        <Card.Actions style={{ alignSelf: "center" }}>
          <Button mode="contained" onPress={showDialog}>
            Start Tracking!
          </Button>
        </Card.Actions>
      </Card>

      <Portal>
        <Dialog
          visible={isVisible}
          onDismiss={hideDialog}
          style={{ alignItems: "center" }}>
          <Dialog.Icon icon="star" />
          <Dialog.Title>Select Image</Dialog.Title>
          <Dialog.Actions style={{ flexDirection: "column" }}>
            <Button
              mode="contained"
              onPress={captureImage}
              style={{ marginBottom: 10 }}>
              Capture new image
            </Button>
            <Button
              mode="contained"
              onPress={selectImageFromLibrary}
              style={{ marginBottom: 10 }}>
              Choose from existing
            </Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default HomeScreen;
