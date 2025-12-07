// backend/seed_all_data.js

const connectDB = require("../database/config/connection");
const Course = require("../database/models/Course");
const mongoose = require("mongoose");

// --- 1. Define the Initial Scraped Data ---
const initialScrapedData = {
  cs: [
    {
      courseCode: "CS0007",
      courseLevel: "Undergraduate",
      courseName: "INTRODUCTION TO COMPUTER PROGRAMMING",
      department: "CS",
      credits: 3,
      description:
        "This is a first course in computer science programming. It is recommended for those students intending to major in computer science who do not have the required background for the School of Computing and Information's intermediate programming class. It may also be of interest to students majoring in one of the social sciences or humanities. The focus of the course is on problem analysis and the development of algorithms and computer programs in a modern high-level language.",
      prerequisites: [],
      professors: [
        "Timothy Hoffman",
        "Michael Devine",
        "Andrew Xu",
        "Donald Bonidie",
        "Matt de Lima Barbosa",
        "William Garrard",
      ],
      usefulness: {
        requiredFor: ["CS0401"],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "CS0441",
      courseLevel: "Undergraduate",
      courseName: "DISCRETE STRUCTURES FOR COMPUTER SCIENCE",
      department: "CS",
      credits: 3,
      description:
        "The purpose of this course is to understand and use (abstract) discrete structures that are backbones of computer science. In particular, this class is meant to introduce logic, proofs, sets, relations, functions, counting, and probability, with an emphasis on applications in computer science.",
      prerequisites: ["MATH0220"],
      professors: [
        "Nils Murrugarra LLerena",
        "Nick Farnan",
        "Bhiman Baghel",
        "William Garrison",
      ],
      usefulness: {
        requiredFor: ["CS1502", "CS1503", "CS1622"],
        genEd: null,
        elective: false,
      },
      reviews: [],
    },
    {
      courseCode: "CS0445",
      courseLevel: "Undergraduate",
      courseName: "ALGORITHMS AND DATA STRUCTURES 1",
      department: "CS",
      credits: 3,
      description:
        "This course emphasizes the study of the basic data structures of computer science (stacks, queues, trees, lists) and their implementations using the java language. Included in this study are programming techniques that use recursion, reference variables, and dynamic memory allocation. Students in this course are also introduced to various searching and sorting methods and also expected to develop an intuitive understanding of the complexity of these algorithms.",
      prerequisites: ["CMPINF0401", "CS0401"],
      professors: [
        "Marina Barsky",
        "Sherif Khattab",
        "Timothy James",
        "Stephen Ellis",
        "John Ramirez",
      ],
      usefulness: {
        requiredFor: [
          "CS1501",
          "CS1510",
          "CS1511",
          "CS1520",
          "CS1530",
          "CS1632",
          "CS1656",
          "CS1675",
        ],
        genEd: null,
        elective: false,
      },
      reviews: [
        {
          professor: "John Ramirez",
          semester: "Summer 2025",
          ratings: {
            workload: 3,
            difficulty: 3,
            usefulness: 5,
            overall: 4,
          },
          comment:
            "amazing lectures! would be 5 but i found the flipped classroom format annoying. the videos were great when i actually watched them but especially since they were sometimes 1 hour long i wished he would just give the lectures in class; it made it easy to fall behind. SET REMINDERS FOR THE TOPHATS. its so easy to forget to do them.",
          timestamp: "2025-06-11T05:00:00.000+00:00",
        },
        {
          professor: "John Ramirez",
          semester: "Spring 2025",
          ratings: {
            workload: 3,
            difficulty: 4,
            usefulness: 5,
            overall: 5,
          },
          comment:
            "This class was challenging for me as someone who wasn't very confident coding in Java. This class helped make everything clear. Professor Ramirez was an amazing lecturer and really wants you to understand the material. Projects were a bit difficult and can be time consuming if you procrastinate starting them. I highly recommened him for 445.",
          timestamp: "2025-05-12T05:00:00.000+00:00",
        },
        {
          professor: "Timothy James",
          semester: "Spring 2025",
          ratings: {
            workload: 2,
            difficulty: 2,
            usefulness: 3,
            overall: 4,
          },
          comment:
            "Overall a good teacher. He's an engaging, experienced lecturer and responds well to questions. Going to lecture is the main thing, as he'll do pop quizzes - the UTA recitations aren't mandatory. Tests were manageable, I didn't find them too difficult or stressful. Sometimes disorganized with project scheduling (he assigned us 2 before finals week).",
          timestamp: "2025-11-20T05:00:00.000+00:00",
        },
      ],
    },
    {
      courseCode: "CS0447",
      courseLevel: "Undergraduate",
      courseName: "COMPUTER ORGANIZATION AND ASSEMBLY LANGUAGE",
      department: "CS",
      credits: 3,
      description:
        "Introduction to computer organization and assembly language programming. Topics include machine organization, instruction set architecture, assembly language programming, and computer arithmetic.",
      prerequisites: ["CS0445"],
      professors: ["Jarrett Billingsley", "Luis F. N. Q. d. Oliveira"],
      usefulness: {
        requiredFor: ["CS0449", "CS1541", "CS1622"],
        genEd: null,
        elective: false,
      },
      reviews: [],
    },
    {
      courseCode: "CS0449",
      courseLevel: "Undergraduate",
      courseName: "INTRODUCTION TO SYSTEMS SOFTWARE",
      department: "CS",
      credits: 3,
      description:
        "Introduction to systems programming and system software. Topics include C programming, memory management, linking and loading, system calls, and basic operating system concepts.",
      prerequisites: ["CS0445", "CS0447"],
      professors: ["Jarrett Billingsley", "Luis F. N. Q. d. Oliveira"],
      usefulness: {
        requiredFor: ["CS1550", "CS1632"],
        genEd: null,
        elective: false,
      },
      reviews: [],
    },
    {
      courseCode: "CS1501",
      courseLevel: "Undergraduate",
      courseName: "ALGORITHMS AND DATA STRUCTURES 2",
      department: "CS",
      credits: 3,
      description:
        "An introduction to advanced algorithm design and analysis. Topics include: greedy algorithms, divide and conquer, dynamic programming, graph algorithms, and NP-completeness. Students will implement and analyze various algorithms.",
      prerequisites: ["CS0445", "CS0441"],
      professors: ["Nicholas Farnan", "Sherif Khattab", "John Ramirez"],
      usefulness: {
        requiredFor: [
          "CS1510",
          "CS1571",
          "CS1656",
          "CS1671",
          "CS1674",
          "CS1675",
        ],
        genEd: null,
        elective: false,
      },
      reviews: [],
    },
    {
      courseCode: "CS1502",
      courseLevel: "Undergraduate",
      courseName: "FORMAL METHODS IN COMPUTER SCIENCE",
      department: "CS",
      credits: 3,
      description:
        "The course is an introduction to the theory of information and computation as a physical phenomenon. The course covers standard formalizations of computational concepts and proofs of noteworthy implications of these formalizations. Typical topics include: finite automata, computability, reducibility, and complexity.",
      prerequisites: ["CS0445", "CS0441"],
      professors: ["Thumrongsak Kosiyatrakul"],
      usefulness: {
        requiredFor: ["CS1571", "CS1613", "CS1674"],
        genEd: null,
        elective: false,
      },
      reviews: [],
    },
    {
      courseCode: "CS1503",
      courseLevel: "Undergraduate",
      courseName: "MATHEMATICAL FOUNDATIONS OF MACHINE LEARNING",
      department: "CS",
      credits: 3,
      description:
        "This introductory course will cover the essential foundational ideas in probability and statistics. We will then discuss the standard applications of these foundational ideas to understand and analyze data, using computational methods, that all computer scientists should know.",
      prerequisites: ["CS0441", "MATH0280"],
      professors: ["Marina Barsky", "Patrick Skeba"],
      usefulness: {
        requiredFor: ["CS1571", "CS1613", "CS1674"],
        genEd: null,
        elective: false,
      },
      reviews: [],
    },
    {
      courseCode: "CS1520",
      courseLevel: "Undergraduate",
      courseName: "PROGRAMMING LANGUAGE FOR WEB APPLICATIONS",
      department: "CS",
      credits: 3,
      description:
        "Introduction to web application development using modern programming languages and frameworks. Topics include client-side and server-side programming, databases, and web security.",
      prerequisites: ["CS0445"],
      professors: ["Paulo Ferreira", "Nick Farnan"],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "CS1530",
      courseLevel: "Undergraduate",
      courseName: "SOFTWARE ENGINEERING",
      department: "CS",
      credits: 3,
      description:
        "The purpose of this course is to provide a general survey of software engineering. Some of the topics covered include: project planning and management, design techniques, verification and validation, and software maintenance. Particular emphasis is on a group project in which a group of students implement a system from its specification.",
      prerequisites: ["CS0445"],
      professors: ["Nadine v. F. u. Ludwigsdorff", "Sohel Sarwar"],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [
        {
          professor: "Nadine v. F. u. Ludwigsdorff",
          semester: "Spring 2024",
          ratings: {
            workload: 4,
            difficulty: 2,
            usefulness: 2,
            overall: 3,
          },
          comment:
            "She was a little boring/slow paced at times, but she is also a newer professor and I believe this was her one of her first times teaching the class. Could def get better in the future. Class itself had homework after almost every lecture and a lot of group work.",
          timestamp: "2024-04-28T05:00:00.000+00:00",
        },
      ],
    },
    {
      courseCode: "CS1550",
      courseLevel: "Undergraduate",
      courseName: "INTRODUCTION TO OPERATING SYSTEMS",
      department: "CS",
      credits: 3,
      description:
        "Introduction to the fundamentals of operating systems design and implementation. Topics include processes, threads, synchronization, scheduling, memory management, file systems, and security.",
      prerequisites: ["CS0449", "CS0447"],
      professors: ["Sherif Khattab", "Stephen Lee"],
      usefulness: {
        requiredFor: ["CS1660"],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "CS1555",
      courseLevel: "Undergraduate",
      courseName: "DATABASE MANAGEMENT SYSTEMS",
      department: "CS",
      credits: 3,
      description:
        "Introduction to database management systems. Topics include data modeling, relational databases, SQL, normalization, transactions, and database design.",
      prerequisites: ["CS1501"],
      professors: ["Nick Farnan"],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "CS1571",
      courseLevel: "Undergraduate",
      courseName: "INTRODUCTION TO ARTIFICIAL INTELLIGENCE",
      department: "CS",
      credits: 3,
      description:
        "Introduction to the theory and practice of artificial intelligence. Topics include search algorithms, knowledge representation, planning, machine learning, and natural language processing.",
      prerequisites: ["CS1501", "CS1502"],
      professors: ["Patrick Skeba"],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "CS1632",
      courseLevel: "Undergraduate",
      courseName: "SOFTWARE QUALITY ASSURANCE",
      department: "CS",
      credits: 3,
      description:
        "Comprehensive introduction to software testing and quality assurance. Topics include test planning, test case design, automated testing, performance testing, and debugging strategies.",
      prerequisites: ["CS0445", "CS0449"],
      professors: ["Wonsun Ahn"],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "CS1656",
      courseLevel: "Undergraduate",
      courseName: "INTRODUCTION TO DATA SCIENCE",
      department: "CS",
      credits: 3,
      description:
        "Introduction to data science concepts and techniques. Topics include data collection, data cleaning, exploratory data analysis, visualization, and basic machine learning.",
      prerequisites: ["CS1501"],
      professors: ["Xiaowei Jia", "Alexandros Labrinidis"],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "CS1675",
      courseLevel: "Undergraduate",
      courseName: "INTRODUCTION TO MACHINE LEARNING",
      department: "CS",
      credits: 3,
      description:
        "Introduction to the theory and practice of machine learning. Topics include supervised learning, unsupervised learning, neural networks, and deep learning fundamentals.",
      prerequisites: ["CS1501"],
      professors: ["Ryan Shi"],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
  ],

  cmpinf: [
    {
      courseCode: "CMPINF0001",
      courseLevel: "Undergraduate",
      courseName: "SCI FIRST-YEAR SEMINAR",
      department: "CMPINF",
      credits: 3,
      description:
        "The first-year seminar will provide students with an introduction to SCI and the University of Pittsburgh. The format of this course will be mixed between large group informational sessions, and small group discussions and activities. The small group sections will be led by members of our advising staff, undergraduate peer mentors, and/or faculty. The course will be split approximately evenly between large-group informational sessions and small-group discussions.",
      prerequisites: [],
      professors: [
        "John Faulkner",
        "Kristine Pugliese",
        "Jen Gentzel",
        "Rachel Parkes",
        "Anna Hermann",
        "Emily Park",
        "Amy Vaught",
        "Kailyn Lukaszewski",
        "Jennifer Welton",
        "Lynnsey Doane",
        "Emily Bennett",
      ],
      usefulness: {
        requiredFor: [],
        genEd: "Shool of Computing and Information",
        elective: false,
      },
      reviews: [],
    },
    {
      courseCode: "CMPINF0010",
      courseLevel: "Undergraduate",
      courseName: "BIG IDEAS IN COMPUTING AND INFORMATION",
      department: "CMPINF",
      credits: 3,
      description:
        "Introduction to the fundamental concepts and applications of computing and information science. Topics include computational thinking, data analysis, information systems, and societal impacts of technology.",
      prerequisites: [],
      professors: ["Joseph Graham", "William Garrison", "Patrick Skeba"],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: false,
      },
      reviews: [],
    },
    {
      courseCode: "CMPINF0401",
      courseLevel: "Undergraduate",
      courseName: "INTERMEDIATE PROGRAMMING",
      department: "CMPINF",
      credits: 3,
      description:
        "This is an intermediate programming course that focuses on programming via an object-oriented paradigm. Students entering CMPINF 0401 are expected to have some previous programming experience. The course introduces concepts and then focus on object-oriented programming, including classes, encapsulation and abstraction, inheritance, and polymorphism.",
      prerequisites: [],
      professors: [
        "Nadine v. F. u. Ludwigsdorff",
        "Timothy Hoffman",
        "John Ramirez",
      ],
      usefulness: {
        requiredFor: ["CS0445"],
        genEd: null,
        elective: false,
      },
      reviews: [
        {
          professor: "Dr. Test Professor",
          semester: "Fall 2024",
          ratings: {
            workload: 4,
            difficulty: 5,
            usefulness: 4,
            overall: 4,
          },
          comment: "Test review to check schema validation.",
          timestamp: "2024-12-07T05:00:00.000+00:00",
        },
      ],
    },
  ],

  infsci: [
    {
      courseCode: "INFSCI0310",
      courseLevel: "Undergraduate",
      courseName: "COMPUTATION IN INFORMATION SCIENCE",
      department: "INFSCI",
      credits: 3,
      description:
        "The objective of this course is to introduce the mathematical and computational techniques used in information science with an emphasis on modeling and analysis of information technology (i.e., computers, data centers, communication networks). Topics course covers fundamental concepts, such as probability, statistical analysis of measurement data, matrix methods, graph theory, and simulation and modeling techniques. Also Covers Basic mathematical concepts that are relevant to information science, including matrix operators, probability, graph theory, binary codes, and entropy.",
      prerequisites: ["MATH0220", "CMPINF0401"],
      professors: ["David Tipper"],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "INFSCI0410",
      courseLevel: "Undergraduate",
      courseName: "HUMAN-CENTERED SYSTEMS",
      department: "INFSCI",
      credits: 3,
      description:
        "This course is an introduction to the study of the design and implementation of human-centered systems. Human-centered systems place the human at the center of the design process. This course will look at theoretical foundations and formal methods from a variety of fields including computer science, psychology and sociology; the actual design process, the dynamics associated with focusing on the individual, small groups and society; and may include selected special topics (instructor dependent) from the following: geospatial reasoning, mobile interaction, multimedia, ubiquitous computing, haptic interaction, virtual reality, wearable computing and sensor based systems.",
      prerequisites: ["CMPINF0401"],
      professors: ["Na Du"],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "INFSCI0510",
      courseLevel: "Undergraduate",
      courseName: "DATA ANALYSIS",
      department: "INFSCI",
      credits: 3,
      description:
        "This course will provide an introduction to programming, data processing, and data analytics using Python for highly motivated students with little or no prior experience in programming. The course will focus on learning the Python programming language in the context of working with data, planning and organizing programs, commonly-used algorithms, data management, data cleaning, basic machine learning, data mining, and fundamentals of computational modeling.",
      prerequisites: ["INFSCI0009", "INFSCI0310"],
      professors: ["Keyang Zheng"],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "INFSCI2150",
      courseLevel: "Graduate",
      courseName: "INFORMATION SECURITY AND PRIVACY",
      department: "INFSCI",
      credits: 3,
      description:
        "Introduction to information security and privacy concepts. Topics include cryptography, network security, authentication, access control, and privacy-preserving technologies.",
      prerequisites: [],
      professors: [],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "INFSCI2560",
      courseLevel: "Graduate",
      courseName: "NETWORK AND WEB DATA TECHNOLOGIES",
      department: "INFSCI",
      credits: 3,
      description:
        "Introduction to modern web and network data technologies. Topics include web protocols, APIs, web services, and data formats for web applications.",
      prerequisites: [],
      professors: [],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [],
    },
    {
      courseCode: "INFSCI2710",
      courseLevel: "Graduate",
      courseName: "DATABASE MANAGEMENT",
      department: "INFSCI",
      credits: 3,
      description:
        "Comprehensive introduction to database management systems. Topics include data modeling, SQL, query optimization, transaction processing, and distributed databases.",
      prerequisites: [],
      professors: [],
      usefulness: {
        requiredFor: [],
        genEd: null,
        elective: true,
      },
      reviews: [
        {
          professor: "Dr. Smith",
          semester: "Fall 2024",
          ratings: {
            workload: 4,
            difficulty: 4,
            usefulness: 5,
            overall: 4,
          },
          comment:
            "Great course! The projects really helped me understand database design. Workload is manageable if you start early.",
          timestamp: "2024-12-15T10:30:00.000+00:00",
        },
      ],
    },
  ],
};

// --- 2. Flatten the Data into a Single Array ---
const courseData = [
  ...initialScrapedData.cs,
  ...initialScrapedData.cmpinf,
  ...initialScrapedData.infsci,
];

// --- 3. The Seeding Function ---
async function seedDatabase() {
  try {
    // 1. Establish the connection
    await connectDB();

    // 2. Clear old data to prevent duplicate key errors when running multiple times
    console.log("Clearing existing course data...");
    await Course.deleteMany({});
    console.log("Existing data cleared.");

    // 3. Insert all new course documents
    console.log(`Inserting ${courseData.length} course documents...`);
    const result = await Course.insertMany(courseData);

    console.log(
      `\n🎉 SUCCESS! Database seeded with ${result.length} documents.`
    );
  } catch (error) {
    console.error("\n❌ SEEDING FAILED:");
    if (error.code === 11000) {
      console.error(
        "⚠️ Warning: Duplicate key error (courseCode) detected during insert. Check your source data."
      );
    } else {
      console.error("Error details:", error.message);
    }
  } finally {
    // 4. Close the MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("\n🚪 MongoDB connection closed.");
    }
  }
}

seedDatabase();
