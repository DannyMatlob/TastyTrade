import { View, Text } from 'react-native'
import { Stack } from 'expo-router';

const OnboardLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="start"
                    options={{headerShown: false}}
                    />
            </Stack>
        </>
    )
}

export default OnboardLayout;