import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/navigation/Navigator";
import { AxiosProvider } from "./src/context/AxiosContext";

/*
Commands:
npx expo-doctor
npx expo prebuild
npx expo start --tunnel
*/
export default function App() {
  return (
    <AxiosProvider>
      <PaperProvider>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </PaperProvider>
    </AxiosProvider>
  );
}
