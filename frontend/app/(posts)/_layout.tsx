import { Stack } from 'expo-router';

export default function PostLayout () {
    return (
        <Stack screenOptions={{ headerShown: false }}> 
            <Stack.Screen
                name="createPost"
                options={{
                    headerShown: true,  
                    title: "Create Post",  
                }}
            />
            <Stack.Screen
                name="editPost"
                options={{
                    headerShown: true,  
                    title: "Edit Post", 
                }}
            />
        </Stack>
    );
}
