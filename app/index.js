import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router';

const index = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/onBoarding')
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    return <View className="flex-1 justify-center items-center bg-gray-900"></View>;
}

export default index
