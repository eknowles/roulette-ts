import { Mesh, Object3D, Scene, PlaneGeometry, MeshPhongMaterial, Object3DEventMap } from 'three';
import { POSITIONS } from '../../game/constants/positions';
import { MESH_TYPE_HIGHLIGHT } from '../constants';

type HighlightMesh = Mesh<PlaneGeometry, MeshPhongMaterial, Object3DEventMap>;

export function resetHighlights(scene: Scene) {
  scene.traverse((object) => {
    if (object.userData.type === MESH_TYPE_HIGHLIGHT) {
      object.children.forEach((child: HighlightMesh) => {
        if (child.material) {
          child.material.setValues({opacity: 0});
        }
      });
    }
  });
}

export function highlightPosition(scene: Scene, positionId: string) {
  const position = POSITIONS[positionId];

  if (!position) {
    return;
  }

  const highlightedNames = position.winners.map((num) => `H_${num}`);

  highlightedNames.forEach((name) => {
    const obj = scene.getObjectByName(name);
    highlightChildren(obj);
  });

  if (position.highlights) {
    position.highlights.forEach((name) => {
      const obj = scene.getObjectByName(name);
      highlightChildren(obj);
    });
  }
}

function highlightChildren(obj: Object3D) {
  obj.children.forEach((child: HighlightMesh) => {
    child.material.setValues({opacity: 0.2});
  });
}
