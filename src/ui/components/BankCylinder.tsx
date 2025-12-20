import React from "react";
import * as THREE from "three";
import { BANK_STACK_POSITION } from "../constants";

interface BankCylinderProps {
  onClick?: () => void;
  radius?: number;
  height?: number;
  color?: string;
  opacity?: number;
  position?: [number, number, number];
}

export const BankCylinder: React.FC<BankCylinderProps> = ({
  onClick = () => {},
  radius = 0.2,
  height = 1.25,
  color = "white",
  opacity = 0.1,
  position = [BANK_STACK_POSITION.x, height / 2, BANK_STACK_POSITION.z],
}) => {
  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        metalness={0.05}
        roughness={0.05}
      />
    </mesh>
  );
};
