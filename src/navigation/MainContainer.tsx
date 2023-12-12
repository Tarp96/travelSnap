import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import PictureFeed from "./screens/PictureFeed";
import AddPictureScreen from "./screens/AddPictureScreen";

const pictureFeed = "Your Pictures";
const addPhoto = "Upload";

const Tab = createBottomTabNavigator();

const MainContainer = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={pictureFeed}
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
    </NavigationContainer>
  );
};

export default MainContainer;
