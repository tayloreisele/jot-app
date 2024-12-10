import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import HeaderDivider from '../components/HeaderDivider';

export default function TabIndex() {
  const router = useRouter();

  const handleNewNote = () => {
    router.push('/(screens)/new-note');
  };

  return (
    <View style={styles.container}>
      <HeaderDivider />
      <TouchableOpacity 
        style={styles.newButton}
        onPress={handleNewNote}
      >
        <Text style={styles.buttonText}>New Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  newButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
