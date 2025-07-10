import React, { useState } from 'react';
import Chart from '../Common/Chart';
import { TrendingUp, Award, Target, AlertCircle } from 'lucide-react';
import { mockEmployees, mockPerformanceData } from '../../data/mockData';

const Performance: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const departments = [...new Set(mockEmployees.map(emp => emp.department))];
  
  const filteredPerformanceData = selectedDepartment === 'all' 
    ? mockPerformanceData 
    : mockPerformanceData.filter(data => data.department === selectedDepartment);

  const chartData = filteredPerformanceData.reduce((acc, item) => {
    const existing = acc.find(x => x.label === item.month);
    if (existing) {
      existing.value = Math.round((existing.value + item.score) / 2);
    } else {
      acc.push({ label: item.month, value: item.score });
    }
    return acc;
  }, [] as Array<{ label: string; value: number }>);

  // Sort chart data by month order
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  chartData.sort((a, b) => monthOrder.indexOf(a.label) - monthOrder.indexOf(b.label));

  const topPerformers = mockEmployees
    .sort((a, b) => b.performanceRating - a.performanceRating)
    .slice(0, 5);

  const lowPerformers = mockEmployees
    .filter(emp => emp.performanceRating < 4.0)
    .sort((a, b) => a.performanceRating - b.performanceRating);

  const departmentAvg = departments.map(dept => {
    const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
    const avgRating = deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / deptEmployees.length;
    return { department: dept, average: avgRating, count: deptEmployees.length };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Performance Analytics</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select className="hidden sm:block border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="2years">Last 2 Years</option>
          </select>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-gray-900">
                {(mockEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / mockEmployees.length).toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Performers</p>
              <p className="text-2xl font-bold text-gray-900">{topPerformers.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Goals Met</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Attention</p>
              <p className="text-2xl font-bold text-gray-900">{lowPerformers.length}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
        <Chart data={chartData} type="line" height={300} color="#8B5CF6" />
      </div>

      {/* Department Performance & Employee Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Department Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
          <div className="space-y-4">
            {departmentAvg.map((dept) => (
              <div key={dept.department} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                <div>
                  <div className="font-medium text-gray-900">{dept.department}</div>
                  <div className="text-sm text-gray-600">{dept.count} employees</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{dept.average.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">avg rating</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {topPerformers.map((employee, index) => (
              <div key={employee.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="flex-shrink-0">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{employee.name}</div>
                  <div className="text-sm text-gray-600 truncate">{employee.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{employee.performanceRating.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">#{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employees Needing Attention */}
      {lowPerformers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            Employees Needing Attention
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {lowPerformers.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{employee.name}</div>
                  <div className="text-sm text-gray-600 truncate">{employee.department} • {employee.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">{employee.performanceRating.toFixed(1)}</div>
                  <button className="text-xs text-blue-600 hover:text-blue-800">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;