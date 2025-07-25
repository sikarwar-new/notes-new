// Notes service functions for Firestore operations
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "../config/firebase";

// Get all notes
export const getAllNotes = async (includeStatus = 'approved') => {
  try {
    const notesRef = collection(db, 'notes');
    let q = query(notesRef);
    
    // Only show approved notes to regular users
    if (includeStatus) {
      q = query(q, where('status', '==', includeStatus), orderBy('createdAt', 'desc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    
    return { notes, error: null };
  } catch (error) {
    console.error('Error getting notes:', error);
    return { notes: [], error: error.message };
  }
};

// Get notes by filters
export const getNotesByFilter = async (filters = {}, includeStatus = 'approved') => {
  try {
    const notesRef = collection(db, 'notes');
    let q = query(notesRef);
    
    // Only show approved notes to regular users
    if (includeStatus) {
      q = query(q, where('status', '==', includeStatus));
    }
    
    // Apply filters
    if (filters.year) {
      q = query(q, where('year', '==', filters.year));
    }
    if (filters.branch) {
      q = query(q, where('branch', '==', filters.branch));
    }
    if (filters.semester) {
      q = query(q, where('semester', '==', filters.semester));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    
    return { notes, error: null };
  } catch (error) {
    console.error('Error getting filtered notes:', error);
    return { notes: [], error: error.message };
  }
};

// Get user's accessed notes
export const getUserAccessedNotes = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { notes: [], error: 'User not found' };
    }
    
    const userData = userSnap.data();
    const accessedNoteIds = userData.resourcesAccessed || [];
    
    if (accessedNoteIds.length === 0) {
      return { notes: [], error: null };
    }
    
    // Get all accessed notes
    const notes = [];
    for (const noteId of accessedNoteIds) {
      const noteRef = doc(db, 'notes', noteId);
      const noteSnap = await getDoc(noteRef);
      if (noteSnap.exists()) {
        notes.push({ id: noteSnap.id, ...noteSnap.data() });
      }
    }
    
    return { notes, error: null };
  } catch (error) {
    console.error('Error getting user accessed notes:', error);
    return { notes: [], error: error.message };
  }
};

// Add note to user's accessed list
export const addNoteToUserAccessed = async (userId, noteId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      resourcesAccessed: arrayUnion(noteId),
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error) {
    console.error('Error adding note to user accessed:', error);
    return { error: error.message };
  }
};

// Create a new note (for sellers)
export const createNote = async (noteData, userId, status = 'pending') => {
  try {
    const notesRef = collection(db, 'notes');
    const docRef = await addDoc(notesRef, {
      ...noteData,
      sellerId: userId,
      status: status,
      createdAt: new Date(),
      updatedAt: new Date(),
      downloads: 0,
      ratings: [],
      averageRating: 0
    });
    
    return { noteId: docRef.id, error: null };
  } catch (error) {
    console.error('Error creating note:', error);
    return { noteId: null, error: error.message };
  }
};

// Update note
export const updateNote = async (noteId, updateData) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error) {
    console.error('Error updating note:', error);
    return { error: error.message };
  }
};

// Delete note
export const deleteNote = async (noteId) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
    return { error: null };
  } catch (error) {
    console.error('Error deleting note:', error);
    return { error: error.message };
  }
};