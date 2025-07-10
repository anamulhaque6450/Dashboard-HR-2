export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  performanceRating: number;
  attendanceRate: number;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar: string;
}

export interface PerformanceData {
  month: string;
  department: string;
  score: number;
}

export interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  late: number;
}

export interface RecruitmentData {
  id: string;
  position: string;
  department: string;
  applicants: number;
  stage: 'applied' | 'screening' | 'interview' | 'hired' | 'rejected';
  priority: 'high' | 'medium' | 'low';
}

export interface TrainingData {
  id: string;
  courseName: string;
  enrolled: number;
  completed: number;
  duration: string;
  category: string;
}

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Engineering',
    role: 'Senior Developer',
    salary: 85000,
    performanceRating: 4.8,
    attendanceRate: 96,
    joinDate: '2022-03-15',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    department: 'Marketing',
    role: 'Marketing Manager',
    salary: 72000,
    performanceRating: 4.5,
    attendanceRate: 92,
    joinDate: '2021-08-22',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    department: 'Finance',
    role: 'Financial Analyst',
    salary: 68000,
    performanceRating: 4.2,
    attendanceRate: 98,
    joinDate: '2023-01-10',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    department: 'Sales',
    role: 'Sales Representative',
    salary: 58000,
    performanceRating: 3.9,
    attendanceRate: 88,
    joinDate: '2022-11-05',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@company.com',
    department: 'HR',
    role: 'HR Specialist',
    salary: 62000,
    performanceRating: 4.6,
    attendanceRate: 95,
    joinDate: '2021-05-18',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '6',
    name: 'James Anderson',
    email: 'james.anderson@company.com',
    department: 'Operations',
    role: 'Operations Manager',
    salary: 78000,
    performanceRating: 4.3,
    attendanceRate: 94,
    joinDate: '2022-07-12',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '7',
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    department: 'Product',
    role: 'Product Designer',
    salary: 71000,
    performanceRating: 4.7,
    attendanceRate: 97,
    joinDate: '2023-02-28',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '8',
    name: 'Robert Kim',
    email: 'robert.kim@company.com',
    department: 'Engineering',
    role: 'Backend Developer',
    salary: 82000,
    performanceRating: 4.4,
    attendanceRate: 91,
    joinDate: '2021-11-15',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '9',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@company.com',
    department: 'Marketing',
    role: 'Content Specialist',
    salary: 55000,
    performanceRating: 4.1,
    attendanceRate: 93,
    joinDate: '2023-04-03',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '10',
    name: 'Alex Turner',
    email: 'alex.turner@company.com',
    department: 'Sales',
    role: 'Sales Manager',
    salary: 75000,
    performanceRating: 4.0,
    attendanceRate: 89,
    joinDate: '2022-01-20',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export const mockPerformanceData: PerformanceData[] = [
  { month: 'Jan', department: 'Engineering', score: 88 },
  { month: 'Feb', department: 'Engineering', score: 92 },
  { month: 'Mar', department: 'Engineering', score: 87 },
  { month: 'Apr', department: 'Engineering', score: 94 },
  { month: 'May', department: 'Engineering', score: 91 },
  { month: 'Jun', department: 'Engineering', score: 89 },
  { month: 'Jan', department: 'Marketing', score: 82 },
  { month: 'Feb', department: 'Marketing', score: 86 },
  { month: 'Mar', department: 'Marketing', score: 84 },
  { month: 'Apr', department: 'Marketing', score: 88 },
  { month: 'May', department: 'Marketing', score: 85 },
  { month: 'Jun', department: 'Marketing', score: 87 }
];

export const mockAttendanceData: AttendanceData[] = [
  { date: '2024-01-01', present: 142, absent: 8, late: 12 },
  { date: '2024-01-02', present: 145, absent: 5, late: 10 },
  { date: '2024-01-03', present: 148, absent: 7, late: 8 },
  { date: '2024-01-04', present: 144, absent: 6, late: 14 },
  { date: '2024-01-05', present: 147, absent: 4, late: 9 },
  { date: '2024-01-06', present: 149, absent: 3, late: 7 },
  { date: '2024-01-07', present: 146, absent: 5, late: 11 }
];

export const mockRecruitmentData: RecruitmentData[] = [
  {
    id: '1',
    position: 'Senior Frontend Developer',
    department: 'Engineering',
    applicants: 24,
    stage: 'interview',
    priority: 'high'
  },
  {
    id: '2',
    position: 'Product Manager',
    department: 'Product',
    applicants: 18,
    stage: 'screening',
    priority: 'high'
  },
  {
    id: '3',
    position: 'Marketing Specialist',
    department: 'Marketing',
    applicants: 32,
    stage: 'applied',
    priority: 'medium'
  },
  {
    id: '4',
    position: 'Data Analyst',
    department: 'Analytics',
    applicants: 15,
    stage: 'hired',
    priority: 'medium'
  }
];

export const mockTrainingData: TrainingData[] = [
  {
    id: '1',
    courseName: 'Leadership Development',
    enrolled: 28,
    completed: 22,
    duration: '8 weeks',
    category: 'Management'
  },
  {
    id: '2',
    courseName: 'Technical Skills Bootcamp',
    enrolled: 45,
    completed: 38,
    duration: '12 weeks',
    category: 'Technical'
  },
  {
    id: '3',
    courseName: 'Communication Excellence',
    enrolled: 35,
    completed: 31,
    duration: '6 weeks',
    category: 'Soft Skills'
  },
  {
    id: '4',
    courseName: 'Cybersecurity Awareness',
    enrolled: 120,
    completed: 95,
    duration: '2 weeks',
    category: 'Security'
  }
];

export const mockNotifications = [
  {
    id: '1',
    type: 'warning',
    message: 'Performance reviews are due for 5 employees',
    timestamp: '2024-01-10T09:00:00Z',
    read: false
  },
  {
    id: '2',
    type: 'info',
    message: 'New training program available: Advanced Excel',
    timestamp: '2024-01-10T08:30:00Z',
    read: false
  },
  {
    id: '3',
    type: 'success',
    message: 'Payroll processed successfully for January',
    timestamp: '2024-01-09T16:45:00Z',
    read: true
  },
  {
    id: '4',
    type: 'alert',
    message: 'High absence rate detected in Sales department',
    timestamp: '2024-01-09T14:20:00Z',
    read: false
  }
];