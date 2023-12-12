import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AddPictureScreen from "./AddPictureScreen";

interface IPictureFeed {
  navigation: any;
}

const PictureFeed: React.FC<IPictureFeed> = ({ navigation }) => {
  return (
    <View>
      <Text className="font-2xl">Picture Feed</Text>
      <TouchableOpacity>
        <Text>Go to Details</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PictureFeed;
