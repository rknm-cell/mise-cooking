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
  description: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  storage: string;
  nutrition: string[];
  totalTime: string;
}

const RecipeDetail = ({ recipe }: { recipe: RecipeDetails }) => {
  const { name, description, servings, ingredients, instructions, storage, nutrition, totalTime } =
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
    <Card className="w-full sm:w-1/2 lg:w-2/3 xl:w-1 m-2 sm:m-4 hover:shadow-lg transition-shadow">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl line-clamp-2">{name}</CardTitle>
        <CardDescription className="text-sm sm:text-base line-clamp-3">{description}</CardDescription>
        <CardDescription className="text-sm sm:text-base line-clamp-3">{handleNutrition(nutrition)}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 text-sm sm:text-base">
          <p><strong>Time:</strong> {totalTime}</p>
          <p><strong>Servings:</strong> {servings}</p>
        </div>
      </CardContent>
      <CardContent>{handleIngredients(ingredients)}</CardContent>
      <CardContent>{handleInstructions(instructions)}</CardContent>
      <CardFooter>
        <p>{storage}</p>
      </CardFooter>
    </Card>
  );
};
export default RecipeDetail;
