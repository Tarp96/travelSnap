import { useState, useEffect, useRef } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import ImageActionButton from "../../components/ImageActionButton";
import React from "react";
import { firebase } from "../../../fbconfig";
import * as FileSystem from "expo-file-system";
import ButtonComponent from "../../components/ButtonComponent";

interface IAddPictureScreen {
  navigation: any;
}

const AddPictureScreen: React.FC<IAddPictureScreen> = ({ navigation }) => {
  const [image, setImage] = useState("");

  const [uploading, setUploading] = useState(false);

  const [showCamera, setShowCamera] = useState(false);
  const [imageDescr, setImageDescr] = useState("");
  //const [type, setType] = useState(CameraType.back);

  const camType = CameraType.back;

  const cameraRef = useRef<Camera | null>();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    setShowCamera(false);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    setShowCamera(true);
    setImage("");
  };

  const takePic = async () => {
    if (cameraRef.current) {
      console.log("Camera is ready");
    }

    let newImage = await cameraRef.current?.takePictureAsync();
    setImage(newImage?.uri);
    setShowCamera(false);
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

      if (image != "") {
        submitPost(imgURL);
        setUploading(false);
        alert("Photo has been successfully uploaded");
        setImage("");
      }
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitPost = async (imageLink: String) => {
    firebase.firestore().collection("posts").add({
      imageurl: imageLink,
      imgDescr: imageDescr,
    });
  };

  return (
    <>
      {showCamera && (
        <View className="flex-1 justify-center">
          <Camera type={camType} ref={cameraRef} className="flex-1">
            <View className="flex-1 flex-row">
              <TouchableOpacity
                className="flex-1 self-end justify-center items-center"
                onPress={takePic}
              >
                <Text className="m-8 bg-white font-bold rounded-full py-2 px-4">
                  Take Picture
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )}

      <View className="flex flex-row justify-center align-center">
        <View className="flex flex-row space-x-4 mt-8">
          <View>
            <ImageActionButton
              cameraActionFunction={pickImage}
              iconName="image-outline"
              buttonLabel="Pick from Gallery"
              styling="bg-cyan-400"
            />
          </View>

          <View>
            <ImageActionButton
              cameraActionFunction={openCamera}
              iconName="camera-outline"
              buttonLabel="Take Photo"
              styling="bg-green-400"
            />
          </View>
        </View>
      </View>

      {image && (
        <View className="mt-8 flex items-center">
          <Image
            source={{ uri: image }}
            style={{ width: 350, height: 350 }}
            className="rounded"
          />
        </View>
      )}

      {!uploading ? (
        <View>
          <View className="mt-4 items-center w-100">
            <TextInput
              className="border-2 bg-white rounded-md w-80 p-2"
              placeholder="Image description"
              onChangeText={(val) => setImageDescr(val)}
            />
          </View>
          <View className="items-center">
            <ButtonComponent
              buttonLabel="Upload Image"
              buttonAction={uploadImage}
              styling="mt-4 items-center bg-blue-500 p-4 w-[150px] rounded-full"
              textStyling="text-white font-bold text-lg"
            />
          </View>
        </View>
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}
    </>
  );
};

export default AddPictureScreen;
