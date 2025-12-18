import React from 'react';

export const Lighting: React.FC = () => {
  return (
    <>
      <spotLight
        color={0xffffff}
        intensity={2}
        distance={15}
        angle={Math.PI / 4}
        penumbra={0.4}
        position={[-1, 2.5, 1]}
        castShadow
      />
      <spotLight
        color={0xffffff}
        intensity={2}
        distance={15}
        angle={Math.PI / 4}
        penumbra={0.4}
        position={[1, 5, -1]}
        castShadow
      />
      <ambientLight color={0xffffff} intensity={0.85} />
    </>
  );
};


