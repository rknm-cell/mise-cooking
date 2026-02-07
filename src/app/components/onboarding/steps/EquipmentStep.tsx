"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

type EquipmentStepProps = {
  availableEquipment: string[];
  onUpdate: (data: { availableEquipment?: string[] }) => void;
};

const EQUIPMENT_OPTIONS = [
  { value: "oven", label: "Oven", emoji: "🔥" },
  { value: "stovetop", label: "Stovetop", emoji: "🍳" },
  { value: "microwave", label: "Microwave", emoji: "📡" },
  { value: "slow-cooker", label: "Slow Cooker", emoji: "🥘" },
  { value: "air-fryer", label: "Air Fryer", emoji: "🍟" },
  { value: "grill", label: "Grill", emoji: "🔥" },
  { value: "blender", label: "Blender", emoji: "🥤" },
  { value: "food-processor", label: "Food Processor", emoji: "⚙️" },
  { value: "stand-mixer", label: "Stand Mixer", emoji: "🎚️" },
  { value: "instant-pot", label: "Instant Pot / Pressure Cooker", emoji: "⚡" },
];

export function EquipmentStep({ availableEquipment, onUpdate }: EquipmentStepProps) {
  const handleEquipmentToggle = (value: string) => {
    const updated = availableEquipment.includes(value)
      ? availableEquipment.filter((item) => item !== value)
      : [...availableEquipment, value];
    onUpdate({ availableEquipment: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Kitchen Equipment</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Select the equipment you have available. This helps us suggest recipes you can actually
          make!
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {EQUIPMENT_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`equipment-${option.value}`}
                checked={availableEquipment.includes(option.value)}
                onCheckedChange={() => handleEquipmentToggle(option.value)}
              />
              <Label
                htmlFor={`equipment-${option.value}`}
                className="cursor-pointer text-sm font-normal"
              >
                <span className="mr-2">{option.emoji}</span>
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
