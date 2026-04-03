import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

/**
 * @param {{ title: string, description: string }} props
 */
export function PlaceholderScreen({ title, description }) {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  description: {
    marginTop: 8,
    opacity: 0.7,
    textAlign: 'center',
  },
});
