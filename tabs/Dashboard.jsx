import {
    Text,
    View,
    StyleSheet
} from "react-native";
import Header from "../Components/Header";
import TabsButton from "../Components/TabsButton";
import Home from "./Home";
import Recipe from "./Recipe";
import Chef from "./Chef";
import Notification from "./Notification";
import Menu from "./Menu";

import {useState} from "react";
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("home")

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return <Home />
            case "recipe":
                return <Recipe />
            case "chef":
                return <Chef />
            case "notification":
                return <Notification />
            case "menu":
                return <Menu />
        }
    }
    return (
        <View style={styles.dashboardContainer}>
            <Header />
            <TabsButton onTabchange={setActiveTab} activeTab={activeTab}/>
            {renderContent()}

        </View>

    )
}
const styles = StyleSheet.create({
    dashboardContainer : {
        flex: 1,
        backgroundColor: "white",
    }
});