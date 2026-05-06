import mongoose from "mongoose";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
require("dotenv").config();

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    isverified: true,
  },
  {
    name: "Student User",
    email: "student@example.com",
    password: "password123",
    role: "user",
    isverified: true,
  },
];

const courses = [
  {
    name: "Full Stack Web Development with React & Node",
    description: "Master modern web development from scratch. This comprehensive course covers everything from HTML/CSS to advanced Node.js and MongoDB architecture.",
    category: "Web Development",
    price: 49,
    estimatedPrice: 99,
    thumbnail: {
      public_id: "seed/course1",
      url: "https://res.cloudinary.com/dmnwypzze/image/upload/v1698206512/course1.jpg",
    },
    tags: "React, Node, Express, MongoDB, Fullstack",
    level: "Beginner to Advanced",
    demoUrl: "https://www.youtube.com/watch?v=gvP6iG5Nf_A",
    benefits: [
      { title: "Build real-world projects" },
      { title: "Master MERN stack" },
      { title: "Deployment and DevOps basics" },
    ],
    prerequisites: [
      { title: "Basic computer knowledge" },
      { title: "Passion for learning" },
    ],
    ratings: 4.8,
    purchased: 150,
    courseData: [
      {
        title: "Introduction to Web Development",
        description: "Learn how the web works and set up your environment.",
        videoUrl: "https://www.youtube.com/watch?v=gvP6iG5Nf_A",
        videoSection: "Module 1: Basics",
        videoLength: 15,
        videoPlayer: "youtube",
        links: [{ title: "Documentation", url: "https://developer.mozilla.org" }],
        suggestion: "Take notes on HTTP methods.",
      },
      {
        title: "HTML & CSS Deep Dive",
        description: "Building layouts with modern CSS Grid and Flexbox.",
        videoUrl: "https://www.youtube.com/watch?v=gvP6iG5Nf_A",
        videoSection: "Module 1: Basics",
        videoLength: 45,
        videoPlayer: "youtube",
        links: [{ title: "CSS Tricks", url: "https://css-tricks.com" }],
        suggestion: "Try building a card layout.",
      },
    ],
  },
  {
    name: "Advanced Python for Data Science",
    description: "Deep dive into Python libraries like Pandas, NumPy, and Scikit-Learn. Perfect for developers moving into AI and Data Science.",
    category: "Data Science",
    price: 79,
    estimatedPrice: 149,
    thumbnail: {
      public_id: "seed/course2",
      url: "https://res.cloudinary.com/dmnwypzze/image/upload/v1698206512/course2.jpg",
    },
    tags: "Python, Data Science, AI, Machine Learning",
    level: "Intermediate",
    demoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    benefits: [
      { title: "Analyze large datasets" },
      { title: "Build predictive models" },
      { title: "Advanced data visualization" },
    ],
    prerequisites: [
      { title: "Basic Python knowledge" },
      { title: "Linear Algebra basics" },
    ],
    ratings: 4.9,
    purchased: 85,
    courseData: [
      {
        title: "Data Analysis with Pandas",
        description: "Efficiently manipulating large CSV files.",
        videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        videoSection: "Data Processing",
        videoLength: 60,
        videoPlayer: "youtube",
        links: [{ title: "Pandas Docs", url: "https://pandas.pydata.org" }],
        suggestion: "Practice with the Titanic dataset.",
      },
    ],
  },
  {
    name: "UI/UX Design Masterclass",
    description: "Learn Figma, Adobe XD, and the principles of user-centered design. From wireframing to high-fidelity prototyping.",
    category: "Design",
    price: 39,
    estimatedPrice: 79,
    thumbnail: {
      public_id: "seed/course3",
      url: "https://res.cloudinary.com/dmnwypzze/image/upload/v1698206512/course3.jpg",
    },
    tags: "UI, UX, Figma, Design, Branding",
    level: "All Levels",
    demoUrl: "https://www.youtube.com/watch?v=c9Wg6W_IT4Q",
    benefits: [
      { title: "Create stunning user interfaces" },
      { title: "Master prototyping in Figma" },
      { title: "Understand user psychology" },
    ],
    prerequisites: [
      { title: "No prior design experience needed" },
    ],
    ratings: 4.7,
    purchased: 210,
    courseData: [
      {
        title: "Figma Basics",
        description: "Setting up your first project in Figma.",
        videoUrl: "https://www.youtube.com/watch?v=c9Wg6W_IT4Q",
        videoSection: "Design Tools",
        videoLength: 30,
        videoPlayer: "youtube",
        links: [{ title: "Figma Community", url: "https://figma.com/community" }],
        suggestion: "Follow along with the login screen tutorial.",
      },
    ],
  },
];

const seed = async () => {
  try {
    const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/lms_local";
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB for seeding.");

    // Seed Users
    for (const u of users) {
      const existing = await userModel.findOne({ email: u.email });
      if (!existing) {
        await userModel.create(u);
        console.log(`👤 Seeded user: ${u.email}`);
      } else {
        console.log(`⏭️ User ${u.email} already exists.`);
      }
    }

    // Seed Courses
    for (const c of courses) {
      const existing = await CourseModel.findOne({ name: c.name });
      if (!existing) {
        await CourseModel.create(c);
        console.log(`📚 Seeded course: ${c.name}`);
      } else {
        console.log(`⏭️ Course ${c.name} already exists.`);
      }
    }

    console.log("✨ Seeding completed successfully!");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
