import React, { useState } from 'react';
import { BookOpen, Users, Clock, Award, Plus, Search, Filter, Eye, Edit, Trash2, X, Save, Calendar, MapPin, Star, CheckCircle, AlertCircle, Download, Play, Pause, RotateCcw, User, Video, FileText, Target, TrendingUp } from 'lucide-react';
import Chart from '../Common/Chart';
import { mockTrainingData, mockEmployees } from '../../data/mockData';

interface Course {
  id: string;
  courseName: string;
  enrolled: number;
  completed: number;
  duration: string;
  category: string;
  instructor: string;
  startDate: string;
  endDate: string;
  description: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  maxCapacity: number;
  location: string;
  type: 'online' | 'in-person' | 'hybrid';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  rating: number;
  materials: string[];
  prerequisites: string[];
}

interface TrainingSession {
  id: string;
  courseId: string;
  sessionName: string;
  date: string;
  time: string;
  duration: string;
  instructor: string;
  attendees: number;
  maxAttendees: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetingLink?: string;
  location?: string;
}

interface Enrollment {
  id: string;
  employeeId: string;
  courseId: string;
  enrollmentDate: string;
  progress: number;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
  completionDate?: string;
  certificateIssued: boolean;
  score?: number;
}

const Training: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('courses');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Extended course data
  const [courses, setCourses] = useState<Course[]>([
    ...mockTrainingData.map((course, index) => ({
      ...course,
      instructor: ['Dr. Sarah Wilson', 'Prof. Michael Chen', 'Lisa Rodriguez', 'David Thompson'][index % 4],
      startDate: '2024-02-01',
      endDate: '2024-04-01',
      description: 'Comprehensive training program designed to enhance professional skills and knowledge.',
      status: ['active', 'upcoming', 'completed'][index % 3] as 'active' | 'upcoming' | 'completed',
      maxCapacity: course.enrolled + Math.floor(Math.random() * 20) + 10,
      location: ['Conference Room A', 'Online', 'Training Center', 'Hybrid'][index % 4],
      type: ['online', 'in-person', 'hybrid'][index % 3] as 'online' | 'in-person' | 'hybrid',
      difficulty: ['beginner', 'intermediate', 'advanced'][index % 3] as 'beginner' | 'intermediate' | 'advanced',
      price: Math.floor(Math.random() * 500) + 100,
      rating: 4 + Math.random(),
      materials: ['Course Handbook', 'Video Lectures', 'Practice Exercises', 'Assessment Tools'],
      prerequisites: index > 0 ? ['Basic knowledge required'] : []
    }))
  ]);

  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([
    {
      id: '1',
      courseId: '1',
      sessionName: 'Leadership Fundamentals',
      date: '2024-01-20',
      time: '09:00',
      duration: '2 hours',
      instructor: 'Dr. Sarah Wilson',
      attendees: 15,
      maxAttendees: 25,
      status: 'scheduled',
      meetingLink: 'https://zoom.us/j/123456789',
      location: 'Conference Room A'
    },
    {
      id: '2',
      courseId: '2',
      sessionName: 'React Advanced Concepts',
      date: '2024-01-22',
      time: '14:00',
      duration: '3 hours',
      instructor: 'Prof. Michael Chen',
      attendees: 20,
      maxAttendees: 30,
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '3',
      courseId: '3',
      sessionName: 'Effective Communication Workshop',
      date: '2024-01-18',
      time: '10:30',
      duration: '4 hours',
      instructor: 'Lisa Rodriguez',
      attendees: 18,
      maxAttendees: 20,
      status: 'completed',
      location: 'Training Center'
    }
  ]);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    {
      id: '1',
      employeeId: '1',
      courseId: '1',
      enrollmentDate: '2024-01-10',
      progress: 75,
      status: 'in-progress',
      certificateIssued: false,
      score: 85
    },
    {
      id: '2',
      employeeId: '2',
      courseId: '2',
      enrollmentDate: '2024-01-05',
      progress: 100,
      status: 'completed',
      completionDate: '2024-01-15',
      certificateIssued: true,
      score: 92
    }
  ]);

  const [formData, setFormData] = useState({
    courseName: '',
    category: '',
    instructor: '',
    startDate: '',
    endDate: '',
    duration: '',
    maxCapacity: '',
    location: '',
    type: 'online',
    difficulty: 'beginner',
    price: '',
    description: '',
    materials: '',
    prerequisites: ''
  });

  const [sessionForm, setSessionForm] = useState({
    sessionName: '',
    date: '',
    time: '',
    duration: '',
    instructor: '',
    maxAttendees: '',
    meetingLink: '',
    location: ''
  });

  const [enrollForm, setEnrollForm] = useState({
    employeeId: '',
    courseId: ''
  });

  const categories = ['Management', 'Technical', 'Soft Skills', 'Security', 'Sales', 'Marketing', 'Finance', 'Operations'];
  const statuses = ['active', 'upcoming', 'completed', 'cancelled'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const types = ['online', 'in-person', 'hybrid'];

  // Filter courses
  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || course.category === selectedCategory) &&
    (selectedStatus === 'all' || course.status === selectedStatus)
  );

  // Calculate metrics
  const totalEnrolled = courses.reduce((sum, course) => sum + course.enrolled, 0);
  const totalCompleted = courses.reduce((sum, course) => sum + course.completed, 0);
  const completionRate = totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0;
  const avgRating = courses.reduce((sum, course) => sum + course.rating, 0) / courses.length;

  // Chart data
  const enrollmentData = courses.slice(0, 6).map(course => ({
    label: course.courseName.split(' ').slice(0, 2).join(' '),
    value: course.enrolled
  }));

  const completionData = courses.slice(0, 6).map(course => ({
    label: course.courseName.split(' ').slice(0, 2).join(' '),
    value: course.enrolled > 0 ? Math.round((course.completed / course.enrolled) * 100) : 0
  }));

  const categoryData = categories.map(category => ({
    label: category,
    value: courses.filter(course => course.category === category).length
  }));

  // Upcoming sessions
  const upcomingSessions = trainingSessions
    .filter(session => session.status === 'scheduled' && new Date(`${session.date}T${session.time}`) > new Date())
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
    .slice(0, 5);

  // Today's sessions
  const todaySessions = trainingSessions.filter(session => 
    session.date === new Date().toISOString().split('T')[0] && session.status === 'scheduled'
  );

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCourse: Course = {
      id: Date.now().toString(),
      courseName: formData.courseName,
      category: formData.category,
      instructor: formData.instructor,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: formData.duration,
      maxCapacity: parseInt(formData.maxCapacity),
      location: formData.location,
      type: formData.type as 'online' | 'in-person' | 'hybrid',
      difficulty: formData.difficulty as 'beginner' | 'intermediate' | 'advanced',
      price: parseInt(formData.price),
      description: formData.description,
      materials: formData.materials.split('\n').filter(m => m.trim()),
      prerequisites: formData.prerequisites.split('\n').filter(p => p.trim()),
      enrolled: 0,
      completed: 0,
      status: 'upcoming',
      rating: 0
    };

    if (editingCourse) {
      setCourses(courses.map(course => course.id === editingCourse.id ? { ...newCourse, id: editingCourse.id, enrolled: editingCourse.enrolled, completed: editingCourse.completed } : course));
    } else {
      setCourses([...courses, newCourse]);
    }

    setShowAddModal(false);
    resetForm();
    setEditingCourse(null);
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSession: TrainingSession = {
      id: Date.now().toString(),
      courseId: selectedCourse || '',
      sessionName: sessionForm.sessionName,
      date: sessionForm.date,
      time: sessionForm.time,
      duration: sessionForm.duration,
      instructor: sessionForm.instructor,
      attendees: 0,
      maxAttendees: parseInt(sessionForm.maxAttendees),
      status: 'scheduled',
      meetingLink: sessionForm.meetingLink || undefined,
      location: sessionForm.location || undefined
    };

    setTrainingSessions([...trainingSessions, newSession]);
    setShowSessionModal(false);
    resetSessionForm();
  };

  const handleEnrollEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      employeeId: enrollForm.employeeId,
      courseId: enrollForm.courseId,
      enrollmentDate: new Date().toISOString().split('T')[0],
      progress: 0,
      status: 'enrolled',
      certificateIssued: false
    };

    setEnrollments([...enrollments, newEnrollment]);
    
    // Update course enrollment count
    setCourses(courses.map(course => 
      course.id === enrollForm.courseId 
        ? { ...course, enrolled: course.enrolled + 1 }
        : course
    ));

    setShowEnrollModal(false);
    resetEnrollForm();
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleStartSession = (sessionId: string) => {
    setTrainingSessions(sessions => 
      sessions.map(session => 
        session.id === sessionId 
          ? { ...session, status: 'in-progress' }
          : session
      )
    );
  };

  const handleCompleteSession = (sessionId: string) => {
    setTrainingSessions(sessions => 
      sessions.map(session => 
        session.id === sessionId 
          ? { ...session, status: 'completed' }
          : session
      )
    );
  };

  const resetForm = () => {
    setFormData({
      courseName: '',
      category: '',
      instructor: '',
      startDate: '',
      endDate: '',
      duration: '',
      maxCapacity: '',
      location: '',
      type: 'online',
      difficulty: 'beginner',
      price: '',
      description: '',
      materials: '',
      prerequisites: ''
    });
  };

  const resetSessionForm = () => {
    setSessionForm({
      sessionName: '',
      date: '',
      time: '',
      duration: '',
      instructor: '',
      maxAttendees: '',
      meetingLink: '',
      location: ''
    });
  };

  const resetEnrollForm = () => {
    setEnrollForm({
      employeeId: '',
      courseId: ''
    });
  };

  const openEditModal = (course: Course) => {
    setFormData({
      courseName: course.courseName,
      category: course.category,
      instructor: course.instructor,
      startDate: course.startDate,
      endDate: course.endDate,
      duration: course.duration,
      maxCapacity: course.maxCapacity.toString(),
      location: course.location,
      type: course.type,
      difficulty: course.difficulty,
      price: course.price.toString(),
      description: course.description,
      materials: course.materials.join('\n'),
      prerequisites: course.prerequisites.join('\n')
    });
    setEditingCourse(course);
    setShowAddModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return <Video className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      case 'hybrid': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const generateReport = () => {
    const reportData = [
      'TRAINING REPORT',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'SUMMARY:',
      `Total Courses: ${courses.length}`,
      `Total Enrolled: ${totalEnrolled}`,
      `Total Completed: ${totalCompleted}`,
      `Completion Rate: ${completionRate}%`,
      `Average Rating: ${avgRating.toFixed(1)}/5`,
      '',
      'BY CATEGORY:',
      ...categories.map(category => {
        const categoryStats = courses.filter(course => course.category === category);
        const categoryEnrolled = categoryStats.reduce((sum, course) => sum + course.enrolled, 0);
        return `${category}: ${categoryStats.length} courses, ${categoryEnrolled} enrolled`;
      }),
      '',
      'COURSE DETAILS:',
      ...filteredCourses.map(course => 
        `${course.courseName}: ${course.enrolled} enrolled, ${course.completed} completed (${course.enrolled > 0 ? Math.round((course.completed / course.enrolled) * 100) : 0}%)`
      )
    ].join('\n');

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `training-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Training & Development</h2>
          <p className="text-sm text-gray-600 mt-1">Manage courses, sessions, and employee development</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="courses">Courses</option>
            <option value="sessions">Sessions</option>
            <option value="enrollments">Enrollments</option>
            <option value="analytics">Analytics</option>
          </select>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Today's Sessions Alert */}
      {todaySessions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Today's Training Sessions ({todaySessions.length})</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todaySessions.map(session => (
              <div key={session.id} className="bg-white p-3 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{session.sessionName}</span>
                  <span className="text-sm text-gray-600">{session.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <User className="h-4 w-4" />
                  <span>{session.instructor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {session.meetingLink && (
                    <button
                      onClick={() => window.open(session.meetingLink, '_blank')}
                      className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Video size={14} />
                      <span>Join</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleStartSession(session.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                  >
                    <Play size={14} />
                    <span>Start</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Training Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('courses')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              <p className="text-xs text-blue-600 mt-1">{courses.filter(c => c.status === 'active').length} active</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('enrollments')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">{totalEnrolled}</p>
              <p className="text-xs text-green-600 mt-1">↗ +12% this month</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('analytics')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              <p className="text-xs text-purple-600 mt-1">↗ +5% from last month</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('sessions')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
              <p className="text-xs text-yellow-600 mt-1">Out of 5.0</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={generateReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
          <button 
            onClick={() => setShowSessionModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <Calendar size={16} />
            <span>Schedule Session</span>
          </button>
          <button 
            onClick={() => setShowEnrollModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <User size={16} />
            <span>Enroll Employee</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {viewType === 'courses' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Courses</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-2">
                    <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">{course.courseName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{course.instructor}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{course.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(course.type)}
                      <span className="font-medium capitalize">{course.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">${course.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Enrolled:</span>
                    <span className="font-medium">{course.enrolled}/{course.maxCapacity}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">{course.completed}</span>
                  </div>
                  {course.rating > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {getRatingStars(course.rating)}
                        <span className="text-sm text-gray-600 ml-1">{course.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{course.enrolled > 0 ? Math.round((course.completed / course.enrolled) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.enrolled > 0 ? (course.completed / course.enrolled) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openEditModal(course)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit Course"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(course.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete Course"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      className="text-gray-600 hover:text-gray-800 p-1"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCourse(course.id);
                      setShowEnrollModal(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Enroll
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewType === 'sessions' && (
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Training Sessions</h3>
              <button 
                onClick={() => setShowSessionModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <Plus size={16} />
                <span>Add Session</span>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {trainingSessions.map(session => {
                const course = courses.find(c => c.id === session.courseId);
                return (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{session.sessionName}</h4>
                        <p className="text-sm text-gray-600">{course?.courseName}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        session.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>{session.time} ({session.duration})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User size={14} />
                        <span>{session.instructor}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={14} />
                        <span>{session.attendees}/{session.maxAttendees} attendees</span>
                      </div>
                      {session.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin size={14} />
                          <span>{session.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {session.meetingLink && (
                        <button
                          onClick={() => window.open(session.meetingLink, '_blank')}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Video size={14} />
                          <span>Join</span>
                        </button>
                      )}
                      {session.status === 'scheduled' && (
                        <button
                          onClick={() => handleStartSession(session.id)}
                          className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                        >
                          <Play size={14} />
                          <span>Start</span>
                        </button>
                      )}
                      {session.status === 'in-progress' && (
                        <button
                          onClick={() => handleCompleteSession(session.id)}
                          className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle size={14} />
                          <span>Complete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {viewType === 'enrollments' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Employee Enrollments</h3>
            <button 
              onClick={() => setShowEnrollModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
            >
              <Plus size={16} />
              <span>Enroll Employee</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900">Employee</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900">Course</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900">Progress</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900 hidden sm:table-cell">Enrolled Date</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900 hidden md:table-cell">Score</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enrollments.map((enrollment) => {
                  const employee = mockEmployees.find(emp => emp.id === enrollment.employeeId);
                  const course = courses.find(c => c.id === enrollment.courseId);
                  if (!employee || !course) return null;
                  
                  return (
                    <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate">{employee.name}</div>
                            <div className="text-sm text-gray-500 truncate">{employee.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="font-medium text-gray-900 truncate">{course.courseName}</div>
                        <div className="text-sm text-gray-500">{course.category}</div>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          enrollment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          enrollment.status === 'enrolled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-gray-900 text-sm hidden sm:table-cell">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 sm:p-4 text-gray-900 hidden md:table-cell">
                        {enrollment.score ? `${enrollment.score}%` : '-'}
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1" title="View Progress">
                            <Eye size={16} />
                          </button>
                          {enrollment.certificateIssued && (
                            <button className="text-green-600 hover:text-green-800 p-1" title="Download Certificate">
                              <Award size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewType === 'analytics' && (
        <div className="space-y-6">
          {/* Training Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Enrollment</h3>
              <Chart data={enrollmentData} type="bar" height={300} color="#3B82F6" />
              <div className="mt-3 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Total Enrolled: {totalEnrolled}</span>
                  <span>Avg per Course: {Math.round(totalEnrolled / courses.length)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rates</h3>
              <Chart data={completionData} type="line" height={300} color="#10B981" />
              <div className="mt-3 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Overall Rate: {completionRate}%</span>
                  <span>Target: 85%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Training by Category</h3>
            <Chart data={categoryData} type="bar" height={250} color="#8B5CF6" />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                This Month
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">New Enrollments:</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completions:</span>
                  <span className="font-medium">{totalCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificates Issued:</span>
                  <span className="font-medium">{enrollments.filter(e => e.certificateIssued).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Score:</span>
                  <span className="font-medium">87%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h4>
              <div className="space-y-3">
                {enrollments
                  .filter(e => e.score && e.status === 'completed')
                  .sort((a, b) => (b.score || 0) - (a.score || 0))
                  .slice(0, 3)
                  .map((enrollment, index) => {
                    const employee = mockEmployees.find(emp => emp.id === enrollment.employeeId);
                    const course = courses.find(c => c.id === enrollment.courseId);
                    return (
                      <div key={enrollment.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <img
                            src={employee?.avatar}
                            alt={employee?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-green-900 text-sm truncate">{employee?.name}</div>
                          <div className="text-xs text-green-700 truncate">{course?.courseName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-600">{enrollment.score}%</div>
                          <div className="text-xs text-green-500">#{index + 1}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h4>
              <div className="space-y-3">
                {upcomingSessions.slice(0, 3).map(session => (
                  <div key={session.id} className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900 text-sm">{session.sessionName}</div>
                    <div className="text-sm text-blue-700">
                      {new Date(session.date).toLocaleDateString()} • {session.time}
                    </div>
                    <div className="text-xs text-blue-600">{session.instructor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCourse(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.courseName}
                      onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter course name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.instructor}
                      onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter instructor name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 8 weeks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Capacity *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Maximum number of participants"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Conference Room A, Online"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {types.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty *
                    </label>
                    <select
                      required
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Course price"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the course objectives and content..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Materials (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.materials}
                      onChange={(e) => setFormData({...formData, materials: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Course Handbook&#10;Video Lectures&#10;Practice Exercises"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prerequisites (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.prerequisites}
                      onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Basic knowledge required&#10;Previous course completion"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingCourse(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{editingCourse ? 'Update Course' : 'Create Course'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Schedule Training Session</h3>
                <button
                  onClick={() => {
                    setShowSessionModal(false);
                    resetSessionForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddSession} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course *
                    </label>
                    <select
                      required
                      value={selectedCourse || ''}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Course</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.courseName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={sessionForm.sessionName}
                      onChange={(e) => setSessionForm({...sessionForm, sessionName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter session name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={sessionForm.date}
                      onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={sessionForm.time}
                      onChange={(e) => setSessionForm({...sessionForm, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration *
                    </label>
                    <input
                      type="text"
                      required
                      value={sessionForm.duration}
                      onChange={(e) => setSessionForm({...sessionForm, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2 hours"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor *
                    </label>
                    <input
                      type="text"
                      required
                      value={sessionForm.instructor}
                      onChange={(e) => setSessionForm({...sessionForm, instructor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter instructor name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Attendees *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={sessionForm.maxAttendees}
                      onChange={(e) => setSessionForm({...sessionForm, maxAttendees: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Maximum attendees"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={sessionForm.location}
                      onChange={(e) => setSessionForm({...sessionForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Conference Room A"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting Link
                    </label>
                    <input
                      type="url"
                      value={sessionForm.meetingLink}
                      onChange={(e) => setSessionForm({...sessionForm, meetingLink: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSessionModal(false);
                      resetSessionForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Calendar size={16} />
                    <span>Schedule Session</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Employee Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Enroll Employee</h3>
                <button
                  onClick={() => {
                    setShowEnrollModal(false);
                    resetEnrollForm();
                    setSelectedCourse(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEnrollEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee *
                  </label>
                  <select
                    required
                    value={enrollForm.employeeId}
                    onChange={(e) => setEnrollForm({...enrollForm, employeeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Employee</option>
                    {mockEmployees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <select
                    required
                    value={enrollForm.courseId || selectedCourse || ''}
                    onChange={(e) => setEnrollForm({...enrollForm, courseId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Course</option>
                    {courses.filter(course => course.status === 'active' || course.status === 'upcoming').map(course => (
                      <option key={course.id} value={course.id}>
                        {course.courseName} - {course.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEnrollModal(false);
                      resetEnrollForm();
                      setSelectedCourse(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <User size={16} />
                    <span>Enroll Employee</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this course? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCourse(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;