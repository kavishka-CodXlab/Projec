import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';

const FlyingPlane = () => {
    const planeRef = useRef<THREE.Group>(null);

    // Create a smooth flight path
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(-6, 2, 0),
            new THREE.Vector3(-3, 4, -2),
            new THREE.Vector3(3, 0, -3),
            new THREE.Vector3(6, -2, 0),
            new THREE.Vector3(3, -4, 3),
            new THREE.Vector3(-3, -2, 2),
            new THREE.Vector3(-6, 2, 0),
        ], true);
    }, []);

    useFrame((state) => {
        if (!planeRef.current) return;

        const t = (state.clock.getElapsedTime() * 0.1) % 1; // Slower speed
        const position = curve.getPoint(t);
        const tangent = curve.getTangent(t);

        // Update position
        planeRef.current.position.copy(position);

        // Update rotation to face direction of travel
        const lookAt = position.clone().add(tangent);
        planeRef.current.lookAt(lookAt);

        // Add banking (roll) based on curvature
        planeRef.current.rotation.z += tangent.x * 0.5;
    });

    return (
        <group ref={planeRef}>
            <Trail
                width={0.4}
                length={12}
                color={new THREE.Color("#22d3ee")} // Cyan-400
                attenuation={(t) => t * t}
            >
                {/* Paper Plane Geometry - Constructed from meshes */}
                <group rotation={[0, -Math.PI / 2, 0]} scale={[0.5, 0.5, 0.5]}>
                    {/* Main Body */}
                    <mesh rotation={[0, 0, -Math.PI / 2]}>
                        <coneGeometry args={[0.5, 2, 3]} /> {/* Triangle shape */}
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive="#22d3ee"
                            emissiveIntensity={0.2}
                            roughness={0.1}
                            metalness={0.9}
                        />
                    </mesh>
                </group>
            </Trail>

            {/* Engine/Trail Glow */}
            <pointLight distance={3} intensity={2} color="#22d3ee" />
        </group>
    );
};

export default FlyingPlane;
