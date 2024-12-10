import { Stack } from 'expo-router';

export default function PostLayout () {
    return (
        <Stack screenOptions={{ headerShown: false }}> 
            <Stack.Screen
                name="profile"
                options={{
                    headerShown: true,  
                    title: "Profile",  
                }}
            />
        </Stack>
    );
}
