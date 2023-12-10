import * as React from "react";
import {View, Text} from "react-native";

interface IPictureFeed {
    navigation: any
}

const PictureFeed:React.FC<IPictureFeed> = ({navigation}) => {
    return (
        <View>
            <Text className="font-2xl">Picture Feed</Text>
        </View>
    )
}


export default PictureFeed;