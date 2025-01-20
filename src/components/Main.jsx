import React from "react"
import Recipe from "./Recipe.jsx"
import IngredientsList from "./IngredientsList.jsx"
import { getRecipeFromGemini, getRecipeFromMistral } from "../ai"

export default function Main() {

    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient").trim(); // Trim whitespace

        // Validate ingredient
        if (!isValidIngredient(newIngredient)) {
            alert("Please enter a valid ingredient name (letters and spaces only).");
            return;
        }

        // Check for duplicates
        if (ingredients.includes(newIngredient)) {
            alert("This ingredient is already in the list.");
            return;
        }
        // Add ingredient to the list
        setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    }

    // Function to validate ingredient names
    function isValidIngredient(ingredient) {
        // Allow only letters and spaces (no numbers or special characters)
        const regex = /^[A-Za-z\s]+$/;
        return regex.test(ingredient);
    }

    // function addIngredient(formData) {
    //     const newIngredient = formData.get("ingredient")
    //     setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    // }

    async function showRecipe() {
        try {
            console.log("Generating recipe..."); // Debugging
            const aiRecipeMkdown = await getRecipeFromGemini(ingredients);
            setRecipe(aiRecipeMkdown);
        } catch (err) {
            console.error("Error in showRecipe:", err.message); // Debugging
            setRecipe("Sorry, I couldn't generate a recipe. Please try again.");
        }
    }


    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>
            {ingredients.length ? <IngredientsList ingredients={ingredients} showRecipe={showRecipe} /> : null}
            {recipe ? <Recipe recipe={recipe} /> : null}
        </main>
    )
}