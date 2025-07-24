// Sample data for seeding Firestore (development purposes)
export const sampleNotes = [
  {
    title: "Engineering Mathematics-I",
    subject: "Mathematics",
    branch: "Computer Science",
    year: "1st",
    semester: "1st semester",
    price: 5,
    description: "Comprehensive notes covering calculus, linear algebra, and differential equations",
    ratings: [4, 5, 4, 5, 5],
    averageRating: 4.6,
    downloads: 210,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    title: "Basic Electrical Engineering",
    subject: "Electrical Engineering",
    branch: "Electrical Engineering", 
    year: "1st",
    semester: "1st semester",
    price: 5,
    description: "Fundamentals of electrical circuits, Ohm's law, and basic electrical components",
    ratings: [4, 4, 5, 4, 5],
    averageRating: 4.4,
    downloads: 190,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    title: "Data Structures",
    subject: "Computer Science",
    branch: "Computer Science",
    year: "2nd", 
    semester: "3rd semester",
    price: 5,
    description: "Complete guide to arrays, linked lists, stacks, queues, trees, and graphs",
    ratings: [5, 5, 4, 5, 5, 4, 5],
    averageRating: 4.7,
    downloads: 342,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    title: "Operating Systems",
    subject: "Computer Science", 
    branch: "Computer Science",
    year: "3rd",
    semester: "5th semester", 
    price: 5,
    description: "Process management, memory management, file systems, and synchronization",
    ratings: [5, 4, 5, 5, 4, 5, 5, 4],
    averageRating: 4.6,
    downloads: 390,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    title: "Database Management Systems",
    subject: "Computer Science",
    branch: "Information Technology",
    year: "3rd", 
    semester: "5th semester",
    price: 5,
    description: "SQL, normalization, transactions, indexing, and database design principles",
    ratings: [4, 5, 5, 4, 5, 4],
    averageRating: 4.5,
    downloads: 319,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  }
];

// Function to seed sample data (for development)
export const seedSampleData = async () => {
  const { createNote } = await import('../services/notesService');
  
  for (const note of sampleNotes) {
    try {
      await createNote(note, 'sample-seller-id');
      console.log(`Created note: ${note.title}`);
    } catch (error) {
      console.error(`Error creating note ${note.title}:`, error);
    }
  }
};