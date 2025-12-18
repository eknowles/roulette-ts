import React, { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { GameProvider } from "../hooks/useGame";
import { Lighting } from "./Lighting";
import { Layout } from "./Layout";
import { PlacedChips } from "./PlacedChips";
import { CameraController } from "./CameraController";
import { ChipTexturePreloader } from "./Chip";

/**
 * RouletteScene - A standalone scene component for Triplex
 * This component renders inside Triplex's Canvas (via CanvasProvider)
 * It provides GameProvider for child components that need it
 */
export const RouletteScene: React.FC = () => {
  return (
    <GameProvider>
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <Lighting />
        <CameraController />
        <ChipTexturePreloader />
        <Layout />
        <PlacedChips />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Suspense>
    </GameProvider>
  );
};
