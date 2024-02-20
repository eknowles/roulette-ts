import * as THREE from 'three';
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

export function loadChip(): Promise<THREE.Scene> {
  return new Promise((resolve) => {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load('./blender/chip.glb', (gltf: GLTF) => {
      const scene = gltf.scene;

      scene.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name === 'chip') {
          child.visible = false;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      return resolve(scene);
    });
  });
}

function getTexture(name: string, url: string) {
  return new Promise(((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(url, (texture) => {
      texture.flipY = false;
      return resolve({[name]: texture});
    }, undefined, (e) => reject(e));
  }));
}

export async function loadChipMaterials(): Promise<{ [id: string]: THREE.Texture }> {
  const textureMaps = {
    C_1: './blender/1.jpg',
    C_10: './blender/10.jpg',
    C_25: './blender/25.jpg',
    C_5: './blender/5.jpg',
    C_50: './blender/50.jpg',
  };
  const fn = Object.keys(textureMaps).reduce((acc, curr) => [...acc, getTexture(curr, textureMaps[curr])], []);
  const maps = await Promise
    .all(fn);
  const output = maps.reduce((acc, curr) => ({...acc, ...curr}), {});
  return Promise.resolve(output);
}
