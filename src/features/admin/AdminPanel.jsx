import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { isAdmin, getPendingNotes, getAllNotesAdmin, approveNote, rejectNote, deleteNoteAdmin, createNoteAdmin, getAllUsers, updateUserUploadStatus } from "../../services/adminService";
import { Navigate } from "react-router-dom";

function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingNotes, setPendingNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  // New note form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    subject: '',
    branch: '',
    year: '',
    semester: '',
    price: '',
    description: '',
    driveLink: ''
  });

  // Check if user is admin
  if (!user || !isAdmin(user.email)) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [pendingResult, allNotesResult, usersResult] = await Promise.all([
      getPendingNotes(),
      getAllNotesAdmin(),
      getAllUsers()
    ]);
    
    setPendingNotes(pendingResult.notes);
    setAllNotes(allNotesResult.notes);
    setUsers(usersResult.users);
    setLoading(false);
  };

  const handleApprove = async (noteId) => {
    setActionLoading(noteId);
    const { error } = await approveNote(noteId);
    if (!error) {
      await fetchData();
    }
    setActionLoading(null);
  };

  const handleReject = async (noteId) => {
    const reason = prompt("Enter rejection reason (optional):");
    setActionLoading(noteId);
    const { error } = await rejectNote(noteId, reason);
    if (!error) {
      await fetchData();
    }
    setActionLoading(null);
  };

  const handleDelete = async (noteId) => {
    if (confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      setActionLoading(noteId);
      const { error } = await deleteNoteAdmin(noteId);
      if (!error) {
        await fetchData();
      }
      setActionLoading(null);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setActionLoading('create');
    
    const { error } = await createNoteAdmin({
      ...newNote,
      price: parseFloat(newNote.price)
    });
    
    if (!error) {
      setNewNote({
        title: '',
        subject: '',
        branch: '',
        year: '',
        semester: '',
        price: '',
        description: '',
        driveLink: ''
      });
      setShowCreateForm(false);
      await fetchData();
    }
    setActionLoading(null);
  };

  const handleUserUploadStatus = async (userId, status) => {
    setActionLoading(userId);
    const { error } = await updateUserUploadStatus(userId, status);
    if (!error) {
      await fetchData();
    }
    setActionLoading(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Welcome, {user.displayName || user.email}</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'pending', label: 'Pending Notes', count: pendingNotes.length },
                { id: 'all-notes', label: 'All Notes', count: allNotes.length },
                { id: 'users', label: 'Users', count: users.length },
                { id: 'create', label: 'Create Note', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'pending' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Pending Notes for Approval</h2>
              {pendingNotes.length === 0 ? (
                <p className="text-gray-500">No pending notes to review.</p>
              ) : (
                <div className="space-y-4">
                  {pendingNotes.map((note) => (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium">{note.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(note.status)}`}>
                          {note.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div><strong>Subject:</strong> {note.subject}</div>
                        <div><strong>Branch:</strong> {note.branch}</div>
                        <div><strong>Year:</strong> {note.year}</div>
                        <div><strong>Semester:</strong> {note.semester}</div>
                        <div><strong>Price:</strong> ₹{note.price}</div>
                        <div><strong>Submitted:</strong> {new Date(note.createdAt?.toDate()).toLocaleDateString()}</div>
                      </div>
                      <p className="text-gray-700 mb-3">{note.description}</p>
                      {note.driveLink && (
                        <div className="mb-3">
                          <a 
                            href={note.driveLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            📄 View Google Drive Link
                          </a>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(note.id)}
                          disabled={actionLoading === note.id}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                        >
                          {actionLoading === note.id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(note.id)}
                          disabled={actionLoading === note.id}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'all-notes' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">All Notes</h2>
              <div className="space-y-4">
                {allNotes.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium">{note.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(note.status)}`}>
                          {note.status}
                        </span>
                        <button
                          onClick={() => handleDelete(note.id)}
                          disabled={actionLoading === note.id}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div><strong>Subject:</strong> {note.subject}</div>
                      <div><strong>Branch:</strong> {note.branch}</div>
                      <div><strong>Downloads:</strong> {note.downloads || 0}</div>
                      <div><strong>Price:</strong> ₹{note.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-medium">{user.displayName || 'No Name'}</h3>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.uploadApprove === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Upload: {user.uploadApprove}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <div><strong>Joined:</strong> {new Date(user.createdAt?.toDate()).toLocaleDateString()}</div>
                      <div><strong>Notes Accessed:</strong> {user.resourcesAccessed?.length || 0}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUserUploadStatus(user.id, 'yes')}
                        disabled={actionLoading === user.id}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                      >
                        Approve Upload
                      </button>
                      <button
                        onClick={() => handleUserUploadStatus(user.id, 'no')}
                        disabled={actionLoading === user.id}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                      >
                        Deny Upload
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Create New Note</h2>
              <form onSubmit={handleCreateNote} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newNote.title}
                      onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={newNote.subject}
                      onChange={(e) => setNewNote({...newNote, subject: e.target.value})}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <select
                      required
                      value={newNote.branch}
                      onChange={(e) => setNewNote({...newNote, branch: e.target.value})}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Branch</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select
                      required
                      value={newNote.year}
                      onChange={(e) => setNewNote({...newNote, year: e.target.value})}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Year</option>
                      <option value="1st">1st</option>
                      <option value="2nd">2nd</option>
                      <option value="3rd">3rd</option>
                      <option value="4th">4th</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select
                      required
                      value={newNote.semester}
                      onChange={(e) => setNewNote({...newNote, semester: e.target.value})}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Semester</option>
                      <option value="1st semester">1st Semester</option>
                      <option value="2nd semester">2nd Semester</option>
                      <option value="3rd semester">3rd Semester</option>
                      <option value="4th semester">4th Semester</option>
                      <option value="5th semester">5th Semester</option>
                      <option value="6th semester">6th Semester</option>
                      <option value="7th semester">7th Semester</option>
                      <option value="8th semester">8th Semester</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newNote.price}
                      onChange={(e) => setNewNote({...newNote, price: e.target.value})}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows="3"
                    value={newNote.description}
                    onChange={(e) => setNewNote({...newNote, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Drive Link</label>
                  <input
                    type="url"
                    required
                    value={newNote.driveLink}
                    onChange={(e) => setNewNote({...newNote, driveLink: e.target.value})}
                    placeholder="https://drive.google.com/..."
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={actionLoading === 'create'}
                  className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50"
                >
                  {actionLoading === 'create' ? 'Creating...' : 'Create Note'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;