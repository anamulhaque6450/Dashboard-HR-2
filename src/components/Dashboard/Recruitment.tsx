import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Users, Clock, MapPin, Video, Phone, Mail, Edit, Trash2, Eye, CheckCircle, X, Save, ExternalLink } from 'lucide-react';

interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: string;
  description: string;
  requirements: string[];
  status: 'open' | 'closed' | 'on-hold';
  applicants: number;
  posted: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  score: number;
  appliedDate: string;
  resume: string;
  notes: string;
  avatar: string;
}

interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  type: 'phone' | 'video' | 'in-person';
  interviewer: string;
  location?: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

const Recruitment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('positions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState<Candidate | null>(null);

  // Mock data
  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: '$120,000 - $150,000',
      description: 'We are looking for a Senior Frontend Developer to join our engineering team.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership skills'],
      status: 'open',
      applicants: 24,
      posted: '2024-01-15',
      deadline: '2024-02-15',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'full-time',
      salary: '$130,000 - $160,000',
      description: 'Seeking an experienced Product Manager to drive product strategy.',
      requirements: ['3+ years PM experience', 'Agile methodology', 'Data-driven mindset'],
      status: 'open',
      applicants: 18,
      posted: '2024-01-20',
      deadline: '2024-02-20',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Remote',
      type: 'full-time',
      salary: '$60,000 - $80,000',
      description: 'Join our marketing team to create compelling campaigns.',
      requirements: ['2+ years marketing experience', 'Social media expertise', 'Content creation'],
      status: 'open',
      applicants: 32,
      posted: '2024-01-10',
      deadline: '2024-02-10',
      priority: 'medium'
    }
  ]);

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Frontend Developer',
      stage: 'interview',
      score: 85,
      appliedDate: '2024-01-16',
      resume: 'john-smith-resume.pdf',
      notes: 'Strong technical background, good communication skills',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 234-5678',
      position: 'Product Manager',
      stage: 'screening',
      score: 78,
      appliedDate: '2024-01-21',
      resume: 'sarah-johnson-resume.pdf',
      notes: 'Great product sense, needs technical depth',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 345-6789',
      position: 'Marketing Specialist',
      stage: 'applied',
      score: 72,
      appliedDate: '2024-01-11',
      resume: 'mike-chen-resume.pdf',
      notes: 'Creative portfolio, limited experience',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      position: 'Senior Frontend Developer',
      stage: 'rejected',
      score: 45,
      appliedDate: '2024-01-17',
      resume: 'emily-davis-resume.pdf',
      notes: 'Insufficient experience for senior role',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 567-8901',
      position: 'Product Manager',
      stage: 'hired',
      score: 92,
      appliedDate: '2024-01-22',
      resume: 'david-wilson-resume.pdf',
      notes: 'Excellent candidate, strong hire',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  ]);

  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      candidateId: '1',
      candidateName: 'John Smith',
      position: 'Senior Frontend Developer',
      date: '2024-01-25',
      time: '14:00',
      type: 'video',
      interviewer: 'Sarah Johnson',
      meetingLink: 'https://zoom.us/j/123456789',
      status: 'scheduled',
      notes: 'Technical interview - React and TypeScript focus'
    },
    {
      id: '2',
      candidateId: '2',
      candidateName: 'Sarah Johnson',
      position: 'Product Manager',
      date: '2024-01-26',
      time: '10:00',
      type: 'phone',
      interviewer: 'Mike Chen',
      status: 'scheduled',
      notes: 'Initial screening call'
    }
  ]);

  const [positionForm, setPositionForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time' as const,
    salary: '',
    description: '',
    requirements: '',
    deadline: '',
    priority: 'medium' as const
  });

  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '',
    type: 'video' as const,
    interviewer: '',
    location: '',
    meetingLink: '',
    notes: ''
  });

  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const interviewers = ['Sarah Johnson', 'Mike Chen', 'David Wilson', 'Emily Davis', 'John Smith'];

  // Filter functions
  const filteredPositions = positions.filter(pos => 
    pos.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDepartment === 'all' || pos.department === filterDepartment) &&
    (filterStatus === 'all' || pos.status === filterStatus)
  );

  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDepartment === 'all' || positions.find(p => p.title === candidate.position)?.department === filterDepartment) &&
    (filterStatus === 'all' || candidate.stage === filterStatus)
  );

  // Form handlers
  const resetPositionForm = () => {
    setPositionForm({
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      salary: '',
      description: '',
      requirements: '',
      deadline: '',
      priority: 'medium'
    });
  };

  const handlePositionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPosition: Position = {
      id: editingPosition ? editingPosition.id : Date.now().toString(),
      title: positionForm.title,
      department: positionForm.department,
      location: positionForm.location,
      type: positionForm.type,
      salary: positionForm.salary,
      description: positionForm.description,
      requirements: positionForm.requirements.split('\n').filter(req => req.trim()),
      status: 'open',
      applicants: editingPosition ? editingPosition.applicants : 0,
      posted: editingPosition ? editingPosition.posted : new Date().toISOString().split('T')[0],
      deadline: positionForm.deadline,
      priority: positionForm.priority
    };

    if (editingPosition) {
      setPositions(positions.map(pos => pos.id === editingPosition.id ? newPosition : pos));
    } else {
      setPositions([...positions, newPosition]);
    }

    setShowPositionModal(false);
    resetPositionForm();
    setEditingPosition(null);
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCandidate) return;

    const candidate = candidates.find(c => c.id === selectedCandidate);
    if (!candidate) return;

    const newInterview: Interview = {
      id: Date.now().toString(),
      candidateId: selectedCandidate,
      candidateName: candidate.name,
      position: candidate.position,
      date: interviewForm.date,
      time: interviewForm.time,
      type: interviewForm.type,
      interviewer: interviewForm.interviewer,
      location: interviewForm.location || undefined,
      meetingLink: interviewForm.meetingLink || undefined,
      status: 'scheduled',
      notes: interviewForm.notes || undefined
    };

    setInterviews([...interviews, newInterview]);
    
    // Update candidate stage to interview
    setCandidates(candidates.map(c => 
      c.id === selectedCandidate ? { ...c, stage: 'interview' } : c
    ));

    setShowInterviewModal(false);
    setInterviewForm({
      date: '',
      time: '',
      type: 'video',
      interviewer: '',
      location: '',
      meetingLink: '',
      notes: ''
    });
    setSelectedCandidate(null);
  };

  const openPositionModal = (position?: Position) => {
    if (position) {
      setPositionForm({
        title: position.title,
        department: position.department,
        location: position.location,
        type: position.type,
        salary: position.salary,
        description: position.description,
        requirements: position.requirements.join('\n'),
        deadline: position.deadline,
        priority: position.priority
      });
      setEditingPosition(position);
    } else {
      resetPositionForm();
      setEditingPosition(null);
    }
    setShowPositionModal(true);
  };

  const deletePosition = (id: string) => {
    if (confirm('Are you sure you want to delete this position?')) {
      setPositions(positions.filter(pos => pos.id !== id));
    }
  };

  const updateCandidateStage = (candidateId: string, newStage: Candidate['stage']) => {
    setCandidates(candidates.map(c => 
      c.id === candidateId ? { ...c, stage: newStage } : c
    ));
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-orange-100 text-orange-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Kanban board data
  const kanbanStages = [
    { id: 'applied', title: 'Applied', color: 'bg-blue-50 border-blue-200' },
    { id: 'screening', title: 'Screening', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'interview', title: 'Interview', color: 'bg-purple-50 border-purple-200' },
    { id: 'offer', title: 'Offer', color: 'bg-orange-50 border-orange-200' },
    { id: 'hired', title: 'Hired', color: 'bg-green-50 border-green-200' },
    { id: 'rejected', title: 'Rejected', color: 'bg-red-50 border-red-200' }
  ];

  const getCandidatesByStage = (stage: string) => {
    return filteredCandidates.filter(candidate => candidate.stage === stage);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Recruitment Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage job positions and candidate pipeline</p>
        </div>
        <button 
          onClick={() => openPositionModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 w-full lg:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Add Position</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4 sm:px-6" aria-label="Tabs">
            {[
              { id: 'positions', label: 'Open Positions', count: positions.filter(p => p.status === 'open').length },
              { id: 'candidates', label: 'Candidates', count: candidates.length },
              { id: 'kanban', label: 'Pipeline', count: candidates.filter(c => c.stage !== 'rejected' && c.stage !== 'hired').length },
              { id: 'interviews', label: 'Interviews', count: interviews.filter(i => i.status === 'scheduled').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Filter */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              {activeTab !== 'kanban' && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
                >
                  <option value="all">All Status</option>
                  {activeTab === 'positions' ? (
                    <>
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                      <option value="on-hold">On Hold</option>
                    </>
                  ) : (
                    <>
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </>
                  )}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {/* Positions Tab */}
          {activeTab === 'positions' && (
            <div className="space-y-4">
              {filteredPositions.map((position) => (
                <div key={position.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(position.status)}`}>
                            {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(position.priority)}`}>
                            {position.priority.charAt(0).toUpperCase() + position.priority.slice(1)} Priority
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Users size={16} />
                          <span>{position.department}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin size={16} />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span>{position.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>Due: {new Date(position.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{position.description}</p>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{position.applicants} applicants</span> • 
                        <span className="ml-1">Salary: {position.salary}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 lg:ml-4">
                      <button 
                        onClick={() => openPositionModal(position)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                        title="Edit Position"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deletePosition(position.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                        title="Delete Position"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredPositions.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No positions found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new position.</p>
                </div>
              )}
            </div>
          )}

          {/* Candidates Tab */}
          {activeTab === 'candidates' && (
            <div className="space-y-4">
              {filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-center space-x-4">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">{candidate.position}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(candidate.stage)}`}>
                            {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500">Score: {candidate.score}/100</span>
                          <span className="text-xs text-gray-500">Applied: {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedCandidateDetails(candidate);
                            setShowCandidateModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
                          className="text-green-600 hover:text-green-800 transition-colors p-2"
                          title="Send Email"
                        >
                          <Mail size={18} />
                        </button>
                        <button 
                          onClick={() => window.open(`tel:${candidate.phone}`, '_blank')}
                          className="text-purple-600 hover:text-purple-800 transition-colors p-2"
                          title="Call"
                        >
                          <Phone size={18} />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {candidate.stage !== 'hired' && candidate.stage !== 'rejected' && (
                          <button 
                            onClick={() => {
                              setSelectedCandidate(candidate.id);
                              setShowInterviewModal(true);
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Schedule Interview
                          </button>
                        )}
                        
                        <select
                          value={candidate.stage}
                          onChange={(e) => updateCandidateStage(candidate.id, e.target.value as Candidate['stage'])}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="applied">Applied</option>
                          <option value="screening">Screening</option>
                          <option value="interview">Interview</option>
                          <option value="offer">Offer</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredCandidates.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
                  <p className="mt-1 text-sm text-gray-500">Candidates will appear here as they apply.</p>
                </div>
              )}
            </div>
          )}

          {/* Kanban Tab */}
          {activeTab === 'kanban' && (
            <div className="overflow-x-auto">
              <div className="flex space-x-4 min-w-max pb-4">
                {kanbanStages.map((stage) => {
                  const stageCandidates = getCandidatesByStage(stage.id);
                  return (
                    <div key={stage.id} className={`w-80 ${stage.color} border-2 rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                          {stageCandidates.length}
                        </span>
                      </div>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {stageCandidates.map((candidate) => (
                          <div key={candidate.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center space-x-3 mb-2">
                              <img
                                src={candidate.avatar}
                                alt={candidate.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{candidate.name}</h4>
                                <p className="text-xs text-gray-600 truncate">{candidate.position}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Score: {candidate.score}/100</span>
                              <span>{new Date(candidate.appliedDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="mt-2 flex items-center space-x-1">
                              <button 
                                onClick={() => {
                                  setSelectedCandidateDetails(candidate);
                                  setShowCandidateModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button 
                                onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Email"
                              >
                                <Mail size={14} />
                              </button>
                              {candidate.stage !== 'hired' && candidate.stage !== 'rejected' && (
                                <button 
                                  onClick={() => {
                                    setSelectedCandidate(candidate.id);
                                    setShowInterviewModal(true);
                                  }}
                                  className="text-purple-600 hover:text-purple-800 p-1"
                                  title="Schedule Interview"
                                >
                                  <Calendar size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {stageCandidates.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No candidates</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interviews Tab */}
          {activeTab === 'interviews' && (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{interview.candidateName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                          interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{interview.position}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{new Date(interview.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span>{interview.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {interview.type === 'video' ? <Video size={16} /> :
                           interview.type === 'phone' ? <Phone size={16} /> :
                           <MapPin size={16} />}
                          <span>{interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users size={16} />
                          <span>{interview.interviewer}</span>
                        </div>
                      </div>
                      
                      {interview.notes && (
                        <p className="text-sm text-gray-600 mt-2">{interview.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 lg:ml-4">
                      {interview.meetingLink && (
                        <button 
                          onClick={() => window.open(interview.meetingLink, '_blank')}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
                        >
                          <ExternalLink size={16} />
                          <span>Join Meeting</span>
                        </button>
                      )}
                      
                      <button 
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                        title="Edit Interview"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {interviews.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews scheduled</h3>
                  <p className="mt-1 text-sm text-gray-500">Schedule interviews with candidates to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Position Modal */}
      {showPositionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingPosition ? 'Edit Position' : 'Add New Position'}
                </h3>
                <button
                  onClick={() => setShowPositionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handlePositionSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={positionForm.title}
                      onChange={(e) => setPositionForm({...positionForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Senior Frontend Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      required
                      value={positionForm.department}
                      onChange={(e) => setPositionForm({...positionForm, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={positionForm.location}
                      onChange={(e) => setPositionForm({...positionForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. San Francisco, CA or Remote"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Type *
                    </label>
                    <select
                      required
                      value={positionForm.type}
                      onChange={(e) => setPositionForm({...positionForm, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary Range *
                    </label>
                    <input
                      type="text"
                      required
                      value={positionForm.salary}
                      onChange={(e) => setPositionForm({...positionForm, salary: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. $80,000 - $120,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Application Deadline *
                    </label>
                    <input
                      type="date"
                      required
                      value={positionForm.deadline}
                      onChange={(e) => setPositionForm({...positionForm, deadline: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={positionForm.priority}
                    onChange={(e) => setPositionForm({...positionForm, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={positionForm.description}
                    onChange={(e) => setPositionForm({...positionForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={positionForm.requirements}
                    onChange={(e) => setPositionForm({...positionForm, requirements: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5+ years of experience&#10;Bachelor's degree in Computer Science&#10;Proficiency in React and TypeScript"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowPositionModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{editingPosition ? 'Update Position' : 'Create Position'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Schedule Interview</h3>
                <button
                  onClick={() => setShowInterviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleScheduleInterview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={interviewForm.date}
                      onChange={(e) => setInterviewForm({...interviewForm, date: e.target.value})}
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
                      value={interviewForm.time}
                      onChange={(e) => setInterviewForm({...interviewForm, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Type *
                  </label>
                  <select
                    required
                    value={interviewForm.type}
                    onChange={(e) => setInterviewForm({...interviewForm, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interviewer *
                  </label>
                  <select
                    required
                    value={interviewForm.interviewer}
                    onChange={(e) => setInterviewForm({...interviewForm, interviewer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Interviewer</option>
                    {interviewers.map(interviewer => (
                      <option key={interviewer} value={interviewer}>{interviewer}</option>
                    ))}
                  </select>
                </div>

                {interviewForm.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting Link *
                    </label>
                    <input
                      type="url"
                      required={interviewForm.type === 'video'}
                      value={interviewForm.meetingLink}
                      onChange={(e) => setInterviewForm({...interviewForm, meetingLink: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                    />
                  </div>
                )}

                {interviewForm.type === 'in-person' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      required={interviewForm.type === 'in-person'}
                      value={interviewForm.location}
                      onChange={(e) => setInterviewForm({...interviewForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Conference Room A, 123 Main St, etc."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={interviewForm.notes}
                    onChange={(e) => setInterviewForm({...interviewForm, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Interview focus, preparation notes, etc."
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowInterviewModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Calendar size={16} />
                    <span>Schedule Interview</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Details Modal */}
      {showCandidateModal && selectedCandidateDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedCandidateDetails.avatar}
                    alt={selectedCandidateDetails.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedCandidateDetails.name}</h3>
                    <p className="text-gray-600">{selectedCandidateDetails.position}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(selectedCandidateDetails.stage)}`}>
                      {selectedCandidateDetails.stage.charAt(0).toUpperCase() + selectedCandidateDetails.stage.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCandidateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail size={16} className="text-gray-400" />
                      <a href={`mailto:${selectedCandidateDetails.email}`} className="text-blue-600 hover:text-blue-800">
                        {selectedCandidateDetails.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-gray-400" />
                      <a href={`tel:${selectedCandidateDetails.phone}`} className="text-blue-600 hover:text-blue-800">
                        {selectedCandidateDetails.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Application Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Applied:</span>
                      <span className="ml-2">{new Date(selectedCandidateDetails.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Score:</span>
                      <span className="ml-2 font-medium">{selectedCandidateDetails.score}/100</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Resume:</span>
                      <button className="ml-2 text-blue-600 hover:text-blue-800">
                        {selectedCandidateDetails.resume}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedCandidateDetails.notes}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowCandidateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setSelectedCandidate(selectedCandidateDetails.id);
                    setShowCandidateModal(false);
                    setShowInterviewModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Calendar size={16} />
                  <span>Schedule Interview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;