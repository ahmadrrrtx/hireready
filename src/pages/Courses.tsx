import React, { useState, useMemo } from 'react';
import { Search, BookOpen, ExternalLink, Award, CheckCircle } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Course {
  id: number;
  title: string;
  provider: string;
  category: 'Ivy League' | 'Big Tech' | 'UN/Govt' | 'Niche';
  topic: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  hasCertificate: boolean;
  link: string;
  syllabus: string[];
}

// Highly detailed, real courses based on FREE_COURSE_MASTER_DIRECTORY.md
const COURSE_DATABASE: Course[] = [
  {
    id: 1,
    title: 'CS50: Introduction to Computer Science',
    provider: 'Harvard University',
    category: 'Ivy League',
    topic: 'Computer Science',
    duration: '12 weeks (60 hours)',
    difficulty: 'Beginner',
    hasCertificate: true,
    link: 'https://pll.harvard.edu/course/cs50-introduction-computer-science',
    syllabus: ['C & Programming Basics', 'Memory & Pointers', 'Data Structures & Algorithms', 'Python, SQL, HTML/CSS/JS'],
  },
  {
    id: 2,
    title: 'Google Digital Garage: Fundamentals of Digital Marketing',
    provider: 'Google',
    category: 'Big Tech',
    topic: 'Marketing & SEO',
    duration: '26 hours',
    difficulty: 'Beginner',
    hasCertificate: true,
    link: 'https://learndigital.withgoogle.com/digitalgarage',
    syllabus: ['SEO Fundamentals', 'Social Media Marketing', 'Search Engine Marketing (SEM)', 'Web Analytics & Strategy'],
  },
  {
    id: 3,
    title: 'Elements of AI: Introduction to Artificial Intelligence',
    provider: 'University of Helsinki & Reaktor',
    category: 'Ivy League',
    topic: 'Artificial Intelligence',
    duration: '6 weeks (30 hours)',
    difficulty: 'Beginner',
    hasCertificate: true,
    link: 'https://www.elementsofai.com',
    syllabus: ['Defining AI & History', 'Solving Problems with AI', 'Real-world AI & Machine Learning', 'Neural Networks & Deep Learning'],
  },
  {
    id: 4,
    title: 'AWS Cloud Practitioner Essentials',
    provider: 'Amazon Web Services',
    category: 'Big Tech',
    topic: 'Cloud Computing',
    duration: '6 hours',
    difficulty: 'Beginner',
    hasCertificate: true,
    link: 'https://aws.amazon.com/training/digital',
    syllabus: ['Cloud Concepts & Architecting', 'AWS Core Services', 'Security & Compliance', 'Pricing, Billing & Support'],
  },
  {
    id: 5,
    title: 'HubSpot Inbound Marketing Certification',
    provider: 'HubSpot Academy',
    category: 'Niche',
    topic: 'Marketing',
    duration: '5 hours',
    difficulty: 'Intermediate',
    hasCertificate: true,
    link: 'https://academy.hubspot.com',
    syllabus: ['Inbound Marketing Strategy', 'Content Creation Framework', 'Lead Generation & Nurturing', 'Marketing Automation'],
  },
  {
    id: 6,
    title: 'Cisco NetAcad: Cybersecurity Essentials',
    provider: 'Cisco',
    category: 'Big Tech',
    topic: 'Cybersecurity',
    duration: '30 hours',
    difficulty: 'Intermediate',
    hasCertificate: true,
    link: 'https://www.netacad.com',
    syllabus: ['Cybersecurity Threat Landscape', 'Data & Network Defense', 'Cryptography & Firewalls', 'Privacy & Legal Frameworks'],
  },
  {
    id: 7,
    title: 'OpenWHO: Health Emergencies & Pandemic Response',
    provider: 'World Health Organization (WHO)',
    category: 'UN/Govt',
    topic: 'Health & Science',
    duration: '10 hours',
    difficulty: 'Beginner',
    hasCertificate: true,
    link: 'https://openwho.org',
    syllabus: ['Epidemic Concepts & History', 'Emergency Risk Communication', 'Clinical Response Protocols', 'Community Mobilization'],
  },
  {
    id: 8,
    title: 'UNICEF Agora: Child Rights Advocacy and Human Rights',
    provider: 'UNICEF',
    category: 'UN/Govt',
    topic: 'Social Sciences',
    duration: '8 hours',
    difficulty: 'Intermediate',
    hasCertificate: true,
    link: 'https://agora.unicef.org',
    syllabus: ['International Human Rights Law', 'Child Protection Policies', 'Global Advocacy Campaigns', 'Field Intervention Tactics'],
  },
  {
    id: 9,
    title: 'MIT OpenCourseWare: Introduction to Algorithms (6.006)',
    provider: 'Massachusetts Institute of Technology',
    category: 'Ivy League',
    topic: 'Computer Science',
    duration: '15 weeks (45 hours)',
    difficulty: 'Advanced',
    hasCertificate: false,
    link: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/',
    syllabus: ['Sorting & Searching', 'Binary Search Trees', 'Graph Search (BFS/DFS)', 'Dynamic Programming'],
  },
  {
    id: 10,
    title: 'IBM SkillsBuild: Generative AI Foundations',
    provider: 'IBM',
    category: 'Big Tech',
    topic: 'Artificial Intelligence',
    duration: '12 hours',
    difficulty: 'Beginner',
    hasCertificate: true,
    link: 'https://skillsbuild.org',
    syllabus: ['Large Language Models (LLMs)', 'Prompt Engineering Basics', 'Ethics & Bias in Generative AI', 'Application Development'],
  },
  {
    id: 11,
    title: 'The Odin Project: Full-Stack JavaScript Track',
    provider: 'The Odin Project',
    category: 'Niche',
    topic: 'Computer Science',
    duration: '1000+ hours',
    difficulty: 'Advanced',
    hasCertificate: false,
    link: 'https://www.theodinproject.com',
    syllabus: ['Advanced HTML & CSS', 'JavaScript Deep Dive', 'React State & APIs', 'Node.js, Express & MongoDB'],
  },
  {
    id: 12,
    title: 'Stanford Online: Databases & SQL Fundamentals',
    provider: 'Stanford University',
    category: 'Ivy League',
    topic: 'Computer Science',
    duration: '8 weeks (24 hours)',
    difficulty: 'Intermediate',
    hasCertificate: false,
    link: 'https://online.stanford.edu',
    syllabus: ['Relational Algebra', 'SQL Queries & Joins', 'Database Normalization', 'NoSQL & XML Databases'],
  }
];

