import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Recipe } from "~/server/db/schema";

export const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const { name, nutrition } = recipe;

  //add a router for id of recipe to redirect to recipedetails page

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{nutrition.join(", ")}</CardDescription>
      </CardHeader>
    </Card>
  );
};
