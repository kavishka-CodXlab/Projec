import { Sparkles } from '@react-three/drei';

const WarpStars = () => {
    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Sparkles
                count={2000}
                scale={[20, 20, 20]}
                size={2}
                speed={2}
                opacity={0.5}
                color="#00f3ff"
            />
            <Sparkles
                count={1000}
                scale={[30, 30, 30]}
                size={5}
                speed={3}
                opacity={0.3}
                color="#bd00ff"
            />
        </group>
    );
};

export default WarpStars;
