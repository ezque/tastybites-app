import {
    View,
    StyleSheet,
} from "react-native";
import ChefCard from "../Components/ChefCard";
export default function Chef(){

    return (
        <View style={styles.container}>
            <ChefCard />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column"
    }
})