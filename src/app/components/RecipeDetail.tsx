import React from "react";

export default function RecipeDetail({ recipe }) {
  return (
    <div>
      <div id="title-card">
        Recipe
        {recipe}
      </div>
    </div>
  );
}
