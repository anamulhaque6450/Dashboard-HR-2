import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Mail, Phone, Save, X, User, Building, DollarSign, Calendar, Star } from 'lucide-react';
import { mockEmployees, Employee } from '../../data/mockData';
import { semanticColors } from '../../styles/colors';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form state for new/edit employee
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    salary: '',
    performanceRating: '',
    attendanceRate: '',
    joinDate: '',
    status: 'active' as 'active' | 'inactive'
  });

  const departments = ['all', ...new Set(employees.map(emp => emp.department))];
  const availableDepartments = ['Engineering', 'Marketing', 'Finance', 'Sales', 'HR', 'Operations', 'Product', 'Analytics'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      role: '',
      salary: '',
      performanceRating: '',
      attendanceRate: '',
      joinDate: '',
      status: 'active'
    });
  };

  // Handle add employee
  const handleAddEmployee = () => {
    setShowAddModal(true);
    resetForm();
  };

  // Handle edit employee
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      salary: employee.salary.toString(),
      performanceRating: employee.performanceRating.toString(),
      attendanceRate: employee.attendanceRate.toString(),
      joinDate: employee.joinDate,
      status: employee.status
    });
    setShowEditModal(true);
  };

  // Handle delete employee
  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  // Save new employee
  const handleSaveNewEmployee = () => {
    if (!formData.name || !formData.email || !formData.department || !formData.role) {
      alert('Please fill in all required fields');
      return;
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      department: formData.department,
      role: formData.role,
      salary: parseInt(formData.salary) || 50000,
      performanceRating: parseFloat(formData.performanceRating) || 3.0,
      attendanceRate: parseInt(formData.attendanceRate) || 90,
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
      status: formData.status,
      avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`
    };

    setEmployees([...employees, newEmployee]);
    setShowAddModal(false);
    resetForm();
  };

  // Save edited employee
  const handleSaveEditEmployee = () => {
    if (!editingEmployee || !formData.name || !formData.email || !formData.department || !formData.role) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedEmployee: Employee = {
      ...editingEmployee,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      role: formData.role,
      salary: parseInt(formData.salary) || editingEmployee.salary,
      performanceRating: parseFloat(formData.performanceRating) || editingEmployee.performanceRating,
      attendanceRate: parseInt(formData.attendanceRate) || editingEmployee.attendanceRate,
      joinDate: formData.joinDate || editingEmployee.joinDate,
      status: formData.status
    };

    setEmployees(employees.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp));
    setShowEditModal(false);
    setEditingEmployee(null);
    resetForm();
  };

  // Confirm delete employee
  const confirmDeleteEmployee = () => {
    if (selectedEmployee) {
      setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
      setShowDeleteModal(false);
      setSelectedEmployee(null);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-100';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 90) return 'text-blue-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Employee Form Component
  const EmployeeForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department *
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              required
            >
              <option value="">Select Department</option>
              {availableDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Role *
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter job role"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Salary
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={formData.salary}
              onChange={(e) => handleInputChange('salary', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter annual salary"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Join Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              value={formData.joinDate}
              onChange={(e) => handleInputChange('joinDate', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Performance Rating
          </label>
          <div className="relative">
            <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={formData.performanceRating}
              onChange={(e) => handleInputChange('performanceRating', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.0 - 5.0"
              min="0"
              max="5"
              step="0.1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attendance Rate (%)
          </label>
          <input
            type="number"
            value={formData.attendanceRate}
            onChange={(e) => handleInputChange('attendanceRate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0 - 100"
            min="0"
            max="100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Employment Status
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="active"
              checked={formData.status === 'active'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="inactive"
              checked={formData.status === 'inactive'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Inactive</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600">Manage your team members and their information</p>
        </div>
        <button 
          onClick={handleAddEmployee}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
        >
          <Plus size={20} className="mr-2" />
          Add Employee
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[180px]"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.role}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => handleEditEmployee(employee)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Edit Employee"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteEmployee(employee)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Employee"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={16} className="mr-2 text-gray-400" />
                <span className="truncate">{employee.email}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Department</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {employee.department}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Performance</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(employee.performanceRating)}`}>
                  {employee.performanceRating}/5.0
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Attendance</span>
                <span className={`text-sm font-medium ${getAttendanceColor(employee.attendanceRate)}`}>
                  {employee.attendanceRate}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Salary</span>
                <span className="text-sm font-medium text-gray-900">
                  ${employee.salary.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Join Date</span>
                <span className="text-sm text-gray-900">
                  {new Date(employee.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No employees found</p>
          <p className="text-gray-400">Try adjusting your search criteria or add a new employee</p>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Employee</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <EmployeeForm />

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewEmployee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Add Employee</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Employee</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <EmployeeForm isEdit={true} />

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditEmployee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Employee</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <strong>{selectedEmployee.name}</strong>? This action cannot be undone.
              </p>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteEmployee}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default Employees;