import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Easing, Tween, update as TweenUpdate } from "@tweenjs/tween.js";
import {
  CAMERA_POSITION_BANK,
  CAMERA_POSITION_FRONT,
  CAMERA_POSITION_OVERVIEW,
  CAMERA_POSITION_SIDE,
  CAMERA_POSITION_TOP,
} from "../constants";

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const tweenTo = (
      pos: { x: number; y: number; z: number },
      lookAtPos: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
    ) => {
      new Tween(camera.position).to(pos, 1000).easing(Easing.Cubic.Out).start();
      new Tween(lookAtTarget.current)
        .to(lookAtPos, 1000)
        .easing(Easing.Cubic.Out)
        .start();
    };

    const handleKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case "0":
          tweenTo(CAMERA_POSITION_TOP);
          break;
        case "1":
          tweenTo(CAMERA_POSITION_FRONT);
          break;
        case "2":
          tweenTo(CAMERA_POSITION_SIDE);
          break;
        case "3":
          tweenTo(CAMERA_POSITION_OVERVIEW);
          break;
        case "4":
          tweenTo(CAMERA_POSITION_BANK);
          break;
        default:
          break;
      }
    };

    const handleCustomMove = (event: any) => {
      const { position, lookAt } = event.detail;
      tweenTo(position, lookAt);
    };

    window.addEventListener("keypress", handleKey);
    window.addEventListener(
      "camera-move" as any,
      handleCustomMove as EventListener,
    );

    return () => {
      window.removeEventListener("keypress", handleKey);
      window.removeEventListener(
        "camera-move" as any,
        handleCustomMove as EventListener,
      );
    };
  }, [camera]);

  useFrame(() => {
    TweenUpdate();
    camera.lookAt(lookAtTarget.current);
  });

  return null;
};
