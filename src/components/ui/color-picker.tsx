"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

const WALLET_COLORS = [
  { name: "Google Blue", value: "google-blue", gradient: "from-blue-400 via-blue-500 to-blue-600" },
  { name: "Google Green", value: "google-green", gradient: "from-green-400 via-green-500 to-green-600" },
  { name: "Google Purple", value: "google-purple", gradient: "from-purple-400 via-purple-500 to-purple-600" },
  { name: "Google Red", value: "google-red", gradient: "from-red-400 via-red-500 to-red-600" },
  { name: "Google Orange", value: "google-orange", gradient: "from-orange-400 via-orange-500 to-orange-600" },
  { name: "Google Pink", value: "google-pink", gradient: "from-pink-400 via-pink-500 to-pink-600" },
  { name: "Google Teal", value: "google-teal", gradient: "from-teal-400 via-teal-500 to-teal-600" },
  { name: "Google Yellow", value: "google-yellow", gradient: "from-yellow-400 via-yellow-500 to-yellow-600" },
];

export function ColorPicker({ selectedColor, onColorChange, className = "" }: ColorPickerProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Wallet Color
      </label>
      <div className="grid grid-cols-6 gap-2">
        {WALLET_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${color.gradient} transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              selectedColor === color.value ? 'ring-2 ring-white ring-offset-2' : ''
            }`}
            title={color.name}
          >
            {selectedColor === color.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export { WALLET_COLORS };