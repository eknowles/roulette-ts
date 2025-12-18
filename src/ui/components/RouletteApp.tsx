import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color } from "three";
import { GameProvider } from "../hooks/useGame";
import { Lighting } from "./Lighting";
import { Layout } from "./Layout";
import { PlacedChips } from "./PlacedChips";
import { CameraController } from "./CameraController";
import { ChipTexturePreloader } from "./Chip";

export const RouletteApp: React.FC = () => {
  return (
    <GameProvider>
      <div
        style={{ width: "100vw", height: "100vh", backgroundColor: "#05050a" }}
      >
        <Canvas
          camera={{ position: [0, 5, 0], fov: 50, near: 0.01, far: 20 }}
          onCreated={({ scene }) => {
            scene.background = new Color("#05050a");
            scene.fog = null;
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} castShadow={false} />
            <Lighting />
            <CameraController />
            <ChipTexturePreloader />
            <Layout />
            <PlacedChips />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Suspense>
        </Canvas>
      </div>
    </GameProvider>
  );
};
