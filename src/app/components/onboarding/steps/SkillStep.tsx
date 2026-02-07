"use client";

import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";

type SkillStepProps = {
  skillLevel: string;
  maxCookingTime?: number;
  preferredServingSize: number;
  mealPrepFriendly: boolean;
  quickMealsOnly: boolean;
  onUpdate: (data: {
    skillLevel?: string;
    maxCookingTime?: number;
    preferredServingSize?: number;
    mealPrepFriendly?: boolean;
    quickMealsOnly?: boolean;
  }) => void;
};

const SKILL_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "I'm just starting out and prefer simple recipes",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "I'm comfortable with basic techniques and ready to try more",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "I love complex recipes and challenging techniques",
  },
];

export function SkillStep({
  skillLevel,
  maxCookingTime,
  preferredServingSize,
  mealPrepFriendly,
  quickMealsOnly,
  onUpdate,
}: SkillStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Cooking Skill Level</h3>
        <RadioGroup value={skillLevel} onValueChange={(value) => onUpdate({ skillLevel: value })}>
          <div className="space-y-3">
            {SKILL_LEVELS.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <RadioGroupItem value={level.value} id={`skill-${level.value}`} />
                <Label
                  htmlFor={`skill-${level.value}`}
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

      <div>
        <h3 className="mb-4 text-lg font-semibold">Time & Serving Preferences</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="max-cooking-time">
              Maximum Cooking Time (minutes, optional)
            </Label>
            <Input
              id="max-cooking-time"
              type="number"
              min="5"
              max="300"
              placeholder="e.g., 30, 60, 90..."
              value={maxCookingTime ?? ""}
              onChange={(e) =>
                onUpdate({
                  maxCookingTime: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="mt-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Leave empty if you have no time constraints
            </p>
          </div>

          <div>
            <Label htmlFor="preferred-serving-size">Preferred Serving Size</Label>
            <Input
              id="preferred-serving-size"
              type="number"
              min="1"
              max="12"
              value={preferredServingSize}
              onChange={(e) =>
                onUpdate({ preferredServingSize: parseInt(e.target.value) || 2 })
              }
              className="mt-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              How many servings do you typically cook?
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Cooking Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="meal-prep">Meal Prep Friendly</Label>
              <p className="text-sm text-muted-foreground">
                Prefer recipes that can be made in batches
              </p>
            </div>
            <Switch
              id="meal-prep"
              checked={mealPrepFriendly}
              onCheckedChange={(checked) => onUpdate({ mealPrepFriendly: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="quick-meals">Quick Meals Only</Label>
              <p className="text-sm text-muted-foreground">
                Show me recipes that are 30 minutes or less
              </p>
            </div>
            <Switch
              id="quick-meals"
              checked={quickMealsOnly}
              onCheckedChange={(checked) => onUpdate({ quickMealsOnly: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
