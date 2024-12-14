import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import ExpoFastImage from "expo-fast-image";
import { useWindowDimensions } from "react-native";

const API_URL = "https://dummyjson.com/users";

const UserDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${API_URL}/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-900 pt-12">
      <View style={{ maxWidth: isLargeScreen ? 1200 : "100%", alignSelf: "center", width: "100%", padding: isLargeScreen ? 40 : 16 }}>
        <TouchableOpacity onPress={handleBack} className="mb-8 ml-2">
          <Text className="text-white text-5xl">←</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: isLargeScreen ? "row" : "column", gap: isLargeScreen ? 40 : 0 }}>
          <View style={{ flex: isLargeScreen ? 1 : undefined }} className="items-center mb-6">
            <View style={{
              width: isLargeScreen ? 256 : 128,
              height: isLargeScreen ? 256 : 128,
              borderRadius: isLargeScreen ? 128 : 64,
              borderWidth: 2,
              borderColor: "white",
              overflow: "hidden",
            }}>
              {user.image && user.image.startsWith("http") ? (
  <View style={{ width: "100%", height: "100%" }}>
    <ExpoFastImage
      source={{ uri: user.image }}
      style={{ width: "100%", height: "100%" }}
      resizeMode="cover"
    />
  </View>
) : (
  <View className="w-full h-full bg-gray-700 items-center justify-center">
    <Text className="text-white text-2xl">
      {user.firstName?.[0]}
      {user.lastName?.[0]}
    </Text>
  </View>
)}

            </View>
            <Text className="text-white text-2xl font-bold mt-4">
              {user.firstName} {user.lastName}
            </Text>
            <Text className="text-gray-400 text-sm">{user.email}</Text>
          </View>

          <View style={{ flex: isLargeScreen ? 2 : undefined }}>
            <View className="bg-gray-800 p-4 rounded-lg mb-4">
              <Text className="text-white font-bold text-lg mb-2">🏠 Address</Text>
              <Text className="text-gray-400">{user.address.address}</Text>
              <Text className="text-gray-400">
                {user.address.city}, {user.address.state} - {user.address.postalCode}
              </Text>
            </View>

            <View style={{ flexDirection: isLargeScreen ? "row" : "column", gap: isLargeScreen ? 16 : 0 }}>
              <View className="bg-gray-800 p-4 rounded-lg mb-4" style={{ flex: 1 }}>
                <Text className="text-white font-bold text-lg mb-2">📱 Phone</Text>
                <Text className="text-gray-400">{user.phone}</Text>
              </View>

              <View className="bg-gray-800 p-4 rounded-lg mb-4" style={{ flex: 1 }}>
                <Text className="text-white font-bold text-lg mb-2">🎂 BirthDay</Text>
                <Text className="text-gray-400">
                  {new Date(user.birthDate).toLocaleDateString("en-GB")}
                </Text>
              </View>
            </View>

            <View className="bg-gray-800 p-4 rounded-lg">
              <Text className="text-white font-bold text-lg mb-2">🏢 Company</Text>
              <Text className="text-gray-400">{user.company.name}</Text>
              <Text className="text-gray-400 text-sm">{user.company.title}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserDetails;
