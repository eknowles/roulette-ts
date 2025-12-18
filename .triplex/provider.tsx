import React from "react";

/**
 * Global Provider - Rendered at the root of the component tree
 * Useful for setting up global styles, themes, and data
 */
export function GlobalProvider({
  children,
  backgroundColor = "#05050a",
}: {
  children?: React.ReactNode;
  backgroundColor?: string;
}) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor,
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Canvas Provider - Rendered inside Canvas components
 * Configure the 3D environment, physics, lighting, etc.
 */
export function CanvasProvider({
  children,
  shadowsEnabled = true,
  ambientIntensity = 0.2,
  spotLightIntensity = 2,
}: {
  children?: React.ReactNode;
  shadowsEnabled?: boolean;
  ambientIntensity?: number;
  spotLightIntensity?: number;
}) {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      {shadowsEnabled && (
        <>
          <spotLight
            color={0xffffff}
            intensity={spotLightIntensity}
            distance={15}
            angle={Math.PI / 4}
            penumbra={0.4}
            position={[-1, 2.5, 1]}
            castShadow
          />
          <spotLight
            color={0xffffff}
            intensity={spotLightIntensity}
            distance={15}
            angle={Math.PI / 4}
            penumbra={0.4}
            position={[1, 5, -1]}
            castShadow
          />
        </>
      )}
      <ambientLight color={0xffffff} intensity={0.85} />
      {children}
    </>
  );
}
