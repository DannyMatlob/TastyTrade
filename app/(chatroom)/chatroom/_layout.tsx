import { View, Text } from 'react-native'
import { Stack } from 'expo-router';

const ChatRoomLayout2 = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="[id]"
                    options={{
                        headerShown: false,
                        title: ""  // Empty string instead of "Chat Room"
                    }}
                />
            </Stack>
        </>
    )
}

export default ChatRoomLayout2;