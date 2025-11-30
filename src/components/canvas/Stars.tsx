import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

const inSphere = (buffer: Float32Array, options: { radius: number }) => {
    const { radius } = options;
    for (let i = 0; i < buffer.length; i += 3) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * radius;
        const sinPhi = Math.sin(phi);
        buffer[i] = r * sinPhi * Math.cos(theta);
        buffer[i + 1] = r * sinPhi * Math.sin(theta);
        buffer[i + 2] = r * Math.cos(phi);
    }
    return buffer;
};

const Stars = (props: any) => {
    const ref = useRef<any>();
    const [sphere] = useState(() => inSphere(new Float32Array(5000), { radius: 1.2 }));

    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#f272c8"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

export default Stars;
