import React, { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Easing, Tween, update as TweenUpdate } from "@tweenjs/tween.js";
import {
  CAMERA_POSITION_FRONT,
  CAMERA_POSITION_OVERVIEW,
  CAMERA_POSITION_SIDE,
  CAMERA_POSITION_TOP,
} from "../constants";

export const CameraController: React.FC = () => {
  const { camera } = useThree();

  useEffect(() => {
    const tweenTo = (pos: { x: number; y: number; z: number }) => {
      new Tween(camera.position).to(pos, 1000).easing(Easing.Cubic.Out).start();
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
        default:
          break;
      }
    };

    window.addEventListener("keypress", handleKey);
    return () => {
      window.removeEventListener("keypress", handleKey);
    };
  }, [camera]);

  useFrame(() => {
    TweenUpdate();
    camera.lookAt(0, 0, 0);
  });

  return null;
};
