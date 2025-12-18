import React, { createContext, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Color } from 'three';
import { useGameState, UseGameStateResult } from '../hooks/useGameState';
import { Lighting } from './Lighting';
import { Layout } from './Layout';
import { PlacedChips } from './PlacedChips';
import { CameraController } from './CameraController';
import { ChipTexturePreloader } from './Chip';

const GameContext = createContext<UseGameStateResult | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within RouletteApp');
  }
  return ctx;
}

export const RouletteApp: React.FC = () => {
  const gameState = useGameState();

  return (
    <GameContext.Provider value={gameState}>
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#05050a' }}>
        <Canvas
          camera={{ position: [0, 5, 0], fov: 50, near: 0.01, far: 20 }}
          onCreated={({ scene }) => {
            scene.background = new Color('#05050a');
            scene.fog = null;
          }}
        >
          <ambientLight intensity={0.2} />
          <Lighting />
          <CameraController />
          <ChipTexturePreloader />
          <Layout />
          <PlacedChips />
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>
    </GameContext.Provider>
  );
};


