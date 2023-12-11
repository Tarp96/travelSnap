import { useState, useEffect, useRef } from "react";
import { Image, View, Platform, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageActionButton from "../../components/ImageActionButton";
import React from "react";
import { firebase } from "../../../fbconfig";
import * as FileSystem from "expo-file-system";

interface IAddPictureScreen {
  navigation: any;
}

const AddPictureScreen: React.FC<IAddPictureScreen> = ({ navigation }) => {
  const [image, setImage] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [cameraPerm, setCameraPerm] = useState();
  const [showCamera, setShowCamera] = useState(false);

  let cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePic = () => {
    setShowCamera(true);
  };

  // Upload files to FB

  const uploadImage = async () => {
    setUploading(true);

    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
          resolve(xhr.response);
        };

        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };

        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf("/") + 1);

      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);
      const imgURL = await ref.getDownloadURL();
      console.log(imgURL);

      setUploading(false);
      alert("Photo has been successfully uploaded");
      setImage("");
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitPost = async (imageLink: String) => {
    firebase.firestore().collection("posts").add({
      imageurl: imageLink,
      imgDescr: imageDescription,
    });
  };

  return (
    <>
      {showCamera && (
        <View>
          <Camera ref={cameraRef}>
            <TouchableOpacity className="bg-white">
              <Text>Take Photo</Text>
            </TouchableOpacity>
          </Camera>
        </View>
      )}

      <View className="flex flex-row justify-center align-center">
        <View className="flex flex-row space-x-4 mt-8">
          <View className="bg-cyan-400">
            <ImageActionButton
              cameraActionFunction={pickImage}
              iconName="image-outline"
              buttonLabel="Pick from Gallery"
              bgColor={"bg-cyan-500"}
            />
          </View>

          <View>
            <ImageActionButton
              cameraActionFunction={takePic}
              iconName="camera-outline"
              buttonLabel="Take Photo"
              bgColor={"bg-green-400"}
            />
          </View>
        </View>
      </View>

      {image && (
        <View className="mt-8 flex items-center">
          <Image
            source={{ uri: image }}
            style={{ width: 300, height: 300 }}
            className="rounded"
          />
        </View>
      )}

      <View className="items-center">
        <TouchableOpacity
          onPress={uploadImage}
          className="mt-4 items-center border-2 bg-blue-500 p-4 w-[150px] rounded"
        >
          <Text className="text-white">Upload Image</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default AddPictureScreen;
