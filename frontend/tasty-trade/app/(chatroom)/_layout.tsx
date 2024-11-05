import { View, Text } from 'react-native'
import { Stack } from 'expo-router';

const ChatRoomLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="chatroom"
                    options={{
                        headerShown: true,
                        title: ""  // Empty string instead of "Chat Room"
                    }}
                />
            </Stack>
        </>
    )
}

export default ChatRoomLayout;