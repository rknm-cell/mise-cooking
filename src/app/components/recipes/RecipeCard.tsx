import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"


interface RecipeCard {
  name: string;
  nutrition: string[];
}

export const RecipeCard = ({ recipe }: { recipe: RecipeCard }) => {
    const {name, nutrition } = recipe
    return (

        
        <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{nutrition}</CardDescription>
      </CardHeader>
    </Card>
)
}