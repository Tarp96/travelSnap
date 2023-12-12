import { useState, useEffect, useRef } from "react";
import { Image, View, Text, TouchableOpacity, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import ImageActionButton from "../../components/ImageActionButton";
import React from "react";
import { firebase } from "../../../fbconfig";
import * as FileSystem from "expo-file-system";
import { useHeaderHeight } from "@react-navigation/elements";

interface IAddPictureScreen {
  navigation: any;
}

const AddPictureScreen: React.FC<IAddPictureScreen> = ({ navigation }) => {
  const headerHeight = useHeaderHeight();

  const [image, setImage] = useState(
    "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
  );

  const [uploading, setUploading] = useState(false);
  const [cameraPerm, setCameraPerm] = useState();
  const [showCamera, setShowCamera] = useState(false);
  const [imageDescr, setImageDescr] = useState("");
  const [type, setType] = useState(CameraType.back);

  const cameraRef = useRef<Camera | null>();

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

      submitPost(imgURL);
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
      imgDescr: imageDescr,
    });
  };

  return (
    <>
      {showCamera && (
        <View className="flex-1 justify-center">
          <Camera type={type} ref={cameraRef} className="flex-1">
            <View className="flex-1 flex-row m2">
              <TouchableOpacity
                className="flex-1 justify-center items-center"
                onPress={takePic}
              >
                <Text className="text-white bg-white rounded">T</Text>
              </TouchableOpacity>
            </View>
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
              bgColor={"bg-cyan-400"}
            />
          </View>

          <View>
            <ImageActionButton
              cameraActionFunction={openCamera}
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

      <View className="mt-4 items-center">
        <TextInput
          className="border-2 bg-white rounded-md w-80"
          placeholder="Image description"
          onChangeText={(val) => setImageDescr(val)}
        />
      </View>

      <View className="items-center">
        <TouchableOpacity
          onPress={uploadImage}
          className="mt-4 items-center border-2 bg-blue-500 p-4 w-[150px] rounded"
        >
          <Text className="text-white">Upload Image</Text>
        </TouchableOpacity>
      </View>

      <Text>{imageDescr}</Text>
    </>
  );
};

export default AddPictureScreen;
