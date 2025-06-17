'use client';

import { useState } from 'react';
import RecipeDetail from '../components/RecipeDetail';
import type { RecipeObject } from '~/server/db/schema';

export default function Page() {
  const [generation, setGeneration] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateRecipe = (generation) => {
    return <RecipeDetail recipe={generation} />
  }

  return (
    <div>
      <div
        onClick={async () => {
          setIsLoading(true);

          await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
              prompt: 'chicken recipe',
            }),
          }).then(response => {
            response.json().then(json => {
              setGeneration(json);
              setIsLoading(false);
            });
          });
        }}
      >
        Generate
      </div>

      {isLoading ? 'Loading...' : <pre>{JSON.stringify(generation)}</pre>}
      {generation ? handleGenerateRecipe(generation) : <></>}
    </div>
  );
}