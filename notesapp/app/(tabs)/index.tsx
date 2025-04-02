import { useState, useEffect } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Define the type for a note
type Note = {
  id: string;
  text: string;
};

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]); // Explicitly define the type of notes
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        setNotes(storedNotes ? JSON.parse(storedNotes) : []); // Ensure notes is always an array
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    };
    loadNotes();
  }, []);

  const addNote = async () => {
    if (!newNote.trim()) {
      Alert.alert('Error', 'Note cannot be empty.');
      return;
    }
    const updatedNotes: Note[] = [...notes, { id: Date.now().toString(), text: newNote.trim() }];
    setNotes(updatedNotes);
    setNewNote('');
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Sticky Notes</ThemedText>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.note}>
            <ThemedText>{item.text}</ThemedText>
            <TouchableOpacity onPress={() => deleteNote(item.id)}>
              <ThemedText type="link">Delete</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
        ListEmptyComponent={<ThemedText>No notes available. Add a new note!</ThemedText>}
      />
      <TextInput
        style={styles.input}
        placeholder="Add a new note..."
        value={newNote}
        onChangeText={setNewNote}
      />
      <TouchableOpacity style={styles.addButton} onPress={addNote}>
        <ThemedText type="link">Add Note</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  note: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  addButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
});
