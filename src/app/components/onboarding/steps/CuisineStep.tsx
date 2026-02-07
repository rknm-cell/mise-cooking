"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

type CuisineStepProps = {
  favoriteCuisines: string[];
  spiceTolerance: string;
  onUpdate: (data: { favoriteCuisines?: string[]; spiceTolerance?: string }) => void;
};

const CUISINE_OPTIONS = [
  { value: "italian", label: "Italian", emoji: "🍝" },
  { value: "mexican", label: "Mexican", emoji: "🌮" },
  { value: "chinese", label: "Chinese", emoji: "🥡" },
  { value: "japanese", label: "Japanese", emoji: "🍱" },
  { value: "indian", label: "Indian", emoji: "🍛" },
  { value: "thai", label: "Thai", emoji: "🍜" },
  { value: "mediterranean", label: "Mediterranean", emoji: "🥗" },
  { value: "french", label: "French", emoji: "🥐" },
  { value: "american", label: "American", emoji: "🍔" },
  { value: "korean", label: "Korean", emoji: "🍲" },
];

const SPICE_LEVELS = [
  { value: "none", label: "No Spice", description: "Completely mild" },
  { value: "mild", label: "Mild", description: "Just a hint of warmth" },
  { value: "medium", label: "Medium", description: "Noticeable but not overwhelming" },
  { value: "hot", label: "Hot", description: "Bring on the heat!" },
  { value: "extra-hot", label: "Extra Hot", description: "Fire in the hole!" },
];

export function CuisineStep({ favoriteCuisines, spiceTolerance, onUpdate }: CuisineStepProps) {
  const handleCuisineToggle = (value: string) => {
    const updated = favoriteCuisines.includes(value)
      ? favoriteCuisines.filter((item) => item !== value)
      : [...favoriteCuisines, value];
    onUpdate({ favoriteCuisines: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Favorite Cuisines</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Select all that you enjoy (we'll prioritize these in your recipe suggestions)
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {CUISINE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`cuisine-${option.value}`}
                checked={favoriteCuisines.includes(option.value)}
                onCheckedChange={() => handleCuisineToggle(option.value)}
              />
              <Label
                htmlFor={`cuisine-${option.value}`}
                className="cursor-pointer text-sm font-normal"
              >
                <span className="mr-2">{option.emoji}</span>
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Spice Tolerance</h3>
        <RadioGroup value={spiceTolerance} onValueChange={(value) => onUpdate({ spiceTolerance: value })}>
          <div className="space-y-3">
            {SPICE_LEVELS.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <RadioGroupItem value={level.value} id={`spice-${level.value}`} />
                <Label
                  htmlFor={`spice-${level.value}`}
                  className="cursor-pointer font-normal"
                >
                  <div>
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm text-muted-foreground">{level.description}</div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
