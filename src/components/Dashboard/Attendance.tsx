import React, { useState } from 'react';
import { Calendar, Clock, UserCheck, UserX, TrendingUp, Download, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Chart from '../Common/Chart';
import { mockAttendanceData, mockEmployees } from '../../data/mockData';

const Attendance: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('january');
  const [viewType, setViewType] = useState('overview');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [calendarView, setCalendarView] = useState(new Date());
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // Calculate dynamic attendance metrics
  const totalPresent = mockAttendanceData.reduce((sum, item) => sum + item.present, 0);
  const totalAbsent = mockAttendanceData.reduce((sum, item) => sum + item.absent, 0);
  const totalLate = mockAttendanceData.reduce((sum, item) => sum + item.late, 0);
  const totalDays = mockAttendanceData.length;
  const avgAttendance = Math.round((totalPresent / (totalPresent + totalAbsent)) * 100);

  // Dynamic chart data
  const attendanceChartData = mockAttendanceData.slice(-7).map(item => ({
    label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: item.present
  }));

  const absenteeismChartData = mockAttendanceData.slice(-7).map(item => ({
    label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: item.absent
  }));

  const lateArrivalsData = mockAttendanceData.slice(-7).map(item => ({
    label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: item.late
  }));

  // Department attendance analysis
  const departments = [...new Set(mockEmployees.map(emp => emp.department))];
  const attendanceByDepartment = departments.map(dept => {
    const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
    const avgRate = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / deptEmployees.length);
    return {
      department: dept,
      employees: deptEmployees.length,
      rate: avgRate,
      present: Math.round((avgRate / 100) * deptEmployees.length),
      absent: deptEmployees.length - Math.round((avgRate / 100) * deptEmployees.length)
    };
  });

  // Filter employees based on search and department
  const filteredEmployees = mockEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDepartment === 'all' || emp.department === filterDepartment)
  );

  // Calendar generation
  const generateCalendar = () => {
    const year = calendarView.getFullYear();
    const month = calendarView.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }
    
    return calendar;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(calendarView.getFullYear(), calendarView.getMonth(), day);
    const dateStr = clickedDate.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    
    // Show attendance details for selected date
    const attendanceForDate = mockAttendanceData.find(data => data.date === dateStr);
    if (attendanceForDate) {
      alert(`Attendance for ${clickedDate.toLocaleDateString()}:\nPresent: ${attendanceForDate.present}\nAbsent: ${attendanceForDate.absent}\nLate: ${attendanceForDate.late}`);
    }
  };

  const handleEmployeeClick = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setShowEmployeeModal(true);
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(calendarView);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCalendarView(newDate);
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return 'bg-green-100 text-green-800 border-green-200';
    if (rate >= 85) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getAttendanceStatus = (rate: number) => {
    if (rate >= 95) return 'Excellent';
    if (rate >= 85) return 'Good';
    if (rate >= 75) return 'Fair';
    return 'Poor';
  };

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Attendance & Time Tracking</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage employee attendance patterns</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="january">January 2024</option>
            <option value="february">February 2024</option>
            <option value="march">March 2024</option>
            <option value="april">April 2024</option>
          </select>
          <select 
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed View</option>
            <option value="reports">Reports</option>
            <option value="calendar">Calendar View</option>
          </select>
          <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Attendance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('detailed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{avgAttendance}%</p>
              <p className="text-xs text-green-600 mt-1">↗ +2.3% from last month</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('detailed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Present</p>
              <p className="text-2xl font-bold text-gray-900">{totalPresent}</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('detailed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Absent</p>
              <p className="text-2xl font-bold text-gray-900">{totalAbsent}</p>
              <p className="text-xs text-red-600 mt-1">↘ -1.2% from last month</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('detailed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
              <p className="text-2xl font-bold text-gray-900">{totalLate}</p>
              <p className="text-xs text-yellow-600 mt-1">↗ +0.8% from last month</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Daily Attendance</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
          </div>
          <Chart data={attendanceChartData} type="bar" height={250} color="#10B981" />
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>Avg: {Math.round(attendanceChartData.reduce((sum, item) => sum + item.value, 0) / attendanceChartData.length)}</span>
            <span>Peak: {Math.max(...attendanceChartData.map(item => item.value))}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Absenteeism Trend</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm">Analyze</button>
          </div>
          <Chart data={absenteeismChartData} type="line" height={250} color="#EF4444" />
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>Avg: {Math.round(absenteeismChartData.reduce((sum, item) => sum + item.value, 0) / absenteeismChartData.length)}</span>
            <span>Trend: ↘ Decreasing</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Late Arrivals</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm">Details</button>
          </div>
          <Chart data={lateArrivalsData} type="bar" height={250} color="#F59E0B" />
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>Avg: {Math.round(lateArrivalsData.reduce((sum, item) => sum + item.value, 0) / lateArrivalsData.length)}</span>
            <span>Most: {Math.max(...lateArrivalsData.map(item => item.value))}</span>
          </div>
        </div>
      </div>

      {/* Department Attendance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Department Attendance Rates</h3>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600">Overall improving</span>
          </div>
        </div>
        <div className="space-y-4">
          {attendanceByDepartment.map((dept) => (
            <div key={dept.department} 
                 className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer space-y-3 lg:space-y-0"
                 onClick={() => setFilterDepartment(dept.department)}>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">{dept.department}</div>
                  <div className="text-sm text-gray-600 lg:hidden">{dept.rate}%</div>
                </div>
                <div className="text-sm text-gray-600">{dept.employees} employees • {dept.present} present • {dept.absent} absent</div>
              </div>
              <div className="flex items-center space-x-4 w-full lg:w-auto">
                <div className="flex-1 lg:w-48 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500 hover:bg-green-600"
                    style={{ width: `${dept.rate}%` }}
                  ></div>
                </div>
                <div className="text-lg font-bold text-gray-900 w-12 text-right flex-shrink-0 hidden lg:block">{dept.rate}%</div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(dept.rate)}`}>
                  {getAttendanceStatus(dept.rate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search employees..."
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
          </div>
        </div>

        {/* Employee Attendance List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} 
                 className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                 onClick={() => handleEmployeeClick(employee.id)}>
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{employee.name}</div>
                  <div className="text-sm text-gray-500 truncate">{employee.department}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Attendance Rate</span>
                  <span className="font-medium">{employee.attendanceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      employee.attendanceRate >= 95 ? 'bg-green-500' :
                      employee.attendanceRate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${employee.attendanceRate}%` }}
                  ></div>
                </div>
                <div className={`text-center py-1 px-2 rounded-full text-xs font-medium ${getAttendanceColor(employee.attendanceRate)}`}>
                  {getAttendanceStatus(employee.attendanceRate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Calendar View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Attendance Calendar</h3>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigateCalendar('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-lg font-medium text-gray-900 min-w-[120px] text-center">
              {calendarView.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button 
              onClick={() => navigateCalendar('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {generateCalendar().map((day, index) => {
            if (!day) {
              return <div key={index} className="p-2 sm:p-3"></div>;
            }
            
            const attendance = 85 + Math.random() * 15; // Mock attendance rate
            const colorClass = attendance >= 95 ? 'bg-green-100 text-green-800 border-green-200' :
                              attendance >= 85 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-red-100 text-red-800 border-red-200';
            
            return (
              <div key={index} 
                   className={`p-2 sm:p-3 rounded-lg border-2 hover:shadow-md cursor-pointer transition-all ${colorClass} ${
                     selectedDate === `${calendarView.getFullYear()}-${String(calendarView.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` 
                     ? 'ring-2 ring-blue-500' : ''
                   }`}
                   onClick={() => handleDateClick(day)}>
                <div className="font-medium">{day}</div>
                <div className="text-xs mt-1">{Math.round(attendance)}%</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-200 rounded"></div>
            <span>95%+ Attendance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-200 rounded"></div>
            <span>85-94% Attendance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-200 rounded"></div>
            <span>Below 85% Attendance</span>
          </div>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {showEmployeeModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {(() => {
                const employee = mockEmployees.find(emp => emp.id === selectedEmployee);
                if (!employee) return null;
                
                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
                          <p className="text-gray-600">{employee.department} • {employee.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowEmployeeModal(false)}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{employee.attendanceRate}%</div>
                        <div className="text-sm text-gray-600">Attendance Rate</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">22</div>
                        <div className="text-sm text-gray-600">Days Present</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">3</div>
                        <div className="text-sm text-gray-600">Days Absent</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Recent Attendance History</h4>
                      <div className="space-y-2">
                        {mockAttendanceData.slice(-5).map((day, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              Math.random() > 0.2 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {Math.random() > 0.2 ? 'Present' : 'Absent'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => setShowEmployeeModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        View Full Report
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;