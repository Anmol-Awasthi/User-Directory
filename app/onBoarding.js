import React, { useRef } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import Carousel from "react-native-reanimated-carousel";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const useSliderWidth = () => {
  const { width } = useWindowDimensions();
  return Math.min(width, 1200);
};

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const slides = [
  {
    title: "Browse Contacts",
    description: "Easily browse and organize your contacts.",
    animation: require("../assets/animations/contacts.json"),
  },
  {
    title: "View Details",
    description: "Access detailed information about each contact.",
    animation: require("../assets/animations/details.json"),
  },
  {
    title: "Smooth Navigation",
    description: "Enjoy a seamless and modern user experience.",
    animation: require("../assets/animations/smooth.json"),
  },
];

const onBoarding = () => {
  const router = useRouter();
  const carouselRef = useRef(null);
  const sliderWidth = useSliderWidth();

  const renderSlide = ({ item }) => (
    <View className="flex-1 justify-center items-center max-w-4xl mx-auto">
      <LottieView
        source={item.animation}
        autoPlay
        loop
        style={{
          width: Math.min(400, sliderWidth * 0.5),
          height: Math.min(400, sliderWidth * 0.5),
        }}
      />
      <Text className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mt-6">
        {item.title}
      </Text>
      <Text className="text-gray-400 text-center mt-4 px-10 md:px-20 lg:px-32 md:text-xl lg:text-2xl">
        {item.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View className="flex-1 bg-gray-900 max-w-7xl mx-auto">
        <Carousel
          ref={carouselRef}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          width={sliderWidth}
          height={Math.min(500, sliderWidth * 0.5)}
          autoPlay
          autoPlayInterval={3000}
          data={slides}
          renderItem={renderSlide}
        />
        <View className="absolute bottom-48 w-full justify-center items-center">
          <Text
            className="text-blue-300 text-xl md:text-2xl lg:text-3xl font-semibold hover:text-blue-400 transition-colors duration-300"
            onPress={() => router.replace("/home")}
          >
            Go to User Directory
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default onBoarding;
