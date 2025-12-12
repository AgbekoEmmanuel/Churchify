import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  TextInput, 
  Alert,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

// Updated color palette
const colors = {
  primary: '#0E5686',
  primaryLight: '#417FC7',
  primaryDark: '#0A3E5E',
  secondary: '#0E8B86',
  background: '#F5F9FC',
  surface: '#FFFFFF',
  text: '#1B2445',
  textSecondary: '#57668E',
  textMuted: '#8A94B8',
  border: '#D1DAE8',
  accent: '#E8F0F7',
  success: '#0E8B86',
  danger: '#DC2626',
};

// ================= Notes List Screen =================
function NotesList({ navigation }) {
  const [notes, setNotes] = useState([]);

  // Load notes when screen mounts
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);
    return unsubscribe;
  }, [navigation]);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={s.noteCard}
      onPress={() => navigation.navigate('NoteDetail', { note: item })}
      activeOpacity={0.8}
    >
  <View style={s.noteHeader}>
  <Text style={s.noteTitle} numberOfLines={2}>
    {(item.title || '').trim() ? item.title : 'Untitled Note'}
  </Text>

  {/* Meta row: Date • Sermon Note */}
  <View style={s.noteMetaRow}>
    <View style={s.metaItem}>
      <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
      <Text style={s.noteDate}>{item.date}</Text>
    </View>

    <Text style={s.metaDot}>•</Text>

    <View style={s.metaItem}>
      <Ionicons name="book-outline" size={12} color={colors.textMuted} />
      <Text style={s.noteTypeInline}>Sermon Note</Text>
    </View>
  </View>
</View>

{item.details && (
  <Text style={s.notePreview} numberOfLines={3}>
    {item.details}
  </Text>
)}

<View style={s.noteFooter}>
  {/* Optional: keep chip, or remove if using inline meta */}
  <View style={s.noteTypeChip}>
    <Ionicons name="location-outline" size={12} color={colors.primary} />
    <Text style={s.noteTypeText}>Church</Text>
  </View>
  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
</View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={s.emptyState}>
      <View style={s.emptyIconContainer}>
        <LinearGradient
          colors={[colors.primaryLight, colors.primary]}
          style={s.emptyIconGradient}
        >
          <Ionicons name="document-text-outline" size={48} color="#FFFFFF" />
        </LinearGradient>
      </View>
      <Text style={s.emptyTitle}>No Sermon Notes Yet</Text>
      <Text style={s.emptySubtitle}>
        Start taking notes during sermons to remember key insights and spiritual moments
      </Text>
      <TouchableOpacity
        style={s.emptyActionButton}
        onPress={() => navigation.navigate('AddNote')}
      >
        <Text style={s.emptyActionText}>Create Your First Note</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
   <View style={s.headerRow}>
  <TouchableOpacity
    style={s.headerBack}
    onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={22} color="#0E5686" />
  </TouchableOpacity>
  <Text style={s.headerTitle}>Notes</Text>
  <TouchableOpacity
    style={s.addButton}
    onPress={() => navigation.navigate('AddNote')}>
    <LinearGradient
      colors={['#417FC7', '#0E5686']}
      style={s.addButtonGradient}
    >
      <Ionicons name="add" size={18} color="#FFFFFF" />
    </LinearGradient>
  </TouchableOpacity>
