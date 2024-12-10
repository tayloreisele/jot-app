import { View, TextInput, StyleSheet } from 'react-native';

export default function NewNote() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="Note title..."
        placeholderTextColor="#666"
        autoFocus={true}
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Start writing..."
        placeholderTextColor="#666"
        multiline={true}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
}); 