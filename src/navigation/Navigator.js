import React, { useState } from "react";
import { BottomNavigation, Appbar, useTheme } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { createStackNavigator } from "@react-navigation/stack";

// Import Screens
import HomeScreen from "../screens/HomeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ResultsScreen from "../screens/ResultsScreen";

// Home Screen Stack
const CustomNavigationBar = ({ navigation, route, options, back }) => {
  const title = getHeaderTitle(options, route.name);
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

const HomeScreenStack = () => {
  const Stack = createStackNavigator();
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        cardStyle: { backgroundColor: theme.colors.background },
        header: (props) => <CustomNavigationBar {...props} />,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
};

// Save routes to screens
const HomeRoute = HomeScreenStack;
const HistoryRoute = HistoryScreen;

// Bottom Navigation
const BottomNavigationTabs = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "history",
      title: "History",
      focusedIcon: "history",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    history: HistoryRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      labeled={false}
    />
  );
};

const Navigator = () => {
  return BottomNavigationTabs();
};

export default Navigator;
