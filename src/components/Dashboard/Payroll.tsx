import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, FileText, Download, Calculator, CreditCard, PieChart, Filter, Search, Eye, Edit, CheckCircle, AlertCircle, Calendar, ArrowUpDown, Save, X, User, Building, Star } from 'lucide-react';
import Chart from '../Common/Chart';
import { mockEmployees } from '../../data/mockData';
import { semanticColors } from '../../styles/colors';

interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  baseSalary: number;
  overtime: number;
  bonus: number;
  deductions: number;
  taxes: number;
  netPay: number;
  status: 'pending' | 'processed' | 'paid';
  payDate?: string;
}

const Payroll: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [viewType, setViewType] = useState('summary');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);

  // Form state for editing payroll
  const [editFormData, setEditFormData] = useState({
    baseSalary: '',
    overtime: '',
    bonus: '',
    deductions: '',
    taxes: '',
    status: 'pending' as 'pending' | 'processed' | 'paid',
    payDate: ''
  });

  // Generate mock payroll records
  const generatePayrollRecords = (): PayrollRecord[] => {
    return mockEmployees.map(emp => {
      const overtime = Math.floor(Math.random() * 2000);
      const bonus = Math.floor(emp.salary * 0.1 * (emp.performanceRating / 5));
      const taxes = Math.floor((emp.salary + overtime + bonus) * 0.22);
      const deductions = Math.floor((emp.salary + overtime + bonus) * 0.08); // Benefits, insurance
      const netPay = emp.salary + overtime + bonus - taxes - deductions;
      
      return {
        id: `payroll-${emp.id}`,
        employeeId: emp.id,
        month: 'January',
        year: 2024,
        baseSalary: emp.salary,
        overtime,
        bonus,
        deductions,
        taxes,
        netPay,
        status: Math.random() > 0.3 ? 'processed' : Math.random() > 0.5 ? 'paid' : 'pending',
        payDate: Math.random() > 0.3 ? '2024-01-31' : undefined
      };
    });
  };

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(generatePayrollRecords());

  // Calculate totals and metrics
  const totalGrossPay = payrollRecords.reduce((sum, record) => sum + record.baseSalary + record.overtime + record.bonus, 0);
  const totalNetPay = payrollRecords.reduce((sum, record) => sum + record.netPay, 0);
  const totalTaxes = payrollRecords.reduce((sum, record) => sum + record.taxes, 0);
  const totalDeductions = payrollRecords.reduce((sum, record) => sum + record.deductions, 0);
  const totalBonus = payrollRecords.reduce((sum, record) => sum + record.bonus, 0);
  const avgSalary = totalGrossPay / payrollRecords.length;

  // Department analysis
  const departments = [...new Set(mockEmployees.map(emp => emp.department))];
  const departmentPayrollData = departments.map(dept => {
    const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
    const deptRecords = payrollRecords.filter(record => 
      deptEmployees.some(emp => emp.id === record.employeeId)
    );
    const totalPay = deptRecords.reduce((sum, record) => sum + record.netPay, 0);
    
    return {
      label: dept.length > 8 ? dept.substring(0, 8) + '...' : dept,
      value: Math.round(totalPay / 1000) // Convert to thousands
    };
  });

  // Salary distribution
  const salaryRanges = [
    { label: '<$50K', min: 0, max: 50000 },
    { label: '$50-70K', min: 50000, max: 70000 },
    { label: '$70-90K', min: 70000, max: 90000 },
    { label: '>$90K', min: 90000, max: Infinity }
  ];

  const salaryDistribution = salaryRanges.map(range => ({
    label: range.label,
    value: payrollRecords.filter(record => 
      record.baseSalary >= range.min && record.baseSalary < range.max
    ).length
  }));

  // Monthly payroll history
  const payrollHistory = [
    { month: 'Jul', amount: totalNetPay * 0.95 },
    { month: 'Aug', amount: totalNetPay * 0.97 },
    { month: 'Sep', amount: totalNetPay * 0.98 },
    { month: 'Oct', amount: totalNetPay * 1.02 },
    { month: 'Nov', amount: totalNetPay * 1.01 },
    { month: 'Dec', amount: totalNetPay * 1.05 },
    { month: 'Jan', amount: totalNetPay }
  ];

  const payrollHistoryData = payrollHistory.map(item => ({
    label: item.month,
    value: Math.round(item.amount / 1000) // Convert to thousands
  }));

  // Reset edit form
  const resetEditForm = () => {
    setEditFormData({
      baseSalary: '',
      overtime: '',
      bonus: '',
      deductions: '',
      taxes: '',
      status: 'pending',
      payDate: ''
    });
  };

  // Handle edit payroll record
  const handleEditPayroll = (record: PayrollRecord) => {
    setEditingRecord(record);
    setEditFormData({
      baseSalary: record.baseSalary.toString(),
      overtime: record.overtime.toString(),
      bonus: record.bonus.toString(),
      deductions: record.deductions.toString(),
      taxes: record.taxes.toString(),
      status: record.status,
      payDate: record.payDate || ''
    });
    setShowEditModal(true);
  };

  // Save edited payroll record
  const handleSaveEditPayroll = () => {
    if (!editingRecord) {
      alert('No record selected for editing');
      return;
    }

    const baseSalary = parseInt(editFormData.baseSalary) || editingRecord.baseSalary;
    const overtime = parseInt(editFormData.overtime) || editingRecord.overtime;
    const bonus = parseInt(editFormData.bonus) || editingRecord.bonus;
    const deductions = parseInt(editFormData.deductions) || editingRecord.deductions;
    const taxes = parseInt(editFormData.taxes) || editingRecord.taxes;
    const netPay = baseSalary + overtime + bonus - taxes - deductions;

    const updatedRecord: PayrollRecord = {
      ...editingRecord,
      baseSalary,
      overtime,
      bonus,
      deductions,
      taxes,
      netPay,
      status: editFormData.status,
      payDate: editFormData.payDate || editingRecord.payDate
    };

    setPayrollRecords(payrollRecords.map(record => 
      record.id === editingRecord.id ? updatedRecord : record
    ));
    
    setShowEditModal(false);
    setEditingRecord(null);
    resetEditForm();
  };

  // Handle form input changes
  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter and sort payroll records
  const getFilteredRecords = () => {
    let filtered = payrollRecords.filter(record => {
      const employee = mockEmployees.find(emp => emp.id === record.employeeId);
      if (!employee) return false;
      
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    // Sort records
    filtered.sort((a, b) => {
      const empA = mockEmployees.find(emp => emp.id === a.employeeId);
      const empB = mockEmployees.find(emp => emp.id === b.employeeId);
      
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = empA?.name || '';
          bValue = empB?.name || '';
          break;
        case 'department':
          aValue = empA?.department || '';
          bValue = empB?.department || '';
          break;
        case 'salary':
          aValue = a.baseSalary;
          bValue = b.baseSalary;
          break;
        case 'netPay':
          aValue = a.netPay;
          bValue = b.netPay;
          break;
        default:
          aValue = empA?.name || '';
          bValue = empB?.name || '';
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      const comparison = aValue > bValue ? 1 : -1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const filteredRecords = getFilteredRecords();

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Generate and download reports
  const generateReport = (type: 'excel' | 'tax' | 'benefits') => {
    if (filteredRecords.length === 0) {
      alert('No data available to generate report');
      return;
    }

    let content = '';
    let filename = '';
    
    switch (type) {
      case 'excel':
        // Generate CSV content for Excel
        const headers = ['Employee Name', 'Department', 'Base Salary', 'Overtime', 'Bonus', 'Taxes', 'Deductions', 'Net Pay', 'Status'];
        const csvContent = [
          headers.join(','),
          ...filteredRecords.map(record => {
            const employee = mockEmployees.find(emp => emp.id === record.employeeId);
            return [
              `"${employee?.name || ''}"`,
              `"${employee?.department || ''}"`,
              record.baseSalary,
              record.overtime,
              record.bonus,
              record.taxes,
              record.deductions,
              record.netPay,
              `"${record.status}"`
            ].join(',');
          })
        ].join('\n');
        content = csvContent;
        filename = `payroll-report-${new Date().toISOString().split('T')[0]}.csv`;
        break;
        
      case 'tax':
        // Generate tax summary
        const taxSummary = [
          'TAX SUMMARY REPORT',
          `Generated: ${new Date().toLocaleDateString()}`,
          '',
          'SUMMARY:',
          `Total Gross Pay: $${totalGrossPay.toLocaleString()}`,
          `Total Taxes Withheld: $${totalTaxes.toLocaleString()}`,
          `Tax Rate: ${((totalTaxes / totalGrossPay) * 100).toFixed(2)}%`,
          '',
          'BY DEPARTMENT:',
          ...departments.map(dept => {
            const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
            const deptRecords = payrollRecords.filter(record => 
              deptEmployees.some(emp => emp.id === record.employeeId)
            );
            const deptTaxes = deptRecords.reduce((sum, record) => sum + record.taxes, 0);
            return `${dept}: $${deptTaxes.toLocaleString()}`;
          }),
          '',
          'EMPLOYEE DETAILS:',
          ...filteredRecords.map(record => {
            const employee = mockEmployees.find(emp => emp.id === record.employeeId);
            return `${employee?.name}: $${record.taxes.toLocaleString()}`;
          })
        ].join('\n');
        content = taxSummary;
        filename = `tax-summary-${new Date().toISOString().split('T')[0]}.txt`;
        break;
        
      case 'benefits':
        // Generate benefits report
        const benefitsReport = [
          'BENEFITS REPORT',
          `Generated: ${new Date().toLocaleDateString()}`,
          '',
          'SUMMARY:',
          `Total Benefits Deductions: $${totalDeductions.toLocaleString()}`,
          `Average per Employee: $${Math.round(totalDeductions / payrollRecords.length).toLocaleString()}`,
          '',
          'BY DEPARTMENT:',
          ...departments.map(dept => {
            const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
            const deptRecords = payrollRecords.filter(record => 
              deptEmployees.some(emp => emp.id === record.employeeId)
            );
            const deptDeductions = deptRecords.reduce((sum, record) => sum + record.deductions, 0);
            return `${dept}: $${deptDeductions.toLocaleString()}`;
          }),
          '',
          'EMPLOYEE DETAILS:',
          ...filteredRecords.map(record => {
            const employee = mockEmployees.find(emp => emp.id === record.employeeId);
            return `${employee?.name}: $${record.deductions.toLocaleString()}`;
          })
        ].join('\n');
        content = benefitsReport;
        filename = `benefits-report-${new Date().toISOString().split('T')[0]}.txt`;
        break;
    }
    
    // Create and download file
    const blob = new Blob([content], { type: type === 'excel' ? 'text/csv' : 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Process payroll for selected employees
  const processPayroll = () => {
    if (selectedEmployees.length === 0) {
      alert('Please select employees to process payroll');
      return;
    }
    
    const confirmProcess = window.confirm(`Are you sure you want to process payroll for ${selectedEmployees.length} employees?`);
    if (!confirmProcess) return;
    
    // Simulate payroll processing
    setTimeout(() => {
      alert(`Payroll processed successfully for ${selectedEmployees.length} employees!`);
      setSelectedEmployees([]);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} className="text-green-600" />;
      case 'processed': return <CreditCard size={16} className="text-blue-600" />;
      case 'pending': return <AlertCircle size={16} className="text-yellow-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  // Payroll Edit Form Component
  const PayrollEditForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Salary
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={editFormData.baseSalary}
              onChange={(e) => handleEditInputChange('baseSalary', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter base salary"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overtime Pay
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={editFormData.overtime}
              onChange={(e) => handleEditInputChange('overtime', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter overtime pay"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bonus
          </label>
          <div className="relative">
            <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={editFormData.bonus}
              onChange={(e) => handleEditInputChange('bonus', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter bonus amount"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deductions
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={editFormData.deductions}
              onChange={(e) => handleEditInputChange('deductions', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter deductions"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taxes
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={editFormData.taxes}
              onChange={(e) => handleEditInputChange('taxes', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tax amount"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pay Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              value={editFormData.payDate}
              onChange={(e) => handleEditInputChange('payDate', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payroll Status
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="pending"
              checked={editFormData.status === 'pending'}
              onChange={(e) => handleEditInputChange('status', e.target.value)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Pending</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="processed"
              checked={editFormData.status === 'processed'}
              onChange={(e) => handleEditInputChange('status', e.target.value)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Processed</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="paid"
              checked={editFormData.status === 'paid'}
              onChange={(e) => handleEditInputChange('status', e.target.value)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Paid</span>
          </label>
        </div>
      </div>

      {/* Net Pay Calculation Display */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Calculated Net Pay:</span>
          <span className="text-2xl font-bold text-blue-600">
            ${(
              (parseInt(editFormData.baseSalary) || 0) + 
              (parseInt(editFormData.overtime) || 0) + 
              (parseInt(editFormData.bonus) || 0) - 
              (parseInt(editFormData.taxes) || 0) - 
              (parseInt(editFormData.deductions) || 0)
            ).toLocaleString()}
          </span>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          This amount will be automatically calculated based on the values above
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Payroll Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage employee compensation and benefits</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="current">Current Month</option>
            <option value="previous">Previous Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button 
            onClick={processPayroll}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            <Calculator size={16} />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>

      {/* Payroll Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('detailed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Gross Pay</p>
              <p className="text-2xl font-bold text-gray-900">${totalGrossPay.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">↗ +3.2% from last month</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('detailed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Net Pay</p>
              <p className="text-2xl font-bold text-gray-900">${totalNetPay.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">After taxes & deductions</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('detailed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Salary</p>
              <p className="text-2xl font-bold text-gray-900">${Math.round(avgSalary).toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">↗ +2.1% from last month</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setViewType('reports')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employees</p>
              <p className="text-2xl font-bold text-gray-900">{payrollRecords.length}</p>
              <p className="text-xs text-gray-600 mt-1">{payrollRecords.filter(r => r.status === 'processed').length} processed</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Payroll by Department</h3>
            <button 
              onClick={() => generateReport('excel')}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
          <Chart data={departmentPayrollData} type="bar" height={280} color={semanticColors.departments.marketing} />
          <div className="mt-3 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>Values in thousands ($K)</span>
              <span>Total: ${Math.round(totalNetPay / 1000)}K</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Payroll History</h3>
            <button 
              onClick={() => generateReport('tax')}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
            >
              <FileText size={14} />
              <span>Tax Report</span>
            </button>
          </div>
          <Chart data={payrollHistoryData} type="line" height={280} color={semanticColors.status.success} />
          <div className="mt-3 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>7-month trend (in $K)</span>
              <span>Growth: +5.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
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
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => generateReport('excel')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <Download size={16} />
            <span>Export to Excel</span>
          </button>
          <button 
            onClick={() => generateReport('tax')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <FileText size={16} />
            <span>Tax Summary</span>
          </button>
          <button 
            onClick={() => generateReport('benefits')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <PieChart size={16} />
            <span>Benefits Report</span>
          </button>
          {selectedEmployees.length > 0 && (
            <button 
              onClick={processPayroll}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 text-sm"
            >
              <Calculator size={16} />
              <span>Process Selected ({selectedEmployees.length})</span>
            </button>
          )}
        </div>

        {/* Employee Payroll Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 sm:p-4">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === filteredRecords.length && filteredRecords.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmployees(filteredRecords.map(r => r.employeeId));
                      } else {
                        setSelectedEmployees([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="text-left p-3 sm:p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100 min-w-[200px]"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Employee</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th 
                  className="text-left p-3 sm:p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Department</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th 
                  className="text-left p-3 sm:p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('salary')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Base Salary</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-gray-900 hidden md:table-cell">Overtime</th>
                <th className="text-left p-3 sm:p-4 font-medium text-gray-900 hidden lg:table-cell">Bonus</th>
                <th className="text-left p-3 sm:p-4 font-medium text-gray-900 hidden lg:table-cell">Deductions</th>
                <th 
                  className="text-left p-3 sm:p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('netPay')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Net Pay</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-gray-900">Status</th>
                <th className="text-left p-3 sm:p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => {
                const employee = mockEmployees.find(emp => emp.id === record.employeeId);
                if (!employee) return null;
                
                return (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 sm:p-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(record.employeeId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEmployees([...selectedEmployees, record.employeeId]);
                          } else {
                            setSelectedEmployees(selectedEmployees.filter(id => id !== record.employeeId));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{employee.name}</div>
                          <div className="text-sm text-gray-500 truncate">{employee.email}</div>
                          <div className="text-xs text-blue-600 sm:hidden">{employee.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {employee.department}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-gray-900 font-medium">${record.baseSalary.toLocaleString()}</td>
                    <td className="p-3 sm:p-4 text-gray-900 hidden md:table-cell">${record.overtime.toLocaleString()}</td>
                    <td className="p-3 sm:p-4 text-gray-900 hidden lg:table-cell">${record.bonus.toLocaleString()}</td>
                    <td className="p-3 sm:p-4 text-gray-900 hidden lg:table-cell">${record.deductions.toLocaleString()}</td>
                    <td className="p-3 sm:p-4 text-gray-900 font-bold">${record.netPay.toLocaleString()}</td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedPayrollRecord(record.id);
                            setShowPayrollModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditPayroll(record)}
                          className="text-green-600 hover:text-green-800 transition-colors p-1 hover:bg-green-50 rounded"
                          title="Edit Payroll"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Summary */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 text-sm text-gray-600">
          <div>
            Showing {filteredRecords.length} of {payrollRecords.length} employees
          </div>
          <div className="flex items-center space-x-4">
            <span>Total Net Pay: ${filteredRecords.reduce((sum, record) => sum + record.netPay, 0).toLocaleString()}</span>
            <span>Selected: {selectedEmployees.length}</span>
          </div>
        </div>
      </div>

      {/* Salary Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Salary Distribution</h3>
          <button 
            onClick={() => generateReport('benefits')}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
          >
            <Download size={14} />
            <span>Download Report</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {salaryDistribution.map((range, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="text-2xl font-bold text-gray-900">{range.value}</div>
              <div className="text-sm text-gray-600 mb-2">{range.label}</div>
              <div className="text-xs text-gray-500">
                {Math.round((range.value / payrollRecords.length) * 100)}% of employees
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(range.value / payrollRecords.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payroll Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            This Month
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Pay:</span>
              <span className="font-medium">${totalGrossPay.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Bonuses:</span>
              <span className="font-medium text-green-600">${totalBonus.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Taxes:</span>
              <span className="font-medium text-red-600">${totalTaxes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Deductions:</span>
              <span className="font-medium text-orange-600">${totalDeductions.toLocaleString()}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Net Payroll:</span>
              <span className="text-blue-600">${totalNetPay.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">YTD Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Paid:</span>
              <span className="font-medium">${(totalNetPay * 12).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax Withheld:</span>
              <span className="font-medium">${(totalTaxes * 12).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Benefits:</span>
              <span className="font-medium">${(totalDeductions * 12).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Monthly:</span>
              <span className="font-medium">${totalNetPay.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
          <div className="space-y-2">
            <button 
              onClick={() => generateReport('excel')}
              className="w-full text-left p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Generate Payroll Report</span>
            </button>
            <button 
              onClick={() => generateReport('excel')}
              className="w-full text-left p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm flex items-center space-x-2"
            >
              <FileText size={16} />
              <span>Export to Excel</span>
            </button>
            <button 
              onClick={() => generateReport('tax')}
              className="w-full text-left p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm flex items-center space-x-2"
            >
              <Calculator size={16} />
              <span>Tax Summary</span>
            </button>
            <button 
              onClick={() => generateReport('benefits')}
              className="w-full text-left p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm flex items-center space-x-2"
            >
              <PieChart size={16} />
              <span>Benefits Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Payroll Modal */}
      {showEditModal && editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {(() => {
                    const employee = mockEmployees.find(emp => emp.id === editingRecord.employeeId);
                    return employee ? (
                      <>
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Edit Payroll - {employee.name}</h3>
                          <p className="text-gray-600">{employee.department} • {employee.role}</p>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <PayrollEditForm />

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditPayroll}
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

      {/* Payroll Detail Modal */}
      {showPayrollModal && selectedPayrollRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {(() => {
                const record = payrollRecords.find(r => r.id === selectedPayrollRecord);
                const employee = record ? mockEmployees.find(emp => emp.id === record.employeeId) : null;
                if (!record || !employee) return null;
                
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
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(record.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPayrollModal(false)}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Earnings</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-gray-600">Base Salary:</span>
                            <span className="font-medium">${record.baseSalary.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-gray-600">Overtime:</span>
                            <span className="font-medium">${record.overtime.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                            <span className="text-gray-600">Bonus:</span>
                            <span className="font-medium">${record.bonus.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-100 rounded-lg font-bold">
                            <span>Gross Pay:</span>
                            <span>${(record.baseSalary + record.overtime + record.bonus).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Deductions</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                            <span className="text-gray-600">Federal Tax:</span>
                            <span className="font-medium">${Math.round(record.taxes * 0.7).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                            <span className="text-gray-600">State Tax:</span>
                            <span className="font-medium">${Math.round(record.taxes * 0.3).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                            <span className="text-gray-600">Benefits:</span>
                            <span className="font-medium">${record.deductions.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-100 rounded-lg font-bold">
                            <span>Total Deductions:</span>
                            <span>${(record.taxes + record.deductions).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Net Pay:</span>
                        <span className="text-2xl font-bold text-blue-600">${record.netPay.toLocaleString()}</span>
                      </div>
                      {record.payDate && (
                        <div className="text-sm text-gray-600 mt-2">
                          Pay Date: {new Date(record.payDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => setShowPayrollModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                      <button 
                        onClick={() => {
                          handleEditPayroll(record);
                          setShowPayrollModal(false);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Edit size={16} />
                        <span>Edit Payroll</span>
                      </button>
                      <button 
                        onClick={() => {
                          generateReport('excel');
                          setShowPayrollModal(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Download size={16} />
                        <span>Download Pay Stub</span>
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

export default Payroll;