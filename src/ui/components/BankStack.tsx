import React, { useMemo } from "react";
import { useBank, BankChip } from "../hooks/useBank";
import { BankPiles } from "./BankPiles";
import { BankCylinder } from "./BankCylinder";
import { BANK_STACK_POSITION } from "../constants";

interface BankStackProps {
  bank?: number;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  spacing?: number;
  maxStacks?: number;
  stacksPerRow?: number;
  chipsPerStack?: number;
  cylinderRadius?: number;
  cylinderHeight?: number;
  cylinderColor?: string;
  cylinderOpacity?: number;
}

export const BankStack: React.FC<BankStackProps> = ({
  bank,
  positionX = BANK_STACK_POSITION.x,
  positionY = BANK_STACK_POSITION.y,
  positionZ = BANK_STACK_POSITION.z,
  spacing = 0.125,
  maxStacks = 10,
  stacksPerRow = 5,
  chipsPerStack = 20,
  cylinderRadius = 0.7,
  cylinderHeight = 1.25,
  cylinderColor = "white",
  cylinderOpacity = 0.5,
}) => {
  const { chips, handleBankClick } = useBank({
    bank,
    positionX,
    positionY,
    positionZ,
    spacing,
    maxStacks,
    stacksPerRow,
    chipsPerStack,
  });

  // Pre-calculate the total number of chips across all denominations for instancing
  const chipGroups = useMemo(() => {
    const groups: Record<string, BankChip[]> = {};
    chips.forEach((chip) => {
      if (!groups[chip.chipTexture]) {
        groups[chip.chipTexture] = [];
      }
      groups[chip.chipTexture].push(chip);
    });
    return groups;
  }, [chips]);

  return (
    <group rotation={undefined} scale={undefined} castShadow={false}>
      {Object.entries(chipGroups).map(([texture, groupChips]) => (
        <BankPiles key={texture} chips={groupChips} texture={texture} />
      ))}
      <BankCylinder
        onClick={handleBankClick}
        radius={cylinderRadius}
        height={cylinderHeight}
        color={cylinderColor}
        opacity={cylinderOpacity}
        position={[positionX, positionY + cylinderHeight / 2, positionZ]}
      />
    </group>
  );
};
