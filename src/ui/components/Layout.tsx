import React, { useEffect, useRef } from "react";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { BvhPhysicsBody } from "@react-three/viverse/dist/physics";
import * as THREE from "three";
import debug from "debug";
import { updateHighlights, resetHighlights } from "../helpers/highlights";
import { MESH_TYPE_HIGHLIGHT, MESH_TYPE_POSITION } from "../constants";

const log = debug("roulette:layout");
import { useGame, GAME_PHASE } from "../hooks/useGame";

const LAYOUT_PATH = `${import.meta.env.BASE_URL}blender/test.glb`.replace(
  /\/+/g,
  "/",
);

// Set to true to enable physics collision detection (requires all geometries to have compatible attributes)
// Currently disabled due to geometry attribute compatibility issues
const ENABLE_PHYSICS = false;

export const Layout: React.FC = () => {
  const { scene } = useThree();
  const gltf = useGLTF(LAYOUT_PATH) as unknown as { scene: THREE.Scene };
  const lastPositionRef = useRef<string | null>(null);
  const { phase, selectedChipValue, placeBet } = useGame();

  useEffect(() => {
    const layoutScene = gltf.scene;

    layoutScene.traverse((child: THREE.Object3D) => {
      const isHighlight =
        typeof child.name === "string" && child.name.charAt(0) === "H";
      const isPosition =
        typeof child.name === "string" && child.name.charAt(0) === "P";

      // Normalize geometry attributes for BvhPhysicsBody compatibility
      if (child instanceof THREE.Mesh && child.geometry) {
        const geometry = child.geometry;
        const positionAttribute = geometry.attributes.position;

        if (positionAttribute) {
          const vertexCount = positionAttribute.count;

          // Ensure all geometries have UV attributes (required for BvhPhysicsBody)
          if (!geometry.attributes.uv) {
            // Add default UV coordinates if missing
            const uvArray = new Float32Array(vertexCount * 2);
            for (let i = 0; i < vertexCount; i++) {
              uvArray[i * 2] = 0;
              uvArray[i * 2 + 1] = 0;
            }
            geometry.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));
          }

          // Ensure normal attribute exists (often required for proper merging)
          if (!geometry.attributes.normal) {
            geometry.computeVertexNormals();
          }
        }
      }

      if (child.name === "felt") {
        child.userData = { type: "felt" };
        child.traverse((children: THREE.Object3D) => {
          children.receiveShadow = true;
        });
      } else if (!isHighlight && !isPosition) {
        // Only disable raycasting for decorative elements, NOT the felt
        child.raycast = () => null;
      }

      if (isHighlight) {
        child.userData.type = MESH_TYPE_HIGHLIGHT;
        child.userData.highlightId = child.name;

        child.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.material) {
            obj.userData.type = MESH_TYPE_HIGHLIGHT;
            obj.userData.highlightId = child.name;

            obj.material = obj.material.clone();
            obj.raycast = () => null;
            obj.material.setValues({
              blending: THREE.AdditiveBlending,
              opacity: 0,
              transparent: true,
            });
            obj.receiveShadow = true;
          }
        });
      }

      if (isPosition) {
        const [name, proxy] = child.name.split("-");
        const positionId = name;

        child.userData.type = MESH_TYPE_POSITION;
        child.userData.positionId = positionId;

        child.traverse((obj) => {
          obj.userData.type = MESH_TYPE_POSITION;
          obj.userData.positionId = positionId;

          if (obj instanceof THREE.Mesh && obj.material) {
            obj.material.setValues({ opacity: 0, transparent: true });
          }
        });

        if (!proxy) {
          child.uuid = name;
        }
      }
    });
  }, [gltf]);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    // Look through the intersection stack to find a betting position
    const positionIntersection = event.intersections?.find(
      (i) => i.object.userData.type === MESH_TYPE_POSITION,
    );

    const positionId = positionIntersection?.object.userData.positionId || null;

    if (positionId !== lastPositionRef.current) {
      log("Hover changed: %s -> %s", lastPositionRef.current, positionId);
      lastPositionRef.current = positionId;
      updateHighlights(scene, positionId);
    }
  };

  const handleClick = (event: { object: THREE.Object3D }) => {
    const intersected = event.object as THREE.Object3D;
    const userData = intersected.userData || {};

    if (
      phase === GAME_PHASE.BET &&
      selectedChipValue > 0 &&
      userData.type === MESH_TYPE_POSITION &&
      userData.positionId
    ) {
      log("Bet placed: %s (Value: %d)", userData.positionId, selectedChipValue);
      placeBet(userData.positionId as string);
    }
  };

  const handlePointerOut = () => {
    lastPositionRef.current = null;
    resetHighlights(scene);
  };

  const primitiveElement = (
    <primitive
      object={gltf.scene}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );

  // Note: BvhPhysicsBody requires all geometries to have compatible attributes
  // If you encounter attribute compatibility errors, set ENABLE_PHYSICS to false
  if (ENABLE_PHYSICS) {
    return <BvhPhysicsBody>{primitiveElement}</BvhPhysicsBody>;
  }

  return primitiveElement;
};

useGLTF.preload(LAYOUT_PATH);
