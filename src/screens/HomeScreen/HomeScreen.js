import React, { useState } from "react";
import { ScrollView, SafeAreaView, Platform } from "react-native";
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

  let mediaOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    exif: true,
    base64: true,
  };

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
      let selectedImage = await ImagePicker.launchImageLibraryAsync(
        mediaOptions
      );
      if (!selectedImage.cancelled) {
        setVisible(false);
        // console.log(selectedImage?.exif);
        navigation.navigate("Results", {
          imageMetadata: selectedImage?.exif,
          isFromCamera: false,
        });
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
      let selectedImage = await ImagePicker.launchCameraAsync(mediaOptions);
      if (!selectedImage.cancelled) {
        setVisible(false);
        navigation.navigate("Results", {
          imageMetadata: selectedImage?.exif,
          isFromCamera: true,
        });
      }
    } catch (error) {
      console.error("captureImage", error);
    }
  };

  return (
    <SafeAreaView style={{ ...style.container, marginTop: 20 }}>
      <ScrollView>
        <StatusBar style="auto" />

        <Card style={style.cardContainer}>
          <Card.Title
            title="Star Tracker"
            titleVariant="titleLarge"
            subtitle="Tool for detecting stars in images"
            subtitleVariant="titleMedium"
          />
          <Card.Content>
            <Paragraph>
              This tool identifies and highlihts stars and planets.
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
              {Platform.OS !== "web" && (
                <Button
                  mode="contained"
                  onPress={captureImage}
                  style={style.iconOrButton}>
                  Capture new image
                </Button>
              )}
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

        <Card style={style.cardContainer}>
          <Card.Title
            title="Search Stars"
            titleVariant="titleLarge"
            subtitle="Tool for querying stars in a database"
            subtitleVariant="titleMedium"
          />
          <Card.Actions style={style.cardActions}>
            <Button
              mode="text"
              icon="magnify"
              onPress={() => navigation.navigate("Query")}>
              Start Searching!
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
