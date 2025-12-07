// backend/seed_all_data.js

const connectDB = require('../database/config/connection');
const Course = require('../database/models/Course');
const mongoose = require('mongoose');

// --- 1. Define the Initial Scraped Data ---
const initialScrapedData = {
    cs: [
        {
            courseCode: "CS0445",
            courseLevel: "Undergraduate",
            courseName: "ALGORITHMS AND DATA STRUCTURES 1",
            department: "CS",
            credits: 3,
            description: "This course emphasizes the study of the basic data structures of computer science (stacks, queues, trees, lists) and their implementations using the java language. Included in this study are programming techniques that use recursion, reference variables, and dynamic memory allocation. Students in this course are also introduced to various searching and sorting methods and also expected to develop an intuitive understanding of the complexity of these algorithms.",
            prerequisites: ["CMPINF0401", "CS0401", "COE0401", "CS0207"],
            professors: ["Marina Barsky", "Sherif Khattab", "Timothy James", "Stephen Ellis"],
            usefulness: {
                requiredFor: ["CS1501", "CS1530", "CS1520", "CS1550", "CS1632", "CS1675"],
                genEd: null,
                elective: false
            },
            reviews: []
        },
        {
            courseCode: "CS1530",
            courseLevel: "Undergraduate",
            courseName: "SOFTWARE ENGINEERING",
            department: "CS",
            credits: 3,
            description: "The purpose of this course is to provide a general survey of software engineering. Some of the topics covered include: project planning and management, design techniques, verification and validation, and software maintenance. Particular emphasis is on a group project in which a group of students implement a system from its specification.",
            prerequisites: ["CS0445", "COE0445"],
            professors: ["Nadine v. F. u. Ludwigsdorff"],
            usefulness: {
                requiredFor: [],
                genEd: null,
                elective: true
            },
            reviews: []
        },
        {
            courseCode: "CS1501",
            courseLevel: "Undergraduate",
            courseName: "ALGORITHMS AND DATA STRUCTURES 2",
            department: "CS",
            credits: 3,
            description: "An introduction to advanced algorithm design and analysis. Topics include: greedy algorithms, divide and conquer, dynamic programming, graph algorithms, and NP-completeness. Students will implement and analyze various algorithms.",
            prerequisites: ["CS0445", "CS0441"],
            professors: [],
            usefulness: {
                requiredFor: ["CS1571", "CS1666", "CS1674", "CS1675"],
                genEd: null,
                elective: false
            },
            reviews: []
        },
        {
            courseCode: "CS1550",
            courseLevel: "Undergraduate",
            courseName: "INTRODUCTION TO OPERATING SYSTEMS",
            department: "CS",
            credits: 3,
            description: "Introduction to the fundamentals of operating systems design and implementation. Topics include processes, threads, synchronization, scheduling, memory management, file systems, and security.",
            prerequisites: ["CS0449", "CS0447"],
            professors: [],
            usefulness: {
                requiredFor: ["CS1651"],
                genEd: null,
                elective: true
            },
            reviews: []
        },
        {
            courseCode: "CS1520",
            courseLevel: "Undergraduate",
            courseName: "PROGRAMMING LANGUAGE FOR WEB APPLICATIONS",
            department: "CS",
            credits: 3,
            description: "Introduction to web application development using modern programming languages and frameworks. Topics include client-side and server-side programming, databases, and web security.",
            prerequisites: ["CS0445", "COE0445"],
            professors: [],
            usefulness: {
                requiredFor: [],
                genEd: null,
                elective: true
            },
            reviews: []
        },
        {
            courseCode: "CS1632",
            courseLevel: "Undergraduate",
            courseName: "SOFTWARE QUALITY ASSURANCE",
            department: "CS",
            credits: 3,
            description: "Comprehensive introduction to software testing and quality assurance. Topics include test planning, test case design, automated testing, performance testing, and debugging strategies.",
            prerequisites: ["CS0445", "COE0445", "CS0449", "COE0449"],
            professors: [],
            usefulness: {
                requiredFor: [],
                genEd: null,
                elective: true
            },
            reviews: []
        },
        {
            courseCode: "CS1675",
            courseLevel: "Undergraduate",
            courseName: "INTRODUCTION TO MACHINE LEARNING",
            department: "CS",
            credits: 3,
            description: "Introduction to the theory and practice of machine learning. Topics include supervised learning, unsupervised learning, neural networks, and deep learning fundamentals.",
            prerequisites: ["CS1501", "COE1501"],
            professors: [],
            usefulness: {
                requiredFor: [],
                genEd: null,
                elective: true
            },
            reviews: []
        },
        {
            courseCode: "CS0447",
            courseLevel: "Undergraduate",
            courseName: "COMPUTER ORGANIZATION AND ASSEMBLY LANGUAGE",
            department: "CS",
            credits: 3,
            description: "Introduction to computer organization and assembly language programming. Topics include machine organization, instruction set architecture, assembly language programming, and computer arithmetic.",
            prerequisites: ["CS0445", "COE0445"],
            professors: [],
            usefulness: {
                requiredFor: ["CS0449", "CS1541"],
                genEd: null,
                elective: false
            },
            reviews: []
        },
        {
            courseCode: "CS0449",
            courseLevel: "Undergraduate",
            courseName: "INTRODUCTION TO SYSTEMS SOFTWARE",
            department: "CS",
            credits: 3,
            description: "Introduction to systems programming and system software. Topics include C programming, memory management, linking and loading, system calls, and basic operating system concepts.",
            prerequisites: ["CS0445", "CS0455", "CS0447", "CS0456", "COE0447", "COE0147"],
            professors: [],
            usefulness: {
                requiredFor: ["CS1550", "CS1632"],
                genEd: null,
                elective: false
            },
            reviews: []
        },
        {
            courseCode: "CS1571",
            courseLevel: "Undergraduate",
            courseName: "INTRODUCTION TO ARTIFICIAL INTELLIGENCE",
            department: "CS",
            credits: 3,
            description: "Introduction to the theory and practice of artificial intelligence. Topics include search algorithms, knowledge representation, planning, machine learning, and natural language processing.",
            prerequisites: ["CS1501", "COE1501", "CS1502"],
            professors: [],
            usefulness: {
                requiredFor: [],
                genEd: null,
                elective: true
            },
            reviews: []
        },
        {
            courseCode: "CS1656",
            courseLevel: "Undergraduate",
            courseName: "INTRODUCTION TO DATA SCIENCE",
            department: "CS",
            credits: 3,
            description: "Introduction to data science concepts and techniques. Topics include data collection, data cleaning, exploratory data analysis, visualization, and basic machine learning.",
            prerequisites: [],
            professors: [],
            usefulness: {
                requiredFor: [],
                genEd: null,
                elective: true
            },
            reviews: []
        },
        {
            courseCode: "CS1555",
            courseLevel: "Undergraduate",
            courseName: "DATABASE MANAGEMENT SYSTEMS",
            department: "CS",
            credits: 3,
            description: "Introduction to database management systems. Topics include data modeling, relational databases, SQL, normalization, transactions, and database design.",
            prerequisites: [],
            professors: [],
            usefulness: {
                requiredFor: [],
                genEd: null,
                elective: true
            },
            reviews: []
        }
    ],
    
    cmpinf: [
        {
            courseCode: "CMPINF0401",
            courseLevel: "Undergraduate",
            courseName: "INTERMEDIATE PROGRAMMING",
            department: "CMPINF",
            credits: 3,
            description: "This is an intermediate programming course that focuses on programming via an object-oriented paradigm. Students entering CMPINF 0401 are expected to have some previous programming experience. The course introduces concepts and then focus on object-oriented programming, including classes, encapsulation and abstraction, inheritance, and polymorphism.",
            prerequisites: [],
            professors: [],
            usefulness: {
                requiredFor: ["CS0445"],
                genEd: null,
                elective: false
            },
            reviews: [{
                professor: "Dr. Test Professor",
                semester: "Fall 2024",
                ratings: {
                    workload: 4,
                    difficulty: 5,
                    usefulness: 4,
                    overall: 4
                },
                comment: "Test review to check schema validation."
            }]
        },
        {
            courseCode: "CMPINF0010",
            courseLevel: "Undergraduate",
            courseName: "BIG IDEAS IN COMPUTING AND INFORMATION",
            department: "CMPINF",
            credits: 3,
            description: "Introduction to the fundamental concepts and applications of computing and information science. Topics include computational thinking, data analysis, information systems, and societal impacts of technology.",
            prerequisites: [],
            professors: [],
            usefulness: {
                requiredFor: [],
                genEd: "Quantitative Reasoning",
                elective: false
            },
            reviews: []
        }
    ],
    
    infsci: [
        {
            courseCode: "INFSCI2150",
            courseLevel: "Graduate",
            courseName: "INFORMATION SECURITY AND PRIVACY",
            department: "INFSCI",
            credits: 3,
            description: "Introduction to information security and privacy concepts. Topics include cryptography, network security, authentication, access control, and privacy-preserving technologies.",
            prerequisites: [],
            professors: [],
            usefulness: {
                requiredFor: [],
                genEd: null,
                elective: true
            },
            reviews: []
        },
        {
            courseCode: "INFSCI2560",
            courseLevel: "Graduate",
            courseName: "NETWORK AND WEB DATA TECHNOLOGIES",
            department: "INFSCI",
            credits: 3,
            description: "Introduction to modern web and network data technologies. Topics include web protocols, APIs, web services, and data formats for web applications.",
            prerequisites: [],
            professors: [],
            usefulness: {
                requiredFor: [],
                genEd: null,
                elective: true
            },
            reviews: []
        },
        {
            courseCode: "INFSCI2710",
            courseLevel: "Graduate",
            courseName: "DATABASE MANAGEMENT",
            department: "INFSCI",
            credits: 3,
            description: "Comprehensive introduction to database management systems. Topics include data modeling, SQL, query optimization, transaction processing, and distributed databases.",
            prerequisites: [],
            professors: [],
            usefulness: {
                requiredFor: [],
                genEd: null,
                elective: true
            },
            reviews: []
        }
    ]
};

// --- 2. Flatten the Data into a Single Array ---
const courseData = [
    ...initialScrapedData.cs,
    ...initialScrapedData.cmpinf,
    ...initialScrapedData.infsci
];


// --- 3. The Seeding Function ---
async function seedDatabase() {
    try {
        // 1. Establish the connection
        await connectDB();
        
        // 2. Clear old data to prevent duplicate key errors when running multiple times
        console.log('Clearing existing course data...');
        await Course.deleteMany({});
        console.log('Existing data cleared.');

        // 3. Insert all new course documents
        console.log(`Inserting ${courseData.length} course documents...`);
        const result = await Course.insertMany(courseData);
        
        console.log(`\n🎉 SUCCESS! Database seeded with ${result.length} documents.`);
        
    } catch (error) {
        console.error('\n❌ SEEDING FAILED:');
        if (error.code === 11000) {
            console.error('⚠️ Warning: Duplicate key error (courseCode) detected during insert. Check your source data.');
        } else {
            console.error('Error details:', error.message);
        }
    } finally {
        // 4. Close the MongoDB connection
        if (mongoose.connection.readyState === 1) {
             await mongoose.connection.close();
             console.log('\n🚪 MongoDB connection closed.');
        }
    }
}

seedDatabase();