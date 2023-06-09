import React, { useState } from "react";
import { ScrollView, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { style } from "../../styles";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Button, Card, Dialog, Paragraph, Portal } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import MilkyWay from "../../../assets/MilkyWay.jpg";

/* 
Useful example on how to handle permissions for camera and media
https://www.kindacode.com/article/image-picker-in-react-native/
*/
const HomeScreen = ({ navigation }) => {
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
        setVisible(false);
        console.log(selectedImage?.exif);
        navigation.navigate("Results", { imageMetadata: selectedImage?.exif });
      }
    } catch (error) {
      console.error("selectImageFromLibrary", error);
    }
  };

  const captureImage = async () => {
    try {
      // Get permissions from user
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your camera!");
        return;
      }
      let locationPermission =
        await Location.requestForegroundPermissionsAsync();
      if (locationPermission.granted === false) {
        alert("Permission to access location was denied!");
        return;
      }
      // Got permissions - can open camera!
      let selectedImage = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        exif: true,
        base64: true,
      });
      if (!selectedImage.cancelled) {
        // Image was taken, get location
        let imgDirection = await Location.getHeadingAsync();
        let location = await Location.getCurrentPositionAsync();
        console.log(location);
        console.log("HERE", imgDirection);
        setVisible(false);
        const imageMetadata = {
          ...selectedImage?.exif,
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          gps_img_direction: imgDirection.trueHeading,
          altitude: location.coords.altitude,
        };
        navigation.navigate("Results", { imageMetadata });
      }
    } catch (error) {
      console.error("captureImage", error);
    }
  };

  return (
    <SafeAreaView style={{ ...style.container, marginTop: 20 }}>
      <ScrollView>
        <StatusBar style="auto" />

        <Card>
          <Card.Title
            title="Star Tracker"
            titleVariant="titleLarge"
            subtitle="Tool for detecting stars in images"
            subtitleVariant="titleMedium"
          />
          <Card.Content>
            <Paragraph>
              This tool computes an image of the sky based on your location. It
              marks planets, stars, and constellations.
            </Paragraph>
          </Card.Content>
          <Card.Cover style={style.cardCover} source={MilkyWay} />
          <Card.Actions style={style.cardActions}>
            <Button mode="contained" onPress={showDialog}>
              Start Tracking!
            </Button>
          </Card.Actions>
        </Card>

        <Portal>
          <Dialog
            visible={isVisible}
            onDismiss={hideDialog}
            style={style.dialogContainer}>
            <Dialog.Icon icon="star" />
            <Dialog.Title>Select Image</Dialog.Title>
            <Dialog.Actions style={style.dialogActions}>
              <Button
                mode="contained"
                onPress={captureImage}
                style={style.iconOrButton}>
                Capture new image
              </Button>
              <Button
                mode="contained"
                onPress={selectImageFromLibrary}
                style={style.iconOrButton}>
                Choose from existing
              </Button>
              <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
