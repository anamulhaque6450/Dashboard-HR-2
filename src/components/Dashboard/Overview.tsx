import React from 'react';
import MetricCard from '../Common/MetricCard';
import Chart from '../Common/Chart';
import { semanticColors, chartColors } from '../../styles/colors';
import { Users, TrendingUp, Calendar, DollarSign, UserCheck, AlertTriangle, Clock, Award, Target, Activity, ChevronRight, Bell, FileText, BarChart3 } from 'lucide-react';
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

  // Action handlers
  const handleAddEmployee = () => {
    handleNavigation('employees');
    // Could also open a modal for adding employee
  };

  const handleGenerateReport = () => {
    // Generate and download a comprehensive report
    const reportData = {
      generatedAt: new Date().toISOString(),
      totalEmployees,
      avgSalary,
      avgAttendance,
      avgPerformance,
      departmentBreakdown: Object.entries(departmentData),
      topPerformers: mockEmployees
        .sort((a, b) => b.performanceRating - a.performanceRating)
        .slice(0, 5)
        .map(emp => ({ name: emp.name, rating: emp.performanceRating, department: emp.department })),
      alerts: {
        upcomingReviews,
        lowAttendance,
        recentHires
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hr-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePerformanceReviews = () => {
    handleNavigation('performance');
  };

  const handleAnalytics = () => {
    // Could navigate to a dedicated analytics page or show analytics modal
    alert('Analytics dashboard coming soon! This would show detailed insights and trends.');
  };

  const handleViewAllAlerts = () => {
    handleNavigation('notifications');
  };

  const handleViewMoreHighlights = () => {
    handleNavigation('employees');
  };

  const handleViewDepartmentDetails = () => {
    handleNavigation('employees');
  };

  const handleAlertClick = (alertType: string) => {
    switch (alertType) {
      case 'reviews':
        handleNavigation('performance');
        break;
      case 'attendance':
        handleNavigation('attendance');
        break;
      case 'payroll':
        handleNavigation('payroll');
        break;
      default:
        handleNavigation('notifications');
    }
  };

  const handleActivityClick = (activityType: string) => {
    switch (activityType) {
      case 'hires':
        handleNavigation('employees');
        break;
      case 'performance':
        handleNavigation('performance');
        break;
      case 'attendance':
        handleNavigation('attendance');
        break;
      case 'recruitment':
        handleNavigation('recruitment');
        break;
      default:
        handleNavigation('notifications');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold drop-shadow-sm">Welcome back!</h1>
            <p className="text-blue-100 mt-1 text-sm sm:text-base opacity-90">Here's what's happening with your team today</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs sm:text-sm text-blue-100 opacity-80">Today</div>
              <div className="font-semibold text-sm sm:text-base drop-shadow-sm">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short', 
                day: 'numeric'
              })}</div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Fully Responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button 
          onClick={handleAddEmployee}
          className="p-3 sm:p-4 rounded-xl hover:bg-white hover:shadow-md hover:border hover:border-blue-300 hover:scale-105 transition-all group w-full bg-gradient-to-br from-blue-50/50 to-blue-100/30"
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 group-hover:scale-110 transition-all flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 group-hover:text-blue-700" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate group-hover:text-gray-800">Add Employee</div>
              <div className="text-xs text-gray-500 truncate group-hover:text-gray-600">Quick hire</div>
            </div>
          </div>
        </button>
        
        <button 
          onClick={handleGenerateReport}
          className="p-3 sm:p-4 rounded-xl hover:bg-white hover:shadow-md hover:border hover:border-green-300 hover:scale-105 transition-all group w-full bg-gradient-to-br from-green-50/50 to-green-100/30"
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 group-hover:scale-110 transition-all flex-shrink-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 group-hover:text-green-700" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate group-hover:text-gray-800">Generate Report</div>
              <div className="text-xs text-gray-500 truncate group-hover:text-gray-600">Export data</div>
            </div>
          </div>
        </button>
        
        <button 
          onClick={handlePerformanceReviews}
          className="p-3 sm:p-4 rounded-xl hover:bg-white hover:shadow-md hover:border hover:border-purple-300 hover:scale-105 transition-all group w-full bg-gradient-to-br from-purple-50/50 to-purple-100/30"
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 group-hover:scale-110 transition-all flex-shrink-0">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 group-hover:text-purple-700" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate group-hover:text-gray-800">Performance</div>
              <div className="text-xs text-gray-500 truncate group-hover:text-gray-600">Reviews</div>
            </div>
          </div>
        </button>
        
        <button 
          onClick={handleAnalytics}
          className="p-3 sm:p-4 rounded-xl hover:bg-white hover:shadow-md hover:border hover:border-yellow-300 hover:scale-105 transition-all group w-full bg-gradient-to-br from-yellow-50/50 to-yellow-100/30"
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 group-hover:scale-110 transition-all flex-shrink-0">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 group-hover:text-yellow-700" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate group-hover:text-gray-800">Analytics</div>
              <div className="text-xs text-gray-500 truncate group-hover:text-gray-600">View trends</div>
            </div>
          </div>
        </button>
      </div>

      {/* Unified Metrics Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          Key Performance Metrics
        </h3>
        
        {/* Primary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div onClick={() => handleNavigation('employees')} className="cursor-pointer">
          <MetricCard
            title="Total Employees"
            value={totalEmployees}
            icon={Users}
            trend={calculateTrend(totalEmployees, prevTotalEmployees)}
            subtitle={`${activeEmployees} active`}
          />
        </div>
        <div onClick={() => handleNavigation('payroll')} className="cursor-pointer">
          <MetricCard
            title="Average Salary"
            value={`$${avgSalary.toLocaleString()}`}
            icon={DollarSign}
            trend={calculateTrend(avgSalary, prevAvgSalary)}
          />
        </div>
        <div onClick={() => handleNavigation('attendance')} className="cursor-pointer">
          <MetricCard
            title="Avg Attendance"
            value={`${avgAttendance}%`}
            icon={Calendar}
            trend={calculateTrend(avgAttendance, prevAvgAttendance)}
          />
        </div>
        <div onClick={() => handleNavigation('performance')} className="cursor-pointer">
          <MetricCard
            title="Avg Performance"
            value={avgPerformance.toFixed(1)}
            icon={TrendingUp}
            trend={calculateTrend(avgPerformance, prevAvgPerformance)}
            subtitle="Out of 5.0"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Additional Insights</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div onClick={() => handleNavigation('employees')} className="cursor-pointer">
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{recentHires}</p>
                  <p className="text-xs text-gray-600">Recent Hires</p>
                </div>
              </div>
            </div>
        </div>
        <div onClick={() => handleNavigation('recruitment')} className="cursor-pointer">
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{openPositions}</p>
                  <p className="text-xs text-gray-600">Open Positions</p>
                </div>
              </div>
            </div>
        </div>
        <div onClick={() => handleNavigation('performance')} className="cursor-pointer">
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{highPerformers}</p>
                  <p className="text-xs text-gray-600">High Performers</p>
                </div>
              </div>
            </div>
        </div>
        <div onClick={() => handleNavigation('attendance')} className="cursor-pointer">
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{lowAttendance}</p>
                  <p className="text-xs text-gray-600">Needs Attention</p>
                </div>
              </div>
            </div>
        </div>
          </div>
        </div>
        </div>
      </div>

      {/* Main Charts Section - Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Weekly Attendance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Weekly Attendance</h3>
            <button 
              onClick={() => handleNavigation('attendance')}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Details →
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
              height={280} 
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              Present
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              Absent
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
              Late
            </span>
          </div>
        </div>
        
        {/* Team Highlights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-500" />
              Team Highlights
            </h3>
            <button 
              onClick={handleViewMoreHighlights}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View More
            </button>
          </div>
          <div className="space-y-4">
            {mockEmployees
              .sort((a, b) => b.performanceRating - a.performanceRating)
              .slice(0, 3)
              .map((employee, index) => (
                <button
                  key={employee.id}
                  onClick={() => handleNavigation('employees')}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
                >
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{employee.name}</div>
                    <div className="text-sm text-gray-600 truncate">{employee.department}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-green-600">{employee.performanceRating.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">
                      {index === 0 ? '🏆 Top' : index === 1 ? '🥈 2nd' : '🥉 3rd'}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Performance by Department */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Performance by Department</h3>
            <button 
              onClick={() => handleNavigation('performance')}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Analyze →
            </button>
          </div>
          <div className="w-full overflow-hidden">
            <Chart data={performanceTrendData} type="bar" height={250} color={semanticColors.departments.marketing} />
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>Company Average:</span>
              <span className="font-medium">{Math.round(avgPerformance * 20)}%</span>
            </div>
          </div>
        </div>

        {/* Salary Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Salary Distribution</h3>
            <button 
              onClick={() => handleNavigation('payroll')}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Payroll →
            </button>
          </div>
          <div className="w-full overflow-hidden">
            <Chart data={salaryDistributionData} type="line" height={250} color={semanticColors.status.warning} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {salaryDistributionData.map((range, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-700">{range.label}</span>
                <span className="font-medium text-yellow-600">{range.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-orange-500" />
              Priority Alerts
            </h3>
            <button 
              onClick={handleViewAllAlerts}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {upcomingReviews > 0 && (
              <button 
                onClick={() => handleAlertClick('reviews')}
                className="w-full flex items-start space-x-3 p-3 bg-yellow-50/70 rounded-lg hover:bg-yellow-100 transition-colors text-left border-l-4 border-yellow-400"
              >
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {upcomingReviews} employees need performance reviews
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Schedule reviews to maintain performance standards</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </button>
            )}
            
            {lowAttendance > 0 && (
              <button 
                onClick={() => handleAlertClick('attendance')}
                className="w-full flex items-start space-x-3 p-3 bg-red-50/70 rounded-lg hover:bg-red-100 transition-colors text-left border-l-4 border-red-400"
              >
                <Clock className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {lowAttendance} employees have low attendance
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Consider reaching out for support or intervention</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </button>
            )}
            
            <button 
              onClick={() => handleAlertClick('payroll')}
              className="w-full flex items-start space-x-3 p-3 bg-blue-50/70 rounded-lg hover:bg-blue-100 transition-colors text-left border-l-4 border-blue-400"
            >
              <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Monthly payroll processing due in 3 days
                </p>
                <p className="text-xs text-gray-600 mt-1">Ensure all timesheets are submitted and approved</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
              Quick Insights
            </h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-purple-50/70 rounded-lg border-l-4 border-purple-400">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Department Performance</span>
                <span className="text-sm font-bold text-purple-600">
                  {Object.keys(departmentData).find(dept => {
                    const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
                    const avgRating = deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / deptEmployees.length;
                    return avgRating === Math.max(...Object.keys(departmentData).map(d => {
                      const employees = mockEmployees.filter(emp => emp.department === d);
                      return employees.reduce((sum, emp) => sum + emp.performanceRating, 0) / employees.length;
                    }));
                  })} leads
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Highest average performance rating</p>
            </div>
            
            <div className="p-3 bg-blue-50/70 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Attendance Trend</span>
                <span className="text-sm font-bold text-blue-600">↗ Improving</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Weekly attendance showing positive trend</p>
            </div>
            
            <div className="p-3 bg-green-50/70 rounded-lg border-l-4 border-green-400">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Team Growth</span>
                <span className="text-sm font-bold text-green-600">+{recentHires} this month</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">New team members successfully onboarded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Department Performance Overview</h3>
          <button 
            onClick={handleViewDepartmentDetails}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
          >
            <span>View Details</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(departmentData).map(([dept, count]) => {
            const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
            const avgDeptSalary = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.salary, 0) / count);
            const avgDeptPerformance = deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / count;
            const avgDeptAttendance = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / count);
            
            return (
              <button
                key={dept}
                onClick={() => handleNavigation('employees')}
                className="p-4 bg-gray-50/50 rounded-lg hover:bg-white hover:shadow-md transition-all hover:border hover:border-blue-300 text-left w-full"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 truncate">{dept}</h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">{count}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Salary:</span>
                    <span className="font-medium">${avgDeptSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Performance:</span>
                    <span className="font-medium">{avgDeptPerformance.toFixed(1)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attendance:</span>
                    <span className="font-medium">{avgDeptAttendance}%</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(avgDeptPerformance / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity - Enhanced with Real Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity & Insights</h3>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <button 
            onClick={() => handleActivityClick('hires')}
            className="w-full flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg hover:bg-blue-100 transition-colors text-left border-l-4 border-blue-400"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {recentHires} new employees joined this month
              </p>
              <p className="text-xs text-gray-500">
                Latest: {mockEmployees
                  .filter(emp => new Date(emp.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                  .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())[0]?.name || 'None this month'}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          </button>
          
          <button 
            onClick={() => handleActivityClick('performance')}
            className="w-full flex items-start space-x-3 p-3 bg-green-50/50 rounded-lg hover:bg-green-100 transition-colors text-left border-l-4 border-green-400"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {highPerformers} employees with excellent performance ratings
              </p>
              <p className="text-xs text-gray-500">Top performer: {mockEmployees.sort((a, b) => b.performanceRating - a.performanceRating)[0]?.name}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          </button>
          
          <button 
            onClick={() => handleActivityClick('attendance')}
           className="w-full flex items-start space-x-3 p-3 bg-yellow-50/50 rounded-lg hover:bg-yellow-100 transition-colors text-left border-l-4 border-yellow-400"
          >
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {lowAttendance} employees need attendance improvement
              </p>
              <p className="text-xs text-gray-500">Average attendance: {avgAttendance}%</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          </button>

          <button 
            onClick={() => handleActivityClick('recruitment')}
          className="w-full flex items-start space-x-3 p-3 bg-purple-50/50 rounded-lg hover:bg-purple-100 transition-colors text-left border-l-4 border-purple-400"
          >
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {openPositions} open positions across {new Set(mockRecruitmentData.filter(pos => pos.stage !== 'hired').map(pos => pos.department)).size} departments
              </p>
              <p className="text-xs text-gray-500">Priority hiring in progress</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* Department Distribution - Moved to bottom */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Employee Distribution by Department</h3>
          <button 
            onClick={() => handleNavigation('employees')}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All Employees →
          </button>
        </div>
        <div className="w-full overflow-hidden">
          <Chart data={departmentChartData} type="bar" height={280} color={semanticColors.departments.engineering} />
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {Object.entries(departmentData).map(([dept, count]) => (
            <div key={dept} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="truncate text-gray-700 font-medium">{dept}</span>
              <span className="font-bold text-blue-600">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;