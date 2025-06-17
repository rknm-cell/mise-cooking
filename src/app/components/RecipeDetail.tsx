import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { RecipeObject } from "~/server/db/schema";

interface RecipeDetails {
  name: string;
  time: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  storage: string;
  nutrition: string[];
}

const RecipeDetail = ({ recipe }: { recipe: RecipeObject }) => {
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
    // <div>
    //   <div id="title-card">{name}</div>
    //   <div>Time to cook: {time}</div>
    //   <div>Servings: {servings}</div>
    //   <div>{handleInstructions(instructions)}</div>
    //   <div>{handleIngredients(ingredients)} </div>
    //   <div>Storage: {storage}</div>
    //   <div>Nutrition: {nutrition}</div>
    // </div>

    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{nutrition}</CardDescription>
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
