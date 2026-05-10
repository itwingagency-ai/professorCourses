import mongoose from "mongoose";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import dotenv from "dotenv";

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    isVerified: true,
  },
  {
    name: "Teacher John",
    email: "teacher@example.com",
    password: "password123",
    role: "teacher",
    isVerified: true,
  },
  {
    name: "Student Alice",
    email: "student@example.com",
    password: "password123",
    role: "student",
    isVerified: true,
  },
];

const createReview = (name: string, rating: number, comment: string) => ({
  user: { name, email: `${name.toLowerCase().replace(" ", "")}@example.com` },
  rating,
  comment,
  commentReplies: [],
});

const createQuestion = (name: string, question: string) => ({
  user: { name, email: `${name.toLowerCase().replace(" ", "")}@example.com` },
  question,
  questionReplies: [],
});

const courses = [
  {
    name: "Full Stack Web Development with React & Node",
    description: "Master modern web development from scratch. This comprehensive course covers everything from HTML/CSS to advanced Node.js and MongoDB architecture.",
    category: "Web Development",
    price: 49,
    estimatedPrice: 99,
    thumbnail: {
      public_id: "seed/course1",
      url: "https://picsum.photos/seed/course1/800/600",
    },
    tags: "React, Node, Express, MongoDB, Fullstack",
    level: "Beginner to Advanced",
    demoUrl: "https://www.youtube.com/watch?v=gvP6iG5Nf_A",
    benefits: [
      { title: "Build real-world projects" },
      { title: "Master MERN stack" },
      { title: "Deployment and DevOps basics" },
      { title: "RESTful API Design" },
      { title: "Authentication and Authorization" }
    ],
    prerequisites: [
      { title: "Basic computer knowledge" },
      { title: "Passion for learning" },
      { title: "A text editor (VS Code recommended)" }
    ],
    ratings: 4.8,
    purchased: 1520,
    reviews: [
      createReview("Sarah Jenkins", 5, "Amazing course! Helped me land my first developer job."),
      createReview("Michael Chen", 4.5, "Great content, but pacing was a bit fast in the Node.js section."),
      createReview("Emily Brown", 5, "The best web dev course out there. Highly recommended!")
    ],
    courseData: [
      {
        title: "Introduction to Web Development",
        description: "Learn how the web works and set up your environment.",
        videoUrl: "https://www.youtube.com/watch?v=gvP6iG5Nf_A",
        videoSection: "Module 1: Basics",
        videoLength: 15,
        videoPlayer: "youtube",
        links: [{ title: "MDN Web Docs", url: "https://developer.mozilla.org" }],
        suggestion: "Take notes on HTTP methods.",
        questions: [createQuestion("David M", "Do I need to install Node right away?")]
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
        questions: []
      },
      {
        title: "JavaScript Fundamentals",
        description: "Variables, loops, functions, and DOM manipulation.",
        videoUrl: "https://www.youtube.com/watch?v=gvP6iG5Nf_A",
        videoSection: "Module 2: JavaScript",
        videoLength: 60,
        videoPlayer: "youtube",
        links: [{ title: "Javascript.info", url: "https://javascript.info" }],
        suggestion: "Practice writing loops.",
        questions: []
      },
      {
        title: "React Components and State",
        description: "Building interactive UIs with React.",
        videoUrl: "https://www.youtube.com/watch?v=gvP6iG5Nf_A",
        videoSection: "Module 3: Frontend",
        videoLength: 55,
        videoPlayer: "youtube",
        links: [{ title: "React Docs", url: "https://react.dev" }],
        suggestion: "Understand the component lifecycle.",
        questions: [createQuestion("Alice S", "When should I use useState vs useReducer?")]
      }
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
      url: "https://picsum.photos/seed/course2/800/600",
    },
    tags: "Python, Data Science, AI, Machine Learning",
    level: "Intermediate",
    demoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    benefits: [
      { title: "Analyze large datasets" },
      { title: "Build predictive models" },
      { title: "Advanced data visualization" },
      { title: "Statistical analysis" }
    ],
    prerequisites: [
      { title: "Basic Python knowledge" },
      { title: "Linear Algebra basics" },
    ],
    ratings: 4.9,
    purchased: 850,
    reviews: [
      createReview("Robert Fox", 5, "Very detailed and practical."),
      createReview("Jane Doe", 4.8, "The Pandas section is phenomenal."),
    ],
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
        questions: []
      },
      {
        title: "Data Visualization with Matplotlib & Seaborn",
        description: "Creating insightful charts and graphs.",
        videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        videoSection: "Data Processing",
        videoLength: 50,
        videoPlayer: "youtube",
        links: [{ title: "Seaborn Gallery", url: "https://seaborn.pydata.org/examples/index.html" }],
        suggestion: "Try reproducing a chart from a news article.",
        questions: []
      },
      {
        title: "Intro to Machine Learning",
        description: "Understanding supervised vs unsupervised learning.",
        videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        videoSection: "Machine Learning",
        videoLength: 75,
        videoPlayer: "youtube",
        links: [],
        suggestion: "Review linear regression.",
        questions: [createQuestion("Tom B", "Is deep learning covered here?")]
      }
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
      url: "https://picsum.photos/seed/course3/800/600",
    },
    tags: "UI, UX, Figma, Design, Branding",
    level: "All Levels",
    demoUrl: "https://www.youtube.com/watch?v=c9Wg6W_IT4Q",
    benefits: [
      { title: "Create stunning user interfaces" },
      { title: "Master prototyping in Figma" },
      { title: "Understand user psychology" },
      { title: "Design systems creation" }
    ],
    prerequisites: [
      { title: "No prior design experience needed" },
    ],
    ratings: 4.7,
    purchased: 2100,
    reviews: [
      createReview("Lisa Wong", 5, "Figma tutorials are top notch."),
      createReview("Mark Smith", 4.5, "Good theory, could use more hands-on exercises."),
    ],
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
        questions: []
      },
      {
        title: "Color Theory & Typography",
        description: "Choosing the right colors and fonts for your design.",
        videoUrl: "https://www.youtube.com/watch?v=c9Wg6W_IT4Q",
        videoSection: "Design Principles",
        videoLength: 40,
        videoPlayer: "youtube",
        links: [{ title: "Coolors", url: "https://coolors.co" }],
        suggestion: "Create a mood board.",
        questions: []
      },
      {
        title: "Prototyping & Animation",
        description: "Adding interactions to your designs.",
        videoUrl: "https://www.youtube.com/watch?v=c9Wg6W_IT4Q",
        videoSection: "Advanced Design",
        videoLength: 55,
        videoPlayer: "youtube",
        links: [],
        suggestion: "Prototype a user flow for an app.",
        questions: []
      }
    ],
  },
  {
    name: "Complete Flutter & Dart Mobile App Development",
    description: "Build beautiful, fast, native-quality apps for iOS and Android with a single codebase using Google's Flutter framework.",
    category: "Mobile Dev",
    price: 59,
    estimatedPrice: 119,
    thumbnail: {
      public_id: "seed/course4",
      url: "https://picsum.photos/seed/course4/800/600",
    },
    tags: "Flutter, Dart, Mobile, iOS, Android",
    level: "Beginner to Advanced",
    demoUrl: "https://www.youtube.com/watch?v=x0uigEPIW4U",
    benefits: [
      { title: "Build iOS and Android apps" },
      { title: "Master Dart programming" },
      { title: "State management with Provider/Riverpod" },
      { title: "Firebase integration" }
    ],
    prerequisites: [
      { title: "Basic programming knowledge" },
    ],
    ratings: 4.8,
    purchased: 1250,
    reviews: [
      createReview("Ahmed K", 5, "The best Flutter course. Covered everything."),
      createReview("Julia R", 4.7, "Firebase section was super helpful.")
    ],
    courseData: [
      {
        title: "Introduction to Dart",
        description: "Learn the basics of the Dart language.",
        videoUrl: "https://www.youtube.com/watch?v=x0uigEPIW4U",
        videoSection: "Dart Basics",
        videoLength: 45,
        videoPlayer: "youtube",
        links: [{ title: "Dartpad", url: "https://dartpad.dev/" }],
        suggestion: "Practice writing basic functions in Dartpad.",
        questions: []
      },
      {
        title: "Building the UI",
        description: "Working with Widgets in Flutter.",
        videoUrl: "https://www.youtube.com/watch?v=x0uigEPIW4U",
        videoSection: "Flutter Basics",
        videoLength: 60,
        videoPlayer: "youtube",
        links: [],
        suggestion: "Try recreating a popular app's UI.",
        questions: []
      },
      {
        title: "State Management",
        description: "Managing app state using Provider.",
        videoUrl: "https://www.youtube.com/watch?v=x0uigEPIW4U",
        videoSection: "Advanced Flutter",
        videoLength: 50,
        videoPlayer: "youtube",
        links: [],
        suggestion: "Implement a simple counter app with Provider.",
        questions: []
      }
    ],
  },
  {
    name: "DevOps Bootcamp: Docker, Kubernetes & CI/CD",
    description: "Learn the modern DevOps toolchain. Containerize applications with Docker, orchestrate with Kubernetes, and automate with Jenkins/GitHub Actions.",
    category: "DevOps",
    price: 89,
    estimatedPrice: 199,
    thumbnail: {
      public_id: "seed/course5",
      url: "https://picsum.photos/seed/course5/800/600",
    },
    tags: "DevOps, Docker, Kubernetes, CI/CD",
    level: "Intermediate",
    demoUrl: "https://www.youtube.com/watch?v=kTp5xUtcalw",
    benefits: [
      { title: "Containerize apps with Docker" },
      { title: "Deploy clusters with Kubernetes" },
      { title: "Set up CI/CD pipelines" },
      { title: "Infrastructure as Code" }
    ],
    prerequisites: [
      { title: "Basic Linux terminal commands" },
      { title: "Understanding of web applications" }
    ],
    ratings: 4.6,
    purchased: 920,
    reviews: [
      createReview("Chris Evans", 5, "Finally understood Kubernetes!"),
    ],
    courseData: [
      {
        title: "Docker Fundamentals",
        description: "Images, containers, and Dockerfiles.",
        videoUrl: "https://www.youtube.com/watch?v=kTp5xUtcalw",
        videoSection: "Docker",
        videoLength: 55,
        videoPlayer: "youtube",
        links: [{ title: "Docker Docs", url: "https://docs.docker.com/" }],
        suggestion: "Dockerize a simple Node.js app.",
        questions: []
      },
      {
        title: "Introduction to Kubernetes",
        description: "Pods, Deployments, and Services.",
        videoUrl: "https://www.youtube.com/watch?v=kTp5xUtcalw",
        videoSection: "Kubernetes",
        videoLength: 70,
        videoPlayer: "youtube",
        links: [{ title: "Minikube", url: "https://minikube.sigs.k8s.io/" }],
        suggestion: "Set up Minikube locally.",
        questions: []
      },
      {
        title: "CI/CD with GitHub Actions",
        description: "Automating builds and tests.",
        videoUrl: "https://www.youtube.com/watch?v=kTp5xUtcalw",
        videoSection: "CI/CD",
        videoLength: 40,
        videoPlayer: "youtube",
        links: [],
        suggestion: "Create a simple workflow for a repo.",
        questions: []
      }
    ],
  },
  {
    name: "Artificial Intelligence for Everyone",
    description: "A non-technical introduction to AI, Deep Learning, and Neural Networks. Understand how AI is reshaping industries.",
    category: "AI/ML",
    price: 0,
    estimatedPrice: 49,
    thumbnail: {
      public_id: "seed/course6",
      url: "https://picsum.photos/seed/course6/800/600",
    },
    tags: "AI, Artificial Intelligence, Tech Trends",
    level: "Beginner",
    demoUrl: "https://www.youtube.com/watch?v=JMUxmLyrhSk",
    benefits: [
      { title: "Understand AI terminology" },
      { title: "Identify AI use cases" },
      { title: "Ethics in AI" }
    ],
    prerequisites: [
      { title: "No prior technical knowledge required" }
    ],
    ratings: 4.5,
    purchased: 5400,
    reviews: [
      createReview("Nancy Miller", 5, "Great overview for business leaders."),
    ],
    courseData: [
      {
        title: "What is AI?",
        description: "Defining AI, Machine Learning, and Deep Learning.",
        videoUrl: "https://www.youtube.com/watch?v=JMUxmLyrhSk",
        videoSection: "Introduction",
        videoLength: 20,
        videoPlayer: "youtube",
        links: [],
        suggestion: "Think of an AI application in your daily life.",
        questions: []
      },
      {
        title: "Building AI Projects",
        description: "The workflow of an AI project.",
        videoUrl: "https://www.youtube.com/watch?v=JMUxmLyrhSk",
        videoSection: "Workflow",
        videoLength: 30,
        videoPlayer: "youtube",
        links: [],
        suggestion: "List the steps to train a model.",
        questions: []
      }
    ],
  },
  {
    name: "Ethical Hacking & Cybersecurity",
    description: "Learn how to protect networks and applications by learning how to attack them. Hands-on penetration testing.",
    category: "Cybersecurity",
    price: 69,
    estimatedPrice: 129,
    thumbnail: {
      public_id: "seed/course7",
      url: "https://picsum.photos/seed/course7/800/600",
    },
    tags: "Security, Hacking, Cybersecurity",
    level: "Intermediate",
    demoUrl: "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
    benefits: [
      { title: "Perform vulnerability assessments" },
      { title: "Network sniffing and spoofing" },
      { title: "Web application penetration testing" },
      { title: "Secure systems" }
    ],
    prerequisites: [
      { title: "Basic networking knowledge" },
      { title: "Familiarity with Linux" }
    ],
    ratings: 4.8,
    purchased: 1100,
    reviews: [
      createReview("Kevin Mitnick", 5, "Solid foundation for beginners."),
    ],
    courseData: [
      {
        title: "Setting up a Lab",
        description: "Installing Kali Linux and Metasploitable.",
        videoUrl: "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
        videoSection: "Preparation",
        videoLength: 45,
        videoPlayer: "youtube",
        links: [{ title: "Kali Linux", url: "https://www.kali.org/" }],
        suggestion: "Ensure you use virtual machines.",
        questions: []
      },
      {
        title: "Network Scanning with Nmap",
        description: "Discovering hosts and open ports.",
        videoUrl: "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
        videoSection: "Scanning",
        videoLength: 50,
        videoPlayer: "youtube",
        links: [],
        suggestion: "Scan your local network.",
        questions: []
      },
      {
        title: "Web App Vulnerabilities (OWASP Top 10)",
        description: "SQLi, XSS, and CSRF.",
        videoUrl: "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
        videoSection: "Web Security",
        videoLength: 80,
        videoPlayer: "youtube",
        links: [{ title: "OWASP", url: "https://owasp.org/" }],
        suggestion: "Try practicing on a test vulnerable site.",
        questions: []
      }
    ],
  },
  {
    name: "AWS Certified Solutions Architect",
    description: "Prepare for the AWS Certified Solutions Architect Associate exam. Learn EC2, S3, RDS, VPC, and more.",
    category: "Cloud Computing",
    price: 99,
    estimatedPrice: 249,
    thumbnail: {
      public_id: "seed/course8",
      url: "https://picsum.photos/seed/course8/800/600",
    },
    tags: "AWS, Cloud, Certification",
    level: "Intermediate",
    demoUrl: "https://www.youtube.com/watch?v=3hLmDS179YE",
    benefits: [
      { title: "Pass the AWS CSA exam" },
      { title: "Design scalable architectures" },
      { title: "Manage AWS services" }
    ],
    prerequisites: [
      { title: "Basic IT knowledge" }
    ],
    ratings: 4.9,
    purchased: 2800,
    reviews: [
      createReview("Steve Jobs", 4.5, "Passed my exam thanks to this!"),
    ],
    courseData: [
      {
        title: "Identity and Access Management (IAM)",
        description: "Securing your AWS account.",
        videoUrl: "https://www.youtube.com/watch?v=3hLmDS179YE",
        videoSection: "Security",
        videoLength: 35,
        videoPlayer: "youtube",
        links: [],
        suggestion: "Create an IAM user for yourself.",
        questions: []
      },
      {
        title: "Elastic Compute Cloud (EC2)",
        description: "Virtual servers in the cloud.",
        videoUrl: "https://www.youtube.com/watch?v=3hLmDS179YE",
        videoSection: "Compute",
        videoLength: 65,
        videoPlayer: "youtube",
        links: [],
        suggestion: "Launch a simple web server on EC2.",
        questions: []
      },
      {
        title: "Simple Storage Service (S3)",
        description: "Object storage basics.",
        videoUrl: "https://www.youtube.com/watch?v=3hLmDS179YE",
        videoSection: "Storage",
        videoLength: 40,
        videoPlayer: "youtube",
        links: [],
        suggestion: "Host a static website on S3.",
        questions: []
      }
    ],
  }
];

const seed = async () => {
  try {
    const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/projectdb";
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
