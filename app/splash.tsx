import React, { useEffect } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

const Splash = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/");
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fee2e2", // light red, replace with your desired bg
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LottieView
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
        source={require("../assets/animations/anim.json")}
        onAnimationFinish={() => console.log("Animation finished")}
      />
    </View>
  );
};

export default Splash;
