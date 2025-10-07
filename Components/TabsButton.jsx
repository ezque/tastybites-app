import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";

export default function TabsButton({ onTabchange, activeTab }) {
    return (
        <View style={styles.TabsContainer}>
            <TouchableOpacity
                style={[styles.buttons, activeTab === "home" && styles.activeButton]}
                onPress={() => onTabchange("home")}
            >
                <Image source={require("../assets/icon/home.png")} style={styles.buttonIcon}/>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.buttons, activeTab === "recipe" && styles.activeButton]}
                onPress={() => onTabchange("recipe")}
            >
                <Image source={require("../assets/icon/recipes.png")} style={styles.buttonIcon}/>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.buttons, activeTab === "chef" && styles.activeButton]}
                onPress={() => onTabchange("chef")}
            >
                <Image source={require("../assets/icon/chef.png")} style={styles.buttonIcon}/>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.buttons, activeTab === "notification" && styles.activeButton]}
                onPress={() => onTabchange("notification")}
            >
                <Image source={require("../assets/icon/notifications.png")} style={styles.buttonIcon}/>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.buttons, activeTab === "menu" && styles.activeButton]}
                onPress={() => onTabchange("menu")}
            >
                <Image source={require("../assets/icon/menu_1.png")} style={styles.buttonIcon}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    TabsContainer: {
        width: "100%",
        height: 55,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    buttons: {
        width: 50,
        height: "90%",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderBottomWidth: 0,
        borderBottomColor: "transparent",
    },
    activeButton: {
        borderBottomWidth: 3,
        borderBottomColor: "blue",
    },
    buttonIcon: {
        width: "100%",
        height: "100%"
    }
});
