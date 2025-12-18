import React from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { numberToChips } from '../helpers/number-to-chips';
import { CHIP_HEIGHT } from '../constants';
import { Chip } from './Chip';
import { useGame } from '../hooks/useGame';

export const PlacedChips: React.FC = () => {
  const { game } = useGame();
  const { scene } = useThree();

  const chips: {
    key: string;
    position: [number, number, number];
    chipTexture: string;
    isTop: boolean;
  }[] = [];

  const bets = game.table.currentSpin.bets;

  Object.keys(bets).forEach((positionId) => {
    const amount = bets[positionId];
    const requiredChips = numberToChips(amount);

    const obj = scene.getObjectByProperty('uuid', positionId) as THREE.Mesh | null;

    if (!obj) {
      return;
    }

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    obj.updateWorldMatrix(true, false);
    obj.matrixWorld.decompose(position, quaternion, scale);

    const baseOffset = CHIP_HEIGHT * 1.5;

    requiredChips.forEach((chipTexture, index) => {
      const y = position.y + baseOffset + index * CHIP_HEIGHT;
      const isTop = index === requiredChips.length - 1;

      chips.push({
        key: `${positionId}-${chipTexture}-${index}`,
        position: [position.x, y, position.z],
        chipTexture,
        isTop,
      });
    });
  });

  return (
    <>
      {chips.map((chip) => (
        <Chip
          key={chip.key}
          position={chip.position}
          chipTexture={chip.chipTexture}
          isTop={chip.isTop}
        />
      ))}
    </>
  );
};


