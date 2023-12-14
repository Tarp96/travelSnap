import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import * as React from "react";
import ButtonComponent from "../../components/ButtonComponent";

interface ISplashScreen {
  navigation: any;
}

const SplashScreen: React.FC<ISplashScreen> = ({ navigation }) => {
  const navigateToHomePage = () => {
    navigation.navigate("Home");
  };

  return (
    <>
      <ImageBackground
        source={require("../../../assets/splashwallpaper.png")}
        className="flex-1 items-center justify-end"
      >
        <ButtonComponent
          buttonLabel="Continue"
          buttonAction={navigateToHomePage}
          styling={"mb-10 bg-green-600 rounded-full px-[50] py-[10]"}
          textStyling={"text-2xl text-white tracking-wide"}
        />
      </ImageBackground>
    </>
  );
};

export default SplashScreen;
