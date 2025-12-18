import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Easing, Tween } from '@tweenjs/tween.js';

const CHIP_MODEL_PATH = '/roulette-ts/blender/chip.glb';

const textureMaps: Record<string, string> = {
  C_1: '/roulette-ts/blender/1.jpg',
  C_5: '/roulette-ts/blender/5.jpg',
  C_10: '/roulette-ts/blender/10.jpg',
  C_25: '/roulette-ts/blender/25.jpg',
  C_50: '/roulette-ts/blender/50.jpg',
};

interface ChipProps {
  position: [number, number, number];
  chipTexture: string;
  isTop: boolean;
}

export const Chip: React.FC<ChipProps> = ({ position, chipTexture, isTop }) => {
  const gltf = useGLTF(CHIP_MODEL_PATH) as unknown as { scene: THREE.Scene };
  const textures = useTexture(textureMaps) as Record<string, THREE.Texture>;
  const groupRef = useRef<THREE.Group>(null);

  const mesh = useMemo(() => {
    const base = gltf.scene.getObjectByName('chip') as THREE.Mesh;
    const clone = base.clone();
    // Match original scaling / shadow behavior
    clone.scale.set(0.47, 0.47, 0.47);
    clone.castShadow = true;
    clone.receiveShadow = true;
    return clone;
  }, [gltf]);

  useEffect(() => {
    const material = mesh.material as THREE.MeshPhongMaterial;
    if (material && textures[chipTexture]) {
      // Match original loader: avoid vertical flip of the texture
      Object.values(textures).forEach((tex) => {
        tex.flipY = false;
        tex.needsUpdate = true;
      });

      mesh.material = material.clone();
      (mesh.material as THREE.MeshPhongMaterial).map = textures[chipTexture];
      (mesh.material as THREE.MeshPhongMaterial).needsUpdate = true;
    }
  }, [mesh, chipTexture, textures]);

  const [x, y, z] = position;

  useEffect(() => {
    if (!groupRef.current) {
      return;
    }

    // Animate only the top chip, like the original implementation
    if (isTop) {
      const targetPosition = new THREE.Vector3(x, y, z);
      const startPosition = new THREE.Vector3(x, y + 0.7, z);

      groupRef.current.position.copy(startPosition);

      const startRotationX = mesh.rotation.x - Math.PI;
      const targetRotationX = mesh.rotation.x + Math.PI;
      mesh.rotation.x = startRotationX;

      new Tween(groupRef.current.position)
        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 700)
        .easing(Easing.Circular.Out)
        .start();

      new Tween(mesh.rotation)
        .to({ x: targetRotationX }, 600)
        .easing(Easing.Sinusoidal.Out)
        .start();
    } else {
      // Non-top chips snap into place for stacking
      groupRef.current.position.set(x, y, z);
    }
  }, [isTop, mesh, x, y, z]);

  return (
    <group ref={groupRef}>
      <primitive object={mesh} />
    </group>
  );
};

useGLTF.preload(CHIP_MODEL_PATH);


