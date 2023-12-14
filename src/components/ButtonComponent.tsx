import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface IButtonComponent {
  buttonLabel: string;
  buttonAction: () => void;
  styling: String;
  textStyling: String;
}

const ButtonComponent: React.FC<IButtonComponent> = ({
  buttonLabel,
  buttonAction,
  styling,
  textStyling,
}) => {
  return (
    <TouchableOpacity onPress={buttonAction} className={`${styling}`}>
      <Text className={`${textStyling}`}>{buttonLabel}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComponent;
