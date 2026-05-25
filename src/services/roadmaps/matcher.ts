// ============================================================
// COURSE MATCHER SERVICE
// Match skills to free learning resources
// ============================================================

import { CourseRef, CourseMatchRequest, CourseMatchResult } from '../../types';

// In-memory course database (in production, this would be a real database or API)
const FREE_COURSES_DB: CourseRef[] = [
  // Frontend
  {
    id: 'course-html-css-fcc',
    title: 'Responsive Web Design Certification',
    platform: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
    duration: '300 hours',
    difficulty: 'Beginner',
    skills: ['HTML', 'CSS', 'Responsive Design', 'Flexbox', 'Grid'],
    description: 'Learn HTML and CSS fundamentals, build 5 responsive projects',
    isFree: true,
    language: 'English',
  },
  {
    id: 'course-javascript-fcc',
    title: 'JavaScript Algorithms and Data Structures',
    platform: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
    duration: '300 hours',
    difficulty: 'Beginner',
    skills: ['JavaScript', 'ES6', 'Algorithms', 'Data Structures'],
    description: 'Master JavaScript fundamentals and problem-solving',
    isFree: true,
    language: 'English',
  },
  {
    id: 'course-react-fcc',
    title: 'Front End Development Libraries',
    platform: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
    duration: '300 hours',
    difficulty: 'Intermediate',
    skills: ['React', 'Redux', 'jQuery', 'Bootstrap', 'Sass'],
    description: 'Learn popular frontend frameworks and libraries',
    isFree: true,
    language: 'English',
  },
  {
    id: 'course-fullstack-open',
    title: 'Full Stack Open',
    platform: 'Full Stack Open',
    url: 'https://fullstackopen.com/en/',
    instructor: 'University of Helsinki',
    duration: '200 hours',
    difficulty: 'Intermediate',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'GraphQL', 'TypeScript'],
    description: 'Deep dive into modern full stack development',
    rating: 4.9,
    isFree: true,
    language: 'English',
  },

  // Backend
  {
    id: 'course-nodejs-fcc',
    title: 'Back End Development and APIs',
    platform: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
    duration: '300 hours',
    difficulty: 'Intermediate',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
    description: 'Build backend services and APIs',
    isFree: true,
    language: 'English',
  },
  {
    id: 'course-python-google',
    title: 'Google IT Automation with Python',
    platform: 'Coursera (Audit)',
    url: 'https://www.coursera.org/professional-certificates/google-it-automation',
    instructor: 'Google',
    duration: '6 months',
    difficulty: 'Beginner',
    skills: ['Python', 'Git', 'Automation', 'Linux'],
    description: 'Learn Python for automation and scripting',
    isFree: true,
    language: 'English',
  },

  // DevOps & Cloud
  {
    id: 'course-docker-youtube',
    title: 'Docker Tutorial for Beginners',
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
    instructor: 'freeCodeCamp.org',
    duration: '3 hours',
    difficulty: 'Beginner',
    skills: ['Docker', 'Containers', 'DevOps'],
    description: 'Complete Docker tutorial from basics to deployment',
    isFree: true,
    language: 'English',
  },
  {
    id: 'course-kubernetes-youtube',
    title: 'Kubernetes Course for Beginners',
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
    instructor: 'TechWorld with Nana',
    duration: '4 hours',
    difficulty: 'Intermediate',
    skills: ['Kubernetes', 'K8s', 'Container Orchestration', 'DevOps'],
    description: 'Learn Kubernetes from scratch',
    isFree: true,
    language: 'English',
  },
  {
    id: 'course-aws-cloud',
    title: 'AWS Cloud Practitioner Essentials',
    platform: 'AWS Training',
    url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
    duration: '6 hours',
    difficulty: 'Beginner',
    skills: ['AWS', 'Cloud Computing', 'EC2', 'S3'],
    description: 'Introduction to AWS cloud services',
    isFree: true,
    language: 'English',
  },

  // Data Science & AI
  {
    id: 'course-ml-coursera',
    title: 'Machine Learning Specialization',
    platform: 'Coursera (Audit)',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    instructor: 'Andrew Ng',
    duration: '3 months',
    difficulty: 'Intermediate',
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'Neural Networks'],
    description: 'Comprehensive ML course by Andrew Ng',
    rating: 4.9,
    isFree: true,
    language: 'English',
  },
  {
    id: 'course-python-data-science',
    title: 'Data Analysis with Python',
    platform: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
    duration: '300 hours',
    difficulty: 'Intermediate',
    skills: ['Python', 'Pandas', 'NumPy', 'Data Visualization'],
    description: 'Learn data analysis with Python libraries',
    isFree: true,
    language: 'English',
  },

  // Computer Science Fundamentals
  {
    id: 'course-cs50',
    title: 'CS50: Introduction to Computer Science',
    platform: 'Harvard CS50',
    url: 'https://cs50.harvard.edu/x/',
    instructor: 'David J. Malan',
    duration: '12 weeks',
    difficulty: 'Beginner',
    skills: ['C', 'Python', 'SQL', 'Algorithms', 'Data Structures'],
    description: 'Harvard\'s legendary computer science course',
    rating: 5.0,
    isFree: true,
    language: 'English',
  },

  // Mobile Development
  {
    id: 'course-react-native',
    title: 'React Native Tutorial for Beginners',
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
    instructor: 'Programming with Mosh',
    duration: '2 hours',
    difficulty: 'Intermediate',
    skills: ['React Native', 'Mobile Development', 'iOS', 'Android'],
    description: 'Build mobile apps with React Native',
    isFree: true,
    language: 'English',
  },
  {
    id: 'course-flutter',
    title: 'Flutter Course for Beginners',
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=VPvVD8t02U8',
    instructor: 'freeCodeCamp.org',
    duration: '37 hours',
    difficulty: 'Beginner',
    skills: ['Flutter', 'Dart', 'Mobile Development'],
    description: 'Complete Flutter development course',
    isFree: true,
    language: 'English',
  },

  // Design
  {
    id: 'course-ux-google',
    title: 'Google UX Design Certificate',
    platform: 'Coursera (Audit)',
    url: 'https://www.coursera.org/professional-certificates/google-ux-design',
    instructor: 'Google',
    duration: '6 months',
    difficulty: 'Beginner',
    skills: ['UX Design', 'UI Design', 'Figma', 'Prototyping', 'User Research'],
    description: 'Learn UX design from Google',
    isFree: true,
    language: 'English',
  },

  // Add more courses as needed...
];