const Courses: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const filteredCourses = useMemo(() => {
    return COURSE_DATABASE.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.topic.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="max-w-7xl mx-auto page-container">
      {/* Header Info */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gradient mb-3 tracking-tight">
          Free Course Directory
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Search, filter, and discover verified zero-cost courses with certifications from 300+ leading directories.
        </p>
      </div>

      {/* Control Filters Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search topics, courses, or providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-11"
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
        </div>

        {/* Category select filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="glass-input w-full bg-gray-950 text-white cursor-pointer"
        >
          <option value="All">All Providers</option>
          <option value="Ivy League">Ivy League Universities</option>
          <option value="Big Tech">Big Tech Organizations</option>
          <option value="UN/Govt">Government & UN Systems</option>
          <option value="Niche">Niche Specialized Platforms</option>
        </select>

        {/* Difficulty select filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="glass-input w-full bg-gray-950 text-white cursor-pointer"
        >
          <option value="All">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Courses Grid Output */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} variant="bordered" hover className="flex flex-col justify-between h-full bg-white/[0.01] hover:border-purple-500/30 transition-all p-6">
              <CardContent className="flex flex-col h-full justify-between p-0">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-extrabold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full tracking-wider">
                      {course.category}
                    </span>
                    <span className="text-xs text-gray-400">{course.duration}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{course.provider}</p>

                  {/* Syllabus / Key Concepts */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Modules</p>
                    <div className="space-y-1.5">
                      {course.syllabus.map((topic, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-purple-500/60" />
                          <span className="text-xs text-gray-400 truncate">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-purple-500/10 pt-4 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <Award className={`w-4 h-4 ${course.hasCertificate ? 'text-indigo-400' : 'text-gray-600'}`} />
                    <span className="text-xs text-gray-400 font-medium">
                      {course.hasCertificate ? 'Verified Cert' : 'Audit Free'}
                    </span>
                  </div>
                  <a 
                    href={course.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-extrabold tracking-wide"
                  >
                    Start Studying <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/[0.01] rounded-2xl border border-purple-500/10 max-w-lg mx-auto">
          <p className="text-gray-400 text-lg mb-2">No free courses found</p>
          <p className="text-gray-500 text-sm">Try modifying your search or dropdown filters.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
