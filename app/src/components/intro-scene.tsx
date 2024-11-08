import { FC } from "react";
import { Canvas } from "@react-three/fiber";
import Buzzer from "../models/Buzzer";
import { ContactShadows, Float } from "@react-three/drei";

const IntroScene: FC = () => {
  return (
    <Canvas shadows camera={{ position: [-2, 2, 2] }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[-10, 2, -5]} intensity={2} color="red" />
      <directionalLight position={[-1, -2, -5]} intensity={4} color="#0c8cbf" />

      <spotLight
        position={[5, 0, 5]}
        intensity={2.5}
        penumbra={1}
        angle={0.35}
        castShadow
        color="#0c8cbf"
      />

      <Float>
        <Buzzer />
      </Float>

      <ContactShadows blur={1.5} position-y={-0.49} scale={10} color={"#444"} />
    </Canvas>
  );
};

export default IntroScene;
