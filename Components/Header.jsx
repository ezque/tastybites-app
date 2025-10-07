import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput
} from "react-native";
// Import MaterialIcons if you want to add a search icon
import { MaterialIcons} from "@expo/vector-icons";

export default function Header() {
    return (
        <View style={styles.headerContainer}>
            <Image source={require("../assets/logo/tastybites second logo.png")} style={styles.headerLogo}/>
            <View style={styles.searchContainer}>
                {/* 🔑 KEY CHANGE: Use placeholderTextColor
                    I'm suggesting a lighter color like #A0A0A0 for the placeholder
                */}
                <TextInput
                    placeholder={"Search"}
                    style={styles.searchBar}
                    placeholderTextColor={"#A0A0A0"} // 👈 Add this line
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 100,
        backgroundColor: "white",
        paddingTop: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        padding: 10
    },
    headerLogo: {
        width: 120,
        height: 40,
    },
    searchContainer: {
        width: 150,
        height: 35,
    },
    searchBar: {
        width: "100%",
        height: "100%",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 20,
        paddingHorizontal: 15,
    }
});