</View>


      {/* Content */}
      <View style={s.content}>
        {notes.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={renderNote}
            contentContainerStyle={s.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ================= Add Note Screen =================
function AddNote({ navigation }) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  const saveNote = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a note title.');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title: title.trim(),
      details: details.trim(),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
    };

    try {
      const existingNotes = await AsyncStorage.getItem('notes');
      const notes = existingNotes ? JSON.parse(existingNotes) : [];
      notes.unshift(newNote);
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={s.addHeader}>
        <TouchableOpacity
          style={s.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.addHeaderTitle}>New Sermon Note</Text>
        <TouchableOpacity style={s.saveButton} onPress={saveNote}>
          <Text style={s.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <ScrollView style={s.addContent} showsVerticalScrollIndicator={false}>
        <View style={s.inputContainer}>
          <Text style={s.inputLabel}>Sermon Title</Text>
          <TextInput
            style={s.titleInput}
            placeholder="Enter sermon title..."
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
        </View>

        <View style={s.inputContainer}>
          <Text style={s.inputLabel}>Notes & Insights</Text>
          <TextInput
            style={s.detailsInput}
            placeholder="Write your notes, key insights, and reflections..."
            placeholderTextColor={colors.textMuted}
            value={details}
            onChangeText={setDetails}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Quick Tips */}
        <View style={s.tipsContainer}>
          <Text style={s.tipsTitle}>💡 Quick Tips</Text>
          <Text style={s.tipsText}>• Note key Bible verses mentioned</Text>
          <Text style={s.tipsText}>• Write down main points and takeaways</Text>
          <Text style={s.tipsText}>• Record personal reflections and applications</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ================= Note Detail Screen =================
function NoteDetail({ route, navigation }) {
  const { note } = route.params || {};

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={s.detailHeader}>
        <TouchableOpacity
          style={s.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.detailHeaderTitle}>Note Details</Text>
        <TouchableOpacity style={s.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={s.detailContent} showsVerticalScrollIndicator={false}>
        <View style={s.noteMetaInfo}>
          <View style={s.noteDateChip}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <Text style={s.noteDateChipText}>{note?.date}</Text>
          </View>
        </View>

        <Text style={s.detailTitle}>{note?.title}</Text>
        
        {note?.details && (
          <View style={s.detailNotesContainer}>
            <Text style={s.detailNotesLabel}>Notes & Insights</Text>
            <Text style={s.detailNotesText}>{note.details}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ================= Stack Export =================
export default function NotesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
  name="NotesList"
  component={NotesList}
  options={({ navigation }) => ({
    title: 'Notes', // Change header title to "Notes"
    headerLeft: () => (
      <TouchableOpacity
        style={{
          marginLeft: 16,
          backgroundColor: '#E8F0F7',
          borderRadius: 20,
          padding: 6,
        }}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#0E5686" />
      </TouchableOpacity>
    ),
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: '#F5F9FC',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      color: '#0E5686',
      fontWeight: '800',
      fontSize: 22,
    },
  })}
/>

      <Stack.Screen name="AddNote" component={AddNote} />
      <Stack.Screen name="NoteDetail" component={NoteDetail} />
    </Stack.Navigator>
  );
}

// ================= Styles =================
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Notes List Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
    paddingBottom: 20,
  },

  headerContent: {
    flex: 1,
  },

 headerTitle: {
  fontSize: 22,
  color: '#0E5686',
  fontWeight: '800',
  flex: 1,
  textAlign: 'center',
  marginLeft: -32, // Ensure real center with left icon
},

  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },

  
headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 8,
  paddingBottom: 8,
  backgroundColor: '#F5F9FC',
},

headerBack: {
  backgroundColor: '#E8F0F7',
  borderRadius: 20,
  padding: 6,
},


  addButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginLeft: 8,
  },

addButtonGradient: {
  width: 36,
  height: 36,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
},

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  listContent: {
    paddingBottom: 100,
  },

  noteCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  noteHeader: {
    marginBottom: 8,
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },

  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  noteDate: {
    fontSize: 12,
    color: colors.textMuted,
  },

  notePreview: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },

  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  noteTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },

  noteTypeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  emptyIconContainer: {
    marginBottom: 24,
  },

  emptyIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },

  emptyActionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  emptyActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Add Note Styles
  addHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  addContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  inputContainer: {
    marginTop: 24,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },

  titleInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },

  detailsInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    height: 200,
  },

  tipsContainer: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 40,
  },

  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },

  tipsText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },

  // Detail Styles
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  moreButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  noteMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },

  noteDateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },

  noteDateChipText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },

  detailTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 32,
    marginBottom: 24,
  },

  detailNotesContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  detailNotesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  detailNotesText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  noteMetaRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 2,
},
metaItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
},
metaDot: {
  marginHorizontal: 8,
  color: colors.textMuted,
  fontSize: 12,
},
noteTypeInline: {
  fontSize: 12,
  color: colors.textMuted,
},

});
