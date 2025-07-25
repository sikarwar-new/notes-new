// Admin service functions for managing notes and users
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  addDoc
} from "firebase/firestore";
import { db } from "../config/firebase";

// Check if user is admin
export const isAdmin = (userEmail) => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  return userEmail === adminEmail;
};

// Get all pending notes for approval
export const getPendingNotes = async () => {
  try {
    const notesRef = collection(db, 'notes');
    const q = query(notesRef, where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    
    return { notes, error: null };
  } catch (error) {
    console.error('Error getting pending notes:', error);
    return { notes: [], error: error.message };
  }
};

// Get all notes (approved, pending, rejected)
export const getAllNotesAdmin = async () => {
  try {
    const notesRef = collection(db, 'notes');
    const q = query(notesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    
    return { notes, error: null };
  } catch (error) {
    console.error('Error getting all notes:', error);
    return { notes: [], error: error.message };
  }
};

// Approve a note
export const approveNote = async (noteId) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      status: 'approved',
      approvedAt: new Date(),
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error) {
    console.error('Error approving note:', error);
    return { error: error.message };
  }
};

// Reject a note
export const rejectNote = async (noteId, reason = '') => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      status: 'rejected',
      rejectionReason: reason,
      rejectedAt: new Date(),
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error) {
    console.error('Error rejecting note:', error);
    return { error: error.message };
  }
};

// Delete a note (admin only)
export const deleteNoteAdmin = async (noteId) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
    return { error: null };
  } catch (error) {
    console.error('Error deleting note:', error);
    return { error: error.message };
  }
};

// Create note as admin
export const createNoteAdmin = async (noteData) => {
  try {
    const notesRef = collection(db, 'notes');
    const docRef = await addDoc(notesRef, {
      ...noteData,
      status: 'approved',
      sellerId: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      approvedAt: new Date(),
      downloads: 0,
      ratings: [],
      averageRating: 0
    });
    
    return { noteId: docRef.id, error: null };
  } catch (error) {
    console.error('Error creating note as admin:', error);
    return { noteId: null, error: error.message };
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return { users, error: null };
  } catch (error) {
    console.error('Error getting all users:', error);
    return { users: [], error: error.message };
  }
};

// Update user upload approval status
export const updateUserUploadStatus = async (userId, status) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      uploadApprove: status,
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error) {
    console.error('Error updating user upload status:', error);
    return { error: error.message };
  }
};