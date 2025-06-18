import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface RecipeDetails {
  name: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  storage: string;
  nutrition: string[];
}

const RecipeDetail = ({ recipe }: { recipe: RecipeDetails }) => {
  const { name, servings, ingredients, instructions, storage, nutrition } =
    recipe;
  console.log(nutrition);
  function handleInstructions(instructions: string[]) {
    return instructions.map((instruction, index) => {
      return (
        <div key={index}>
          {index + 1}. {instruction}
        </div>
      );
    });
  }
  function handleNutrition(nutrients: string[]) {
    return nutrients.map((nutrient, index) => {
      return <p key={index}> {nutrient} </p>;
    });
  }
  function handleIngredients(ingredients: string[]) {
    return ingredients.map((ingredient, index) => {
      return <p key={index}> {ingredient} </p>;
    });
  }
  return (
    <Card className="w-175 bg-[#2aa68b]">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="text-zinc-700">{handleNutrition(nutrition)}</CardDescription>
        <CardDescription className="text-zinc-700">Servings: {servings}</CardDescription>
      </CardHeader>
      <CardContent>{handleIngredients(ingredients)}</CardContent>
      <CardContent>{handleInstructions(instructions)}</CardContent>
      <CardFooter>
        <p>{storage}</p>
      </CardFooter>
    </Card>
  );
};
export default RecipeDetail;
