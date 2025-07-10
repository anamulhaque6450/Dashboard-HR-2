import React from 'react';
import MetricCard from '../Common/MetricCard';
import Chart from '../Common/Chart';
import { semanticColors, chartColors } from '../../styles/colors';
import { Users, TrendingUp, Calendar, DollarSign, UserCheck, AlertTriangle, Clock, Award, Target, Activity, ChevronRight, Bell, FileText, BarChart3, Zap, Star, ArrowUpRight, ArrowDownRight, Eye, Plus } from 'lucide-react';
import { mockEmployees, mockAttendanceData, mockRecruitmentData } from '../../data/mockData';

interface OverviewProps {
  setActiveSection?: (section: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ setActiveSection }) => {
  // Calculate dynamic metrics from actual data
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const avgSalary = Math.round(mockEmployees.reduce((sum, emp) => sum + emp.salary, 0) / mockEmployees.length);
  const avgAttendance = Math.round(mockEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / mockEmployees.length);
  const openPositions = mockRecruitmentData.filter(pos => pos.stage !== 'hired').length;
  const avgPerformance = mockEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / mockEmployees.length;

  // Calculate additional metrics
  const recentHires = mockEmployees.filter(emp => 
    new Date(emp.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  const highPerformers = mockEmployees.filter(emp => emp.performanceRating >= 4.5).length;
  const lowAttendance = mockEmployees.filter(emp => emp.attendanceRate < 90).length;
  const upcomingReviews = mockEmployees.filter(emp => emp.performanceRating < 4.0).length;

  // Dynamic attendance chart data from last 7 days
  const attendanceChartData = mockAttendanceData.slice(-7).map(item => ({
    label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: item.present
  }));

  // Dynamic department distribution from employee data
  const departmentData = mockEmployees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentChartData = Object.entries(departmentData).map(([dept, count]) => ({
    label: dept.length > 8 ? dept.substring(0, 8) + '...' : dept,
    value: count
  }));

  // Performance trend by department (last 6 months average)
  const performanceTrendData = Object.keys(departmentData).map(dept => {
    const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
    const avgRating = deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / deptEmployees.length;
    return {
      label: dept.length > 6 ? dept.substring(0, 6) + '...' : dept,
      value: Math.round(avgRating * 20) // Convert to percentage scale
    };
  });

  // Salary distribution data
  const salaryRanges = [
    { label: '<50K', min: 0, max: 50000 },
    { label: '50-70K', min: 50000, max: 70000 },
    { label: '70-90K', min: 70000, max: 90000 },
    { label: '>90K', min: 90000, max: Infinity }
  ];

  const salaryDistributionData = salaryRanges.map(range => ({
    label: range.label,
    value: mockEmployees.filter(emp => emp.salary >= range.min && emp.salary < range.max).length
  }));

  // Calculate trends (mock calculation for demonstration)
  const calculateTrend = (current: number, previous: number) => ({
    value: previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0,
    isPositive: current > previous
  });

  // Mock previous period data for trend calculation
  const prevTotalEmployees = totalEmployees - 2;
  const prevAvgSalary = avgSalary - 1500;
  const prevAvgAttendance = avgAttendance + 2;
  const prevAvgPerformance = avgPerformance - 0.1;

  // Navigation functions
  const handleNavigation = (section: string) => {
    if (setActiveSection) {
      setActiveSection(section);
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Activity className="h-6 w-6" />
                </div>
                <span className="text-blue-100 font-medium">HR Dashboard</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                Welcome back, Admin
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
                Your team is performing exceptionally well. Here's a comprehensive overview of your organization's key metrics and insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalEmployees}</div>
                <div className="text-blue-200 text-sm">Total Employees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{avgAttendance}%</div>
                <div className="text-blue-200 text-sm">Avg Attendance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{avgPerformance.toFixed(1)}</div>
                <div className="text-blue-200 text-sm">Performance</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-3">
            <button 
              onClick={() => handleNavigation('employees')}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
            <button 
              onClick={() => handleNavigation('performance')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>View Analytics</span>
            </button>
            <button 
              onClick={() => handleNavigation('notifications')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleNavigation('employees')} className="cursor-pointer group">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-200">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                calculateTrend(totalEmployees, prevTotalEmployees).isPositive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {calculateTrend(totalEmployees, prevTotalEmployees).isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                <span>{Math.abs(calculateTrend(totalEmployees, prevTotalEmployees).value)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Total Employees</h3>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600">{totalEmployees}</p>
              <p className="text-sm text-gray-500">{activeEmployees} active members</p>
            </div>
          </div>
        </div>

        <div onClick={() => handleNavigation('payroll')} className="cursor-pointer group">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-green-200">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                calculateTrend(avgSalary, prevAvgSalary).isPositive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {calculateTrend(avgSalary, prevAvgSalary).isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                <span>{Math.abs(calculateTrend(avgSalary, prevAvgSalary).value)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Average Salary</h3>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600">${avgSalary.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Annual compensation</p>
            </div>
          </div>
        </div>

        <div onClick={() => handleNavigation('attendance')} className="cursor-pointer group">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-200">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                calculateTrend(avgAttendance, prevAvgAttendance).isPositive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {calculateTrend(avgAttendance, prevAvgAttendance).isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                <span>{Math.abs(calculateTrend(avgAttendance, prevAvgAttendance).value)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Attendance Rate</h3>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600">{avgAttendance}%</p>
              <p className="text-sm text-gray-500">This month average</p>
            </div>
          </div>
        </div>

        <div onClick={() => handleNavigation('performance')} className="cursor-pointer group">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:shadow-orange-200">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                calculateTrend(avgPerformance, prevAvgPerformance).isPositive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {calculateTrend(avgPerformance, prevAvgPerformance).isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                <span>{Math.abs(calculateTrend(avgPerformance, prevAvgPerformance).value)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Performance Score</h3>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-600">{avgPerformance.toFixed(1)}</p>
              <p className="text-sm text-gray-500">Out of 5.0 rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Weekly Attendance Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Weekly Attendance Trends</h3>
              <p className="text-gray-500 mt-1">Employee presence over the last 7 days</p>
            </div>
            <button 
              onClick={() => handleNavigation('attendance')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">View Details</span>
            </button>
          </div>
          <div className="w-full overflow-hidden">
            <Chart 
              datasets={[
                {
                  label: 'Present',
                  data: mockAttendanceData.slice(-7).map(item => ({
                    label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
                    value: item.present
                  })),
                  color: '#22c55e',
                  fillOpacity: 0.2
                },
                {
                  label: 'Absent',
                  data: mockAttendanceData.slice(-7).map(item => ({
                    label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
                    value: item.absent
                  })),
                  color: '#ef4444',
                  fillOpacity: 0.1
                },
                {
                  label: 'Late',
                  data: mockAttendanceData.slice(-7).map(item => ({
                    label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
                    value: item.late
                  })),
                  color: '#f59e0b',
                  fillOpacity: 0.1
                }
              ]}
              type="line" 
              height={320} 
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Present</span>
              <span className="font-semibold text-gray-900">
                {Math.round(mockAttendanceData.slice(-7).reduce((sum, item) => sum + item.present, 0) / 7)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Absent</span>
              <span className="font-semibold text-gray-900">
                {Math.round(mockAttendanceData.slice(-7).reduce((sum, item) => sum + item.absent, 0) / 7)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Late</span>
              <span className="font-semibold text-gray-900">
                {Math.round(mockAttendanceData.slice(-7).reduce((sum, item) => sum + item.late, 0) / 7)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Team Highlights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Top Performers
              </h3>
              <p className="text-gray-500 mt-1">Highest rated team members this month</p>
            </div>
            <button 
              onClick={() => handleNavigation('employees')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors"
            >
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">View All</span>
            </button>
          </div>
          <div className="space-y-4">
            {mockEmployees
              .sort((a, b) => b.performanceRating - a.performanceRating)
              .slice(0, 4)
              .map((employee, index) => (
                <button
                  key={employee.id}
                  onClick={() => handleNavigation('employees')}
                  className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all duration-200 text-left group hover:scale-102"
                >
                  <div className="relative">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{employee.name}</div>
                    <div className="text-sm text-gray-600">{employee.department} • {employee.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold text-green-600">{employee.performanceRating.toFixed(1)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {employee.attendanceRate}% attendance
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Enhanced Secondary Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Performance by Department */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Department Performance</h3>
              <p className="text-gray-500 mt-1">Average performance ratings by department</p>
            </div>
            <button 
              onClick={() => handleNavigation('performance')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Analyze</span>
            </button>
          </div>
          <div className="w-full overflow-hidden">
            <Chart data={performanceTrendData} type="bar" height={280} color={semanticColors.departments.marketing} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{Math.round(avgPerformance * 20)}%</div>
              <div className="text-xs text-gray-600">Company Average</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{highPerformers}</div>
              <div className="text-xs text-gray-600">Top Performers</div>
            </div>
          </div>
        </div>

        {/* Salary Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Salary Distribution</h3>
              <p className="text-gray-500 mt-1">Employee compensation breakdown</p>
            </div>
            <button 
              onClick={() => handleNavigation('payroll')}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-xl transition-colors"
            >
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">View Payroll</span>
            </button>
          </div>
          <div className="w-full overflow-hidden">
            <Chart data={salaryDistributionData} type="line" height={280} color={semanticColors.status.warning} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {salaryDistributionData.map((range, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{range.label}</span>
                <span className="text-lg font-bold text-yellow-600">{range.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Alerts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-orange-500" />
                Priority Alerts
              </h3>
              <p className="text-gray-500 mt-1">Items requiring immediate attention</p>
            </div>
            <button 
              onClick={() => handleNavigation('notifications')}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">View All</span>
            </button>
          </div>
          <div className="space-y-4">
            {upcomingReviews > 0 && (
              <button 
                onClick={() => handleNavigation('performance')}
                className="w-full flex items-start space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 rounded-xl transition-all text-left border-l-4 border-yellow-400 group"
              >
                <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-yellow-700">
                    {upcomingReviews} Performance Reviews Due
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Schedule reviews to maintain performance standards</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-600 transition-colors" />
              </button>
            )}
            
            {lowAttendance > 0 && (
              <button 
                onClick={() => handleNavigation('attendance')}
                className="w-full flex items-start space-x-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-xl transition-all text-left border-l-4 border-red-400 group"
              >
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <Clock className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-red-700">
                    {lowAttendance} Employees with Low Attendance
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Consider reaching out for support or intervention</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
              </button>
            )}
            
            <button 
              onClick={() => handleNavigation('payroll')}
              className="w-full flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all text-left border-l-4 border-blue-400 group"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 group-hover:text-blue-700">
                  Monthly Payroll Due in 3 Days
                </p>
                <p className="text-sm text-gray-600 mt-1">Ensure all timesheets are submitted and approved</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-500" />
                Key Insights
              </h3>
              <p className="text-gray-500 mt-1">Data-driven observations and trends</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-l-4 border-purple-400">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Top Department</span>
                <span className="text-lg font-bold text-purple-600">
                  {Object.keys(departmentData).find(dept => {
                    const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
                    const avgRating = deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / deptEmployees.length;
                    return avgRating === Math.max(...Object.keys(departmentData).map(d => {
                      const employees = mockEmployees.filter(emp => emp.department === d);
                      return employees.reduce((sum, emp) => sum + emp.performanceRating, 0) / employees.length;
                    }));
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600">Highest average performance rating this quarter</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-400">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Attendance Trend</span>
                <span className="text-lg font-bold text-blue-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Improving
                </span>
              </div>
              <p className="text-sm text-gray-600">Weekly attendance showing consistent positive trend</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-400">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Team Growth</span>
                <span className="text-lg font-bold text-green-600">+{recentHires} this month</span>
              </div>
              <p className="text-sm text-gray-600">New team members successfully onboarded</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-l-4 border-yellow-400">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Open Positions</span>
                <span className="text-lg font-bold text-yellow-600">{openPositions} active</span>
              </div>
              <p className="text-sm text-gray-600">Recruitment pipeline across multiple departments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Department Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Department Overview</h3>
            <p className="text-gray-500 mt-1">Comprehensive breakdown of team performance and metrics</p>
          </div>
          <button 
            onClick={() => handleNavigation('employees')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Users className="h-4 w-4" />
            <span className="font-medium">View All Employees</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(departmentData).map(([dept, count]) => {
            const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
            const avgDeptSalary = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.salary, 0) / count);
            const avgDeptPerformance = deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / count;
            const avgDeptAttendance = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / count);
            
            return (
              <button
                key={dept}
                onClick={() => handleNavigation('employees')}
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 text-left w-full border border-gray-200 hover:border-blue-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 text-lg">{dept}</h4>
                  <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <Users className="h-3 w-3" />
                    <span>{count}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Salary:</span>
                    <span className="font-semibold text-gray-900">${avgDeptSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Performance:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-900">{avgDeptPerformance.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Attendance:</span>
                    <span className="font-semibold text-gray-900">{avgDeptAttendance}%</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Performance Score</span>
                      <span>{Math.round((avgDeptPerformance / 5) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(avgDeptPerformance / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Overview;