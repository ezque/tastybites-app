import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../Components/Header";
import TabsButton from "../Components/TabsButton";
import Home from "./Home";
import Recipe from "./Recipe";
import Chef from "./Chef";
import Notification from "./Notification";
import Menu from "./Menu";
import ChefProfile from "./ChefProfile";
import RecipeDetails from "./RecipeDetails";
import BuyForm from "./BuyForm";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("home");
    const [selectedChef, setSelectedChef] = useState(null);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setSearchQuery("");
    }, [activeTab]);

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return (
                    <Home
                        searchQuery={searchQuery}
                        onViewRecipe={(recipe) => {
                            setSelectedRecipe(recipe);
                            setActiveTab("recipeDetails");
                        }}
                    />
                );

            case "recipe":
                return (
                    <Recipe
                        searchQuery={searchQuery}
                        onViewRecipe={(recipe) => {
                            setSelectedRecipe(recipe);
                            setActiveTab("recipeDetails");
                        }}
                    />
                );

            case "chef":
                return (
                    <Chef
                        searchQuery={searchQuery}
                        onSelectChef={(chef) => {
                            setSelectedChef(chef);
                            setActiveTab("chefProfile");
                        }}
                    />
                );

            case "chefProfile":
                return (
                    <ChefProfile
                        chef={selectedChef}
                        onViewRecipe={(recipe) => {
                            setSelectedRecipe(recipe);
                            setActiveTab("recipeDetails");
                        }}
                    />
                );

            case "recipeDetails":
                return (
                    <RecipeDetails
                        recipe={selectedRecipe}
                        onBack={() => setActiveTab("home")}
                        onBuyRecipe={(recipe) => {
                            setSelectedRecipe(recipe);
                            setActiveTab("buyForm");
                        }}
                    />
                );

            case "notification":
                return <Notification />;

            case "menu":
                return <Menu onTabChange={setActiveTab}/>;
            case "buyForm":
                return (
                    <BuyForm
                        recipe={selectedRecipe}
                        onBack={() => setActiveTab("recipeDetails")}
                    />
                );
            case "profile":
                return <Profile />;
            case "changePassword":
                return <ChangePassword />

            default:
                return <Home />;
        }
    };

    return (
        <View style={styles.dashboardContainer}>
            <Header
                activeTab={activeTab}
                onSearchChange={setSearchQuery}
            />

            <TabsButton onTabchange={setActiveTab} activeTab={activeTab} />

            {renderContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    dashboardContainer: {
        flex: 1,
        backgroundColor: "white",
    },
});
