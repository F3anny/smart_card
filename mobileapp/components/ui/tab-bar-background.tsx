import { StyleSheet, View } from 'react-native';

export default function TabBarBackground() {
    return <View style={styles.background} />;
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
});
