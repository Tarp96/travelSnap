import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";

import PictureFeed from "./screens/PictureFeed";
import AddPictureScreen from "./screens/AddPictureScreen";
import SplashScreen from "./screens/SplashScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const pictureFeed = "Your Pictures";
const addPhoto = "Upload";

function Home() {
  return (
    <Tab.Navigator
      initialRouteName={PictureFeed}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: String;
          let rn = route.name;

          if (rn === pictureFeed) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === addPhoto) {
            iconName = focused ? "list" : "list-outline";
          }

          return <Ionicons size={size} name={iconName} color={color} />;
        },
      })}
    >
      <Tab.Screen name={pictureFeed} component={PictureFeed} />
      <Tab.Screen name={addPhoto} component={AddPictureScreen} />
    </Tab.Navigator>
  );
}

const MainContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator options={{ headerShown: false }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainContainer;
