// Custom hooks for Firestore operations
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  onSnapshot as onDocSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Hook to listen to real-time collection updates
export const useCollection = (collectionName, queryConstraints = []) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q = collection(db, collectionName);
    
    if (queryConstraints.length > 0) {
      q = query(q, ...queryConstraints);
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = [];
        snapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        setDocuments(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(queryConstraints)]);

  return { documents, loading, error };
};

// Hook to listen to real-time document updates
export const useDocument = (collectionName, documentId) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) {
      setDocument(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionName, documentId);
    
    const unsubscribe = onDocSnapshot(docRef,
      (doc) => {
        if (doc.exists()) {
          setDocument({ id: doc.id, ...doc.data() });
        } else {
          setDocument(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Firestore document error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, documentId]);

  return { document, loading, error };
};

// Hook for filtered notes
export const useNotes = (filters = {}) => {
  const queryConstraints = [];
  
  if (filters.year) {
    queryConstraints.push(where('year', '==', filters.year));
  }
  if (filters.branch) {
    queryConstraints.push(where('branch', '==', filters.branch));
  }
  if (filters.semester) {
    queryConstraints.push(where('semester', '==', filters.semester));
  }
  
  queryConstraints.push(orderBy('createdAt', 'desc'));
  
  return useCollection('notes', queryConstraints);
};