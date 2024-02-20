import * as THREE from 'three';
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

import * as constants from '../constants';

export interface IPositionUserData {
  positionId: string;
  positionProxy: boolean;
  type: string;
}

export function loadLayout(): Promise<THREE.Scene> {
  return new Promise((resolve) => {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load('./blender/test.glb', (gltf: GLTF) => {
      const scene = gltf.scene;

      scene.traverse((child) => {
        const isHighlight = child.name.charAt(0) === 'H';
        const isPosition = child.name.charAt(0) === 'P';

        if (child.name === 'felt') {
          child.traverse((children) => {
            children.receiveShadow = true;
          });
        }

        if (isHighlight) {
          child.material.setValues({blending: THREE.AdditiveBlending, opacity: 0.3, transparent: true});
          child.receiveShadow = true;
          child.userData = {highlightId: child.name, type: constants.MESH_TYPE_HIGHLIGHT};
        }

        if (isPosition) {
          // we account for multiple position references using a suffix (e.g. P_3-001)
          const [name, proxy] = child.name.split('-');
          const positionId = name;

          child.material.setValues({opacity: 0, transparent: true});
          child.userData = {
            positionId,
            positionProxy: !!proxy,
            type: constants.MESH_TYPE_POSITION,
          };

          if (!proxy) {
            child.uuid = name;
          }
        }
      });

      return resolve(scene);
    });
  });
}
