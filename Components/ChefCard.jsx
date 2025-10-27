import {
    Text,
    View,
    StyleSheet
} from "react-native";

export default function ChefCard(){
    return (
        <View style={styles.card}>
            <Text>Chef Card</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "90%",
        height: 100,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
    },
});