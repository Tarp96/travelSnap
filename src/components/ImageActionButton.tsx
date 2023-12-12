import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface IImageActionButton {
  cameraActionFunction: () => void;
  iconName: String;
  buttonLabel: String;
  bgColor: String;
}

const ImageActionButton: React.FC<IImageActionButton> = ({
  cameraActionFunction,
  iconName,
  buttonLabel,
  bgColor,
}) => {
  return (
    <TouchableOpacity
      onPress={cameraActionFunction}
      className={`flex items-center rounded p-4 rounded-lg ${bgColor}`}
    >
      <Text className="text-lg">{buttonLabel}</Text>
      <Ionicons name={iconName} size={32} />
    </TouchableOpacity>
  );
};

export default ImageActionButton;
