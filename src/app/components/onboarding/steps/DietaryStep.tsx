"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { X } from "lucide-react";

type DietaryStepProps = {
  dietaryRestrictions: string[];
  allergies: string[];
  onUpdate: (data: { dietaryRestrictions?: string[]; allergies?: string[] }) => void;
};

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
  { value: "nut-free", label: "Nut-Free" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
];

export function DietaryStep({ dietaryRestrictions, allergies, onUpdate }: DietaryStepProps) {
  const [allergyInput, setAllergyInput] = useState("");

  const handleDietaryToggle = (value: string) => {
    const updated = dietaryRestrictions.includes(value)
      ? dietaryRestrictions.filter((item) => item !== value)
      : [...dietaryRestrictions, value];
    onUpdate({ dietaryRestrictions: updated });
  };

  const handleAddAllergy = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && allergyInput.trim()) {
      e.preventDefault();
      if (!allergies.includes(allergyInput.trim())) {
        onUpdate({ allergies: [...allergies, allergyInput.trim()] });
      }
      setAllergyInput("");
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    onUpdate({ allergies: allergies.filter((item) => item !== allergy) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Dietary Restrictions</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {DIETARY_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={dietaryRestrictions.includes(option.value)}
                onCheckedChange={() => handleDietaryToggle(option.value)}
              />
              <Label
                htmlFor={option.value}
                className="cursor-pointer text-sm font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Food Allergies</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Type an allergy and press Enter to add it
        </p>
        <Input
          type="text"
          placeholder="e.g., peanuts, shellfish, eggs..."
          value={allergyInput}
          onChange={(e) => setAllergyInput(e.target.value)}
          onKeyDown={handleAddAllergy}
        />

        {allergies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {allergies.map((allergy) => (
              <Badge key={allergy} variant="secondary" className="gap-1">
                {allergy}
                <button
                  onClick={() => handleRemoveAllergy(allergy)}
                  className="ml-1 rounded-full hover:bg-muted"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
