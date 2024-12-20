/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 .\buzzer.glb -Tt
*/

import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useState } from "react";
import { a, useSpring } from "@react-spring/three";

type GLTFResult = GLTF & {
  nodes: {
    base: THREE.Mesh;
    top: THREE.Mesh;
  };
  materials: {
    buzzer_base: THREE.MeshStandardMaterial;
    buzzer_decal: THREE.MeshStandardMaterial;
  };
};

const Buzzer = (props: JSX.IntrinsicElements["group"]) => {
  const { nodes, materials } = useGLTF(
    "/models/buzzer-transformed.glb"
  ) as GLTFResult;

  const [clicked, setClicked] = useState<boolean>(false);

  const [values] = useSpring(
    () => ({
      from: {
        position: [0, 1.267, 0] as [number, number, number],
      },
      to: {
        position: [0, 1.267 - 0.05, 0] as [number, number, number],
      },
      reverse: !clicked,
      config: {
        duration: 300,
      },
      onResolve: () => setClicked(false),
    }),
    [clicked]
  );

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.base.geometry}
        material={materials.buzzer_base}
        position={[0, 0.333, 0]}
        scale={[1, 0.333, 1]}
        castShadow
        receiveShadow
      />
      <a.mesh
        geometry={nodes.top.geometry}
        material={materials.buzzer_decal}
        position={values.position}
        castShadow
        receiveShadow
        onClick={() => setClicked(true)}
      />
    </group>
  );
};

useGLTF.preload("/models/buzzer-transformed.glb");

export default Buzzer;
