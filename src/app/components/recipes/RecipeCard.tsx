import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Recipe } from "~/server/db/schema";

export const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const { name, nutrition, description } = recipe;

  //add a router for id of recipe to redirect to recipedetails page

  return (
    <Card className="w-1/2 m-4">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardDescription>{nutrition.join(", ")}</CardDescription>
      </CardHeader>
    </Card>
  );
};
