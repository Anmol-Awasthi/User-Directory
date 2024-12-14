import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import axios from "axios";

const API_URL = "https://dummyjson.com/users";

const HomeScreen = () => {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [error, setError] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);
  const LIMIT = 10;

  const translateX = useSharedValue(100);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    position: "absolute",
    bottom: 24,
    right: 24,
  }));

  const fetchUsers = async () => {
    if (loading || fetchingMore || isEndReached) return;

    setLoading(skip === 0);
    setFetchingMore(skip !== 0);
    setError(null);

    try {
      const response = await axios.get(
        `${API_URL}?limit=${LIMIT}&skip=${skip}`
      );
      const newUsers = response.data.users;

      if (newUsers.length === 0) {
        setIsEndReached(true);
        return;
      }

      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      setFilteredUsers((prevUsers) => [...prevUsers, ...newUsers]);
      setSkip(skip + LIMIT);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const loadMoreUsers = () => {
    if (searchQuery.trim() || isEndReached || error) return;
    if (!isEndReached && !error) {
      fetchUsers();
    }
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const shouldShow = offsetY > 200;

    if (shouldShow !== showScrollToTop) {
      translateX.value = withSpring(shouldShow ? 0 : 100, {
        damping: 15,
        stiffness: 150,
      });
      setShowScrollToTop(shouldShow);
    }
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const searchTerm = query.toLowerCase();
        return (
          fullName.startsWith(searchTerm) ||
          user.email.toLowerCase() === searchTerm ||
          user.lastName.toLowerCase().startsWith(searchTerm)
        );
      });

      setFilteredUsers(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/details/${item.id}`)}
      className="bg-gray-800 rounded-lg p-4 mb-4 flex-row items-center"
    >
      <Image
        source={item.image}
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          marginRight: 16,
        }}
        contentFit="cover"
        transition={300}
      />
      <View>
        <Text className="text-white text-lg font-bold">
          {item.firstName} {item.lastName}
        </Text>
        <Text className="text-gray-400">{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderError = () => (
    <View className="flex-1 justify-center items-center">
      <Text className="text-red-500 text-lg mb-4">{error}</Text>
      <TouchableOpacity
        onPress={() => fetchUsers()}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-bold">Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 justify-center items-center">
      <Text className="text-white text-lg">No users found</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View className="flex-1 px-4">
        {!loading && !error && users.length > 0 && (
          <>
            <View className="bg-gradient-to-r from-blue-900 to-gray-800 items-center p-6 rounded-xl mb-4 mt-4 shadow-lg border border-gray-700">
              <Text className="text-white text-2xl font-extrabold tracking-wider">
                User Directory
              </Text>
              <View className="h-1 w-20 bg-blue-500 rounded-full mt-1" />
            </View>
            <View className="relative">
              <TextInput
                className="bg-gray-800 text-white px-4 py-3 rounded-lg mb-4 pr-12"
                placeholder="Search users..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  className="absolute right-4 top-3"
                  onPress={() => handleSearch("")}
                >
                  <AntDesign name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ffffff"
            className="flex-1 justify-center items-center"
          />
        ) : error ? (
          renderError()
        ) : (
          <FlatList
            ref={flatListRef}
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            onEndReached={loadMoreUsers}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ListFooterComponent={
              fetchingMore ? (
                <ActivityIndicator
                  size="large"
                  color="#ffffff"
                  className="mb-6"
                />
              ) : isEndReached ? (
                <Text className="text-gray-400 text-center py-4">
                  No more users to load
                </Text>
              ) : null
            }
          />
        )}
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={scrollToTop}
            className="bg-blue-600 p-4 rounded-full shadow-lg"
          >
            <AntDesign name="arrowup" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
