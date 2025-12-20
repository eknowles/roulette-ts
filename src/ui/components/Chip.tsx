import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Easing, Tween } from "@tweenjs/tween.js";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/+/g, "/");
const CHIP_MODEL_PATH = `${BASE_URL}blender/chip.glb`.replace(/\/+/g, "/");

export const textureMaps: Record<string, string> = {
  C_1: `${BASE_URL}blender/1.jpg`.replace(/\/+/g, "/"),
  C_5: `${BASE_URL}blender/5.jpg`.replace(/\/+/g, "/"),
  C_10: `${BASE_URL}blender/10.jpg`.replace(/\/+/g, "/"),
  C_25: `${BASE_URL}blender/25.jpg`.replace(/\/+/g, "/"),
  C_50: `${BASE_URL}blender/50.jpg`.replace(/\/+/g, "/"),
};

interface ChipProps {
  position?: [number, number, number];
  chipTexture?: string;
  isTop?: boolean;
  rotationY?: number;
}

export const Chip: React.FC<ChipProps> = ({
  position = [0, 0, 0],
  chipTexture = "C_1",
  isTop = false,
  rotationY = 0,
}) => {
  const gltf = useGLTF(CHIP_MODEL_PATH) as unknown as { scene: THREE.Scene };
  const textures = useTexture(textureMaps) as Record<string, THREE.Texture>;
  const groupRef = useRef<THREE.Group>(null);

  const mesh = useMemo(() => {
    const base = gltf.scene.getObjectByName("chip") as THREE.Mesh;
    if (!base) {
      console.warn("Chip mesh not found in model");
      return new THREE.Mesh();
    }
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
        .to(
          { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z },
          700,
        )
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

    groupRef.current.rotation.y = rotationY;
  }, [isTop, mesh, x, y, z, rotationY]);

  return (
    <group ref={groupRef}>
      <primitive object={mesh} />
    </group>
  );
};

useGLTF.preload(CHIP_MODEL_PATH);

// Preload component to load textures early
export const ChipTexturePreloader: React.FC = () => {
  // This will preload all textures into the cache
  useTexture(textureMaps);
  return null;
};
