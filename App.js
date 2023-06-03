import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/navigation/Navigator";
import { AxiosProvider } from "./src/context/AxiosContext";

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
