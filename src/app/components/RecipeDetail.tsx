import React from "react";

interface RecipeDetails {
    name: string;
    time: string;
    servings: number;
    instructions: string[];
    storage: string;
    nutrition: string;
  };


const RecipeDetail = ({
  recipe,
}: {
  recipe: string
}) => {
  const { name, time, servings, instructions, storage, nutrition } = JSON.parse(
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
  return (
    <div>
      <div id="title-card">{name}</div>
      <div>Time to cook: {time}</div>
      <div>Servings: {servings}</div>
      <div>Instructions: </div>
      <div>{handleInstructions(instructions)}</div>
      <div>Storage: {storage}</div>
      <div>Nutrition: {nutrition}</div>
    </div>
  );
};
export default RecipeDetail;
