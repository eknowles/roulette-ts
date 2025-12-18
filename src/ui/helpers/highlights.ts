import { Mesh, Scene, MeshPhongMaterial } from 'three';
import debug from 'debug';
import { POSITIONS } from '../../game/constants/positions';
import { MESH_TYPE_HIGHLIGHT } from '../constants';

const log = debug('roulette:highlights');

// Precalculate highlight sets for all positions
const positionHighlights = new Map<string, Set<string>>();

Object.values(POSITIONS).forEach((pos) => {
  const ids = new Set<string>();
  pos.winners.forEach((w) => ids.add(`H_${w}`));
  pos.highlights?.forEach((h) => ids.add(h));
  positionHighlights.set(pos.id, ids);
});

/**
 * Updates highlights in the scene based on the hovered position.
 */
export function updateHighlights(scene: Scene, positionId: string | null) {
  const activeHighlightIds = positionId ? positionHighlights.get(positionId) || new Set<string>() : new Set<string>();

  if (positionId) {
    log('Active Position: %s, Highlighting: %o', positionId, Array.from(activeHighlightIds));
  } else {
    log('Clearing highlights');
  }

  scene.traverse((obj) => {
    if (obj.userData.type === MESH_TYPE_HIGHLIGHT) {
      // Get the base name (e.g., H_1 from H_1-proxy)
      const baseId = obj.name.split('-')[0];
      const isTarget = activeHighlightIds.has(baseId);
      const opacity = isTarget ? 0.3 : 0;

      // Update opacity on the object and its mesh children
      if (obj instanceof Mesh && obj.material) {
        (obj.material as MeshPhongMaterial).opacity = opacity;
      }
      obj.children.forEach((child) => {
        if (child instanceof Mesh && child.material) {
          (child.material as MeshPhongMaterial).opacity = opacity;
        }
      });
    }
  });
}

export function resetHighlights(scene: Scene) {
  updateHighlights(scene, null);
}

export function highlightPosition(scene: Scene, positionId: string) {
  updateHighlights(scene, positionId);
}
