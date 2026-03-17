import { Redirect } from 'expo-router';

// Redirect to main tab
export default function TabsIndex() {
    return <Redirect href="/(tabs)/main" />;
}
