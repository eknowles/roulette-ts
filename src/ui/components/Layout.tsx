import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { highlightPosition, resetHighlights } from '../helpers/highlights';
import { MESH_TYPE_HIGHLIGHT, MESH_TYPE_POSITION } from '../constants';
import { useGame } from './RouletteApp';

const LAYOUT_PATH = '/roulette-ts/blender/test.glb';

export const Layout: React.FC = () => {
  const { scene } = useThree();
  const gltf = useGLTF(LAYOUT_PATH) as unknown as { scene: THREE.Scene };
  const lastPositionRef = useRef<string | null>(null);
  const { phase, selectedChipValue, placeBet } = useGame();

  useEffect(() => {
    const layoutScene = gltf.scene;

    layoutScene.traverse((child: THREE.Object3D) => {
      const isHighlight = typeof child.name === 'string' && child.name.charAt(0) === 'H';
      const isPosition = typeof child.name === 'string' && child.name.charAt(0) === 'P';

      if (child.name === 'felt') {
        child.traverse((children: THREE.Object3D) => {
          children.receiveShadow = true;
        });
      }

      if (isHighlight && (child as THREE.Mesh).material) {
        const material = (child as THREE.Mesh).material as THREE.MeshPhongMaterial;
        material.setValues({
          blending: THREE.AdditiveBlending,
          opacity: 0.3,
          transparent: true,
        });
        child.receiveShadow = true;
        child.userData = { highlightId: child.name, type: MESH_TYPE_HIGHLIGHT };
      }

      if (isPosition && (child as THREE.Mesh).material) {
        const [name, proxy] = child.name.split('-');
        const positionId = name;

        const material = (child as THREE.Mesh).material as THREE.MeshPhongMaterial;
        material.setValues({ opacity: 0, transparent: true });
        child.userData = {
          positionId,
          positionProxy: !!proxy,
          type: MESH_TYPE_POSITION,
        };

        if (!proxy) {
          child.uuid = name;
        }
      }
    });

    scene.add(layoutScene);

    return () => {
      scene.remove(layoutScene);
    };
  }, [gltf, scene]);

  const handlePointerMove = (event: { object: THREE.Object3D }) => {
    const intersected = event.object as THREE.Object3D;
    const userData = intersected.userData || {};

    if (userData.type === MESH_TYPE_POSITION && userData.positionId) {
      const positionId = userData.positionId as string;

      if (positionId === lastPositionRef.current) {
        return;
      }

      resetHighlights(scene);
      lastPositionRef.current = positionId;
      highlightPosition(scene, positionId);
    } else {
      lastPositionRef.current = null;
      resetHighlights(scene);
    }
  };

  const handleClick = (event: { object: THREE.Object3D }) => {
    const intersected = event.object as THREE.Object3D;
    const userData = intersected.userData || {};

    if (
      phase === 'BET' &&
      selectedChipValue > 0 &&
      userData.type === MESH_TYPE_POSITION &&
      userData.positionId
    ) {
      placeBet(userData.positionId as string);
    }
  };

  return (
    <primitive
      object={gltf.scene}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    />
  );
};

useGLTF.preload(LAYOUT_PATH);


