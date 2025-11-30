import React from 'react';
import { Text3D, Center, Float } from '@react-three/drei';

const Name3D = () => {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Center>
                <Text3D
                    font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
                    size={0.75}
                    height={0.2}
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.02}
                    bevelOffset={0}
                    bevelSegments={5}
                >
                    Kavishka Thilakarathna
                    <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.5} />
                </Text3D>
            </Center>
        </Float>
    );
};

export default Name3D;
