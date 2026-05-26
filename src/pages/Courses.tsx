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
}

// Sample Initial Seeding based on FREE_COURSE_MASTER_DIRECTORY.md
const COURSE_DATABASE: Course[] = [
  {
    id: 1,
    title: 'CS50: Introduction to Computer Science',
    provider: 'Harvard University',
    category: 'Ivy League',
    topic: 'Computer Science',
    duration: '12 weeks',
    difficulty: 'Beginner',
    hasCertificate: true,
    link: 'https://pll.harvard.edu/course/cs50-introduction-computer-science',
  },
  {
    id: 2,
    title: 'Google Analytics for Beginners',
    provider: 'Google Digital Garage',
    category: 'Big Tech',
    topic: 'Marketing',
    duration: '4 hours',
    difficulty: 'Beginner',
    hasCertificate: true,
    link: 'https://learndigital.withgoogle.com/digitalgarage',
  },
  {
    id: 3,
    title: 'Elements of AI',
    provider: 'University of Helsinki',
    category: 'Ivy League',
    topic: 'Artificial Intelligence',
    duration: '6 weeks',
    difficulty: 'Beginner',
    hasCertificate: true,
    link: 'https://www.elementsofai.com',
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
  },
  {
    id: 5,
    title: 'Inbound Marketing Certification',
    provider: 'HubSpot Academy',
    category: 'Niche',
    topic: 'Marketing',
    duration: '5 hours',
    difficulty: 'Intermediate',
    hasCertificate: true,
    link: 'https://academy.hubspot.com',
  },
  {
    id: 6,
    title: 'Introduction to Cybersecurity',
    provider: 'Cisco Networking Academy',
    category: 'Big Tech',
    topic: 'Cybersecurity',
    duration: '15 hours',
    difficulty: 'Beginner',
    hasCertificate: true,
    link: 'https://www.netacad.com',
  },
  {
    id: 7,
    title: 'OpenWHO: Pandemics & Health Emergencies',
    provider: 'World Health Organization (WHO)',
    category: 'UN/Govt',
    topic: 'Health & Science',
    duration: '10 hours',
    difficulty: 'Beginner',
    hasCertificate: true,
    link: 'https://openwho.org',
  },
  {
    id: 8,
    title: 'UNICEF Agora: Child Rights Advocacy',
    provider: 'UNICEF Agora',
    category: 'UN/Govt',
    topic: 'Social Sciences',
    duration: '8 hours',
    difficulty: 'Intermediate',
    hasCertificate: true,
    link: 'https://agora.unicef.org',
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Free Course Discovery
        </h1>
        <p className="text-gray-400">
          Find and search verified, zero-dollar courses issuing certificates from 300+ leading directories
        </p>
      </div>

      {/* Control Filters Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search topics, courses, or providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
        </div>

        {/* Category select filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="glass-input w-full"
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
          className="glass-input w-full"
        >
          <option value="All">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Courses Grid Output */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} variant="bordered" hover className="flex flex-col justify-between h-full">
              <CardContent className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                      {course.category}
                    </span>
                    <span className="text-xs text-gray-500">{course.duration}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">{course.provider}</p>
                </div>

                <div className="border-t border-purple-500/10 pt-3 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Free Cert</span>
                  </div>
                  <a 
                    href={course.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-bold"
                  >
                    Go Study <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No free courses match your filter parameters.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
