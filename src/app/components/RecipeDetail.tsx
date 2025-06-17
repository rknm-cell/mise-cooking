import React from "react";

interface RecipeDetails {
    name: string;
    time: string;
    servings: number;
    ingredients: string[];
    instructions: string[];
    storage: string;
    nutrition: string[];
  };


const RecipeDetail = ({
  recipe,
}: {
  recipe: string
}) => {
  const { name, time, servings, ingredients, instructions, storage, nutrition } = JSON.parse(
    recipe,
  ) as RecipeDetails
  console.log(nutrition)
  function handleInstructions(instructions: string[]) {
    return instructions.map((instruction, index) => {
      return (
        <div key={index}>
          {index + 1}.  {instruction}
        </div>
      );
    });
  }
  function handleIngredients(ingredients: string[]){
    return ingredients.map((ingredient, index) => {
      return (
        <div key={index}> {ingredient} </div>
      )
    })
  }
  return (
    <div>
      <div id="title-card">{name}</div>
      <div>Time to cook: {time}</div>
      <div>Servings: {servings}</div>
      <div>{handleInstructions(instructions)}</div>
      <div>{handleIngredients(ingredients)} </div>
      <div>Storage: {storage}</div>
      <div>Nutrition: {nutrition}</div>
    </div>
  );
};
export default RecipeDetail;
