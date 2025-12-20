import { useMemo, useCallback } from "react";
import { useGame } from "./useGame";
import {
  CHIP_HEIGHT,
  BANK_STACK_POSITION,
  CAMERA_POSITION_BANK,
} from "../constants";

export interface BankChip {
  key: string;
  position: [number, number, number];
  isTop: boolean;
  chipTexture: string;
  rotationY: number;
}

export interface BankConfig {
  bank?: number;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  spacing?: number;
  maxStacks?: number;
  stacksPerRow?: number;
  chipsPerStack?: number;
}

export const useBank = (config: BankConfig = {}) => {
  const {
    bank: bankProp,
    positionX = BANK_STACK_POSITION.x,
    positionY = BANK_STACK_POSITION.y,
    positionZ = BANK_STACK_POSITION.z,
    spacing = 0.035,
    maxStacks = 10,
    stacksPerRow = 5,
    chipsPerStack = 20,
  } = config;

  const bankPosition = useMemo(
    () => ({ x: positionX, y: positionY, z: positionZ }),
    [positionX, positionY, positionZ],
  );

  let game;
  try {
    game = useGame().game;
  } catch {
    // Fallback for Triplex/preview where GameProvider might be missing
  }

  const bank = bankProp ?? game?.table.player.bank ?? 1000;

  // Each chip is 1 unit in value
  const totalChips = Math.floor(bank);

  const chips = useMemo(() => {
    const list: BankChip[] = [];
    let remainingValue = totalChips;

    // Denominations to use in order for stacks 5-10
    const denominations = [
      { value: 1, texture: "C_1" }, // Stacks 1-4
      { value: 5, texture: "C_5" }, // Stacks 5-6
      { value: 10, texture: "C_10" }, // Stacks 7-8
      { value: 25, texture: "C_25" }, // Stacks 9-10
    ];

    for (let i = 0; i < maxStacks; i++) {
      if (remainingValue <= 0) break;

      const row = Math.floor(i / stacksPerRow);
      const col = i % stacksPerRow;

      // Center the grid around bankPosition
      const x = bankPosition.x + (col - (stacksPerRow - 1) / 2) * spacing;
      const z =
        bankPosition.z +
        (row - (Math.ceil(maxStacks / stacksPerRow) - 1) / 2) * spacing;

      // Determine denomination for this stack
      let denomIndex = 0;
      if (i >= 4) denomIndex = 1; // 5s
      if (i >= 6) denomIndex = 2; // 10s
      if (i >= 8) denomIndex = 3; // 25s

      const denom = denominations[denomIndex];
      const chipsInThisStack = Math.min(
        chipsPerStack,
        Math.floor(remainingValue / denom.value),
      );

      if (chipsInThisStack <= 0 && i >= 4) {
        // If we can't fit any of the current denomination, try the next lower one if applicable
        // but the user wants a proportion of 5, 10, 25 after 4 stacks of 1s.
        // For simplicity, we'll just stop if the value is too low for the intended denomination.
        continue;
      }

      for (let j = 0; j < chipsInThisStack; j++) {
        // Use a deterministic rotation based on stack and chip index
        const rotationY = ((i * 13.37 + j * 42.42) % 1) * Math.PI * 2;

        list.push({
          key: `bank-${i}-${j}`,
          position: [x, bankPosition.y + j * CHIP_HEIGHT, z],
          isTop: j === chipsInThisStack - 1,
          chipTexture: denom.texture,
          rotationY,
        });
      }

      remainingValue -= chipsInThisStack * denom.value;
    }
    return list;
  }, [
    totalChips,
    bankPosition,
    spacing,
    stacksPerRow,
    chipsPerStack,
    maxStacks,
  ]);

  const handleBankClick = useCallback(() => {
    const event = new CustomEvent("camera-move", {
      detail: {
        position: CAMERA_POSITION_BANK,
        lookAt: bankPosition,
      },
    });
    window.dispatchEvent(event);
  }, [bankPosition]);

  return {
    chips,
    handleBankClick,
    bank,
    totalChips,
  };
};
