import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface SkeletonItensProps {
  showSkeleton?: boolean;
}

export default function SkeletonItens({ showSkeleton }: SkeletonItensProps) {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    console.log(showSkeleton + " showSkeleton");
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <>
      {showSkeleton && (
        <Animated.View
          style={{
            flex: 1,
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            marginTop: 80,
            gap: 16,
            opacity: pulseAnim,
          }}
        >
          {[1, 2, 3, 4].map((_, i) => (
            <Animated.View
              key={i}
              style={{
                width: "80%",
                height: 119,
                backgroundColor: "#D8D8D8",
                borderRadius: 14,
              }}
            />
          ))}
        </Animated.View>
      )}
    </>
  );
}
