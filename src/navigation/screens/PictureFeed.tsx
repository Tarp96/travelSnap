import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal } from "react-native";
import { firebase } from "../../../fbconfig";
import React from "react";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import ButtonComponent from "../../components/ButtonComponent";

interface IPictureFeed {
  navigation: any;
}

const PictureFeed: React.FC<IPictureFeed> = ({ navigation }) => {
  const [fireStoreImageList, setFireStoreImageList] = useState([]);
  const todoRef = firebase.firestore().collection("posts");

  const [selectedItemImageURL, setSelectedItemImageURL] = useState();
  const [selectedImageDescription, setSelectedImageDescription] = useState();
  const [showDetails, setShowDetails] = useState(false);

  const getDataFromBackEnd = () => {
    todoRef.onSnapshot((querySnapshot) => {
      const images = [];
      querySnapshot.forEach((doc) => {
        const imageURL = doc.data().imageurl;
        const imageDescription = doc.data().imgDescr;
        images.push({
          id: doc.id,
          imageurl: imageURL,
          imageDescr: imageDescription,
        });
      });
      setFireStoreImageList(images);
    });
  };

  useEffect(() => {
    getDataFromBackEnd();
  }, []);

  const closeModal = () => {
    setShowDetails(false);
  };

  return (
    <View>
      <Modal visible={showDetails} animationType="slide">
        <View
          className="
         items-center"
        >
          <Image
            source={{ uri: selectedItemImageURL }}
            width={350}
            height={350}
            className="mt-4 rounded"
          />
          <Text className="mt-4 text-lg">{selectedImageDescription}</Text>
          <ButtonComponent
            buttonLabel="⬅️ Go Back"
            buttonAction={closeModal}
            styling={"mt-6 p-2 rounded-full bg-red-600 px-4"}
            textStyling={"text-lg text-white font-bold"}
          />
        </View>
      </Modal>

      <View>
        <FlatList
          data={fireStoreImageList}
          numColumns={1}
          renderItem={({ item }) => (
            <View className="items-center">
              <TouchableOpacity
                onPress={() => {
                  setSelectedItemImageURL(item.imageurl);
                  setSelectedImageDescription(item.imageDescr);
                  setShowDetails(true);
                }}
                className="mt-2 "
              >
                <Image
                  source={{
                    uri: item.imageurl,
                  }}
                  width={280}
                  height={280}
                  className="rounded-md"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default PictureFeed;
