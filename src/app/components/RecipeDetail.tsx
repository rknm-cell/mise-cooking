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
  const {
    name,
    servings,
    ingredients,
    instructions,
    storage,
    nutrition,
  } = recipe
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
  function handleIngredients(ingredients: string[]) {
    return ingredients.map((ingredient, index) => {
      return <p key={index}> {ingredient} </p>;
    });
  }
  return (

    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{nutrition}</CardDescription>
        <CardDescription>Servings: {servings}</CardDescription>
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
