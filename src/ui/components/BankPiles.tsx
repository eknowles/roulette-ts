import React, { useMemo } from "react";
import { useGLTF, useTexture, Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { BankChip } from "../hooks/useBank";
import { textureMaps } from "./Chip";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/+/g, "/");
const CHIP_MODEL_PATH = `${BASE_URL}blender/chip.glb`.replace(/\/+/g, "/");

interface BankPilesProps {
  chips: BankChip[];
  texture: string;
}

export const BankPiles: React.FC<BankPilesProps> = ({ chips, texture }) => {
  const gltf = useGLTF(CHIP_MODEL_PATH) as unknown as { scene: THREE.Scene };
  const textures = useTexture(textureMaps) as Record<string, THREE.Texture>;

  const { geometry, material } = useMemo(() => {
    const mesh = gltf.scene.getObjectByName("chip") as THREE.Mesh;
    const mat = (mesh.material as THREE.MeshPhongMaterial).clone();

    if (textures[texture]) {
      const tex = textures[texture];
      tex.flipY = false;
      tex.needsUpdate = true;
      mat.map = tex;
    }

    // Adjust material for better performance/look
    mat.transparent = false;
    mat.opacity = 1;
    mat.needsUpdate = true;

    // Apply the same orientation fixes if needed, though usually instanced is fine
    return {
      geometry: mesh.geometry,
      material: mat,
    };
  }, [gltf, textures, texture]);

  // Handle scaling: the original mesh was scaled by 0.47 in Chip.tsx
  // We apply it here either to the Instances or each Instance.
  // The position in 'chips' is already the final world position.
  // If we scale the whole Instances group by 0.47, we need to divide positions by 0.47.

  return (
    <Instances
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
      scale={[0.47, 0.47, 0.47]}
    >
      {chips.map((chip) => (
        <Instance
          key={chip.key}
          // Divide world position by parent scale to keep it in the right place
          position={[
            chip.position[0] / 0.47,
            chip.position[1] / 0.47,
            chip.position[2] / 0.47,
          ]}
          rotation={[0, chip.rotationY, 0]}
        />
      ))}
    </Instances>
  );
};

useGLTF.preload(CHIP_MODEL_PATH);