/**
 * Match courses to requested skills
 */
export async function matchCourses(
  request: CourseMatchRequest
): Promise<CourseMatchResult[]> {
  const { skills, difficulty, maxResults = 5, preferredPlatforms } = request;

  // Calculate match scores
  const scored = FREE_COURSES_DB.map(course => {
    let score = 0;
    const matchedSkills: string[] = [];

    // Check skill overlap
    skills.forEach(requestedSkill => {
      course.skills.forEach(courseSkill => {
        if (
          courseSkill.toLowerCase().includes(requestedSkill.toLowerCase()) ||
          requestedSkill.toLowerCase().includes(courseSkill.toLowerCase())
        ) {
          score += 30;
          if (!matchedSkills.includes(courseSkill)) {
            matchedSkills.push(courseSkill);
          }
        }
      });
    });

    // Difficulty match bonus
    if (difficulty && course.difficulty === difficulty) {
      score += 20;
    }

    // Platform preference bonus
    if (preferredPlatforms && preferredPlatforms.includes(course.platform)) {
      score += 15;
    }

    // Rating bonus
    if (course.rating) {
      score += course.rating * 5;
    }

    // Free course bonus (all our courses are free, but for future expansion)
    if (course.isFree) {
      score += 10;
    }

    return {
      course,
      matchScore: Math.min(100, score),
      matchedSkills,
    };
  });

  // Filter courses with score > 0 and sort by score
  const filtered = scored
    .filter(result => result.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxResults);

  return filtered;
}

/**
 * Get course by ID
 */
export function getCourseById(id: string): CourseRef | undefined {
  return FREE_COURSES_DB.find(course => course.id === id);
}

/**
 * Search courses by platform
 */
export function getCoursesByPlatform(platform: string): CourseRef[] {
  return FREE_COURSES_DB.filter(
    course => course.platform.toLowerCase() === platform.toLowerCase()
  );
}

/**
 * Get all unique platforms
 */
export function getAllPlatforms(): string[] {
  return Array.from(new Set(FREE_COURSES_DB.map(c => c.platform)));
}
