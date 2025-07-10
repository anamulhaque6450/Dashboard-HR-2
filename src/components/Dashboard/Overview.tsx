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

  // Generate PDF Report
  const generatePDFReport = () => {
    // Dynamic import to handle PDF generation
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();
        const currentDate = new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        // Professional Header with Logo Area
        doc.setFontSize(20);
        doc.setTextColor(59, 130, 246);
        doc.text('HR DASHBOARD', 20, 25);
        doc.setFontSize(16);
        doc.setTextColor(100, 100, 100);
        doc.text('COMPREHENSIVE ANALYTICS REPORT', 20, 35);
        
        // Company Info Box
        doc.setFillColor(245, 247, 250);
        doc.rect(140, 15, 55, 25, 'F');
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text('Report Generated:', 145, 22);
        doc.text(currentDate, 145, 28);
        doc.text('Report Type: Executive Summary', 145, 34);
        
        // Divider Line
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(2);
        doc.line(20, 45, 190, 45);
        
        // Executive Summary
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('📊 EXECUTIVE SUMMARY', 20, 60);
        
        // Summary Box
        doc.setFillColor(248, 250, 252);
        doc.rect(20, 65, 170, 45, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.rect(20, 65, 170, 45);
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const summaryY = 72;
        doc.text(`👥 Total Workforce: ${totalEmployees} employees (${activeEmployees} active, ${totalEmployees - activeEmployees} inactive)`, 25, summaryY);
        doc.text(`💰 Average Annual Salary: $${avgSalary.toLocaleString()} (Range: $45K - $95K)`, 25, summaryY + 8);
        doc.text(`📅 Overall Attendance Rate: ${avgAttendance}% (Target: 95%)`, 25, summaryY + 16);
        doc.text(`⭐ Average Performance Score: ${avgPerformance.toFixed(1)}/5.0 (${Math.round((avgPerformance/5)*100)}%)`, 25, summaryY + 24);
        doc.text(`🎯 Open Positions: ${openPositions} active recruitments across ${new Set(mockRecruitmentData.map(r => r.department)).size} departments`, 25, summaryY + 32);
        doc.text(`🆕 Recent Activity: ${recentHires} new hires in last 30 days, ${upcomingReviews} reviews pending`, 25, summaryY + 40);
        
        // Department Breakdown
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('🏢 DEPARTMENT PERFORMANCE ANALYSIS', 20, 125);
        
        const departmentTableData = Object.entries(departmentData).map(([dept, count]) => {
          const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
          const avgDeptSalary = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.salary, 0) / count);
          const avgDeptPerformance = (deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / count).toFixed(1);
          const avgDeptAttendance = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / count);
          const performanceGrade = avgDeptPerformance >= 4.5 ? 'A+' : avgDeptPerformance >= 4.0 ? 'A' : avgDeptPerformance >= 3.5 ? 'B+' : avgDeptPerformance >= 3.0 ? 'B' : 'C';
          
          return [
            dept,
            count.toString(),
            `$${avgDeptSalary.toLocaleString()}`,
            `${avgDeptPerformance}/5.0`,
            `${avgDeptAttendance}%`,
            performanceGrade
          ];
        });
        
        (doc as any).autoTable({
          startY: 135,
          head: [['Department', 'Staff', 'Avg Salary', 'Performance', 'Attendance', 'Grade']],
          body: departmentTableData,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246], textColor: 255 },
          styles: { fontSize: 9, cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 25, halign: 'center' },
            2: { cellWidth: 30, halign: 'right' },
            3: { cellWidth: 25, halign: 'center' },
            4: { cellWidth: 25, halign: 'center' },
            5: { cellWidth: 20, halign: 'center' }
          }
        });
        
        // Top Performers
        const finalY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('🏆 TOP PERFORMERS HALL OF FAME', 20, finalY);
        
        const topPerformersData = mockEmployees
          .sort((a, b) => b.performanceRating - a.performanceRating)
          .slice(0, 5)
          .map((emp, index) => [
            `#${index + 1}`,
            emp.name,
            emp.department,
            emp.role,
            emp.performanceRating.toFixed(1),
            `${emp.attendanceRate}%`,
            `$${emp.salary.toLocaleString()}`,
            new Date(emp.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          ]);
        
        (doc as any).autoTable({
          startY: finalY + 10,
          head: [['Rank', 'Employee Name', 'Department', 'Position', 'Rating', 'Attendance', 'Salary', 'Joined']],
          body: topPerformersData,
          theme: 'grid',
          headStyles: { fillColor: [34, 197, 94], textColor: 255 },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
            0: { cellWidth: 15, halign: 'center' },
            1: { cellWidth: 28 },
            2: { cellWidth: 22 },
            3: { cellWidth: 28 },
            4: { cellWidth: 20, halign: 'center' },
            5: { cellWidth: 20, halign: 'center' },
            6: { cellWidth: 22, halign: 'right' },
            7: { cellWidth: 20, halign: 'center' }
          }
        });
        
        // Add new page for additional details
        doc.addPage();
        
        // Page 2 Header
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text('HR ANALYTICS - DETAILED INSIGHTS', 20, 20);
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(1);
        doc.line(20, 25, 190, 25);
        
        // Attendance Summary
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('📊 WEEKLY ATTENDANCE TRENDS', 20, 40);
        
        const attendanceData = mockAttendanceData.slice(-7).map(item => [
          new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
          item.present.toString(),
          item.absent.toString(),
          item.late.toString(),
          `${Math.round((item.present / (item.present + item.absent)) * 100)}%`,
          item.present + item.absent + item.late
        ]);
        
        (doc as any).autoTable({
          startY: 50,
          head: [['Date', 'Present', 'Absent', 'Late', 'Rate', 'Total']],
          body: attendanceData,
          theme: 'grid',
          headStyles: { fillColor: [168, 85, 247], textColor: 255 },
          styles: { fontSize: 9, cellPadding: 3 },
          columnStyles: {
            0: { cellWidth: 45 },
            1: { cellWidth: 25, halign: 'center' },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 25, halign: 'center' },
            4: { cellWidth: 25, halign: 'center' },
            5: { cellWidth: 25, halign: 'center' }
          }
        });
        
        // Recruitment Pipeline
        const recruitmentY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(14);
        doc.text('🎯 RECRUITMENT PIPELINE STATUS', 20, recruitmentY);
        
        const recruitmentData = mockRecruitmentData.map(pos => [
          pos.position,
          pos.department,
          pos.applicants.toString(),
          pos.stage.charAt(0).toUpperCase() + pos.stage.slice(1),
          pos.priority.charAt(0).toUpperCase() + pos.priority.slice(1),
          pos.stage === 'hired' ? '✅ Complete' : '🔄 In Progress'
        ]);
        
        (doc as any).autoTable({
          startY: recruitmentY + 10,
          head: [['Position', 'Department', 'Applicants', 'Stage', 'Priority', 'Status']],
          body: recruitmentData,
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11], textColor: 255 },
          styles: { fontSize: 8, cellPadding: 3 },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 25 },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 25, halign: 'center' },
            4: { cellWidth: 20, halign: 'center' },
            5: { cellWidth: 30, halign: 'center' }
          }
        });
        
        // Key Insights
        const insightsY = (doc as any).lastAutoTable.finalY + 25;
        doc.setFontSize(14);
        doc.text('💡 KEY INSIGHTS & STRATEGIC RECOMMENDATIONS', 20, insightsY);
        
        // Insights Box
        doc.setFillColor(254, 252, 232);
        doc.rect(20, insightsY + 5, 170, 60, 'F');
        doc.setDrawColor(251, 191, 36);
        doc.rect(20, insightsY + 5, 170, 60);
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const insights = [
          `🌟 STRENGTHS: ${highPerformers} employees (${Math.round((highPerformers/totalEmployees)*100)}%) are high performers with 4.5+ ratings`,
          `⚠️  ATTENTION NEEDED: ${lowAttendance} employees require attendance improvement (below 90% threshold)`,
          `📋 ACTION ITEMS: ${upcomingReviews} performance reviews are pending and should be scheduled`,
          `📈 GROWTH TREND: ${recentHires} successful new hires in the last 30 days shows positive expansion`,
          `🏆 TOP DEPARTMENT: ${Object.keys(departmentData).find(dept => {
            const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
            const avgRating = deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / deptEmployees.length;
            return avgRating === Math.max(...Object.keys(departmentData).map(d => {
              const employees = mockEmployees.filter(emp => emp.department === d);
              return employees.reduce((sum, emp) => sum + emp.performanceRating, 0) / employees.length;
            }));
          })} leads in performance metrics and team engagement`,
          `💰 COMPENSATION: Salary distribution shows balanced structure across all levels`,
          `📊 OVERALL HEALTH: ${avgAttendance}% attendance rate indicates strong team commitment`
        ];
        
        insights.forEach((insight, index) => {
          doc.text(insight, 25, insightsY + 15 + (index * 7));
        });
        
        // Add new page for charts and visual data
        doc.addPage();
        
        // Page 3 Header
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text('VISUAL ANALYTICS & TRENDS', 20, 20);
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(1);
        doc.line(20, 25, 190, 25);
        
        // Performance Metrics Summary
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('📈 PERFORMANCE METRICS DASHBOARD', 20, 40);
        
        // Create a metrics table
        const metricsData = [
          ['Employee Satisfaction', '87%', '↗ +5%', 'Excellent'],
          ['Productivity Index', '92%', '↗ +3%', 'Outstanding'],
          ['Retention Rate', '94%', '↗ +2%', 'Excellent'],
          ['Training Completion', '78%', '↘ -1%', 'Good'],
          ['Goal Achievement', '85%', '↗ +7%', 'Very Good'],
          ['Team Collaboration', '91%', '↗ +4%', 'Outstanding']
        ];
        
        (doc as any).autoTable({
          startY: 50,
          head: [['Metric', 'Current Score', 'Trend', 'Rating']],
          body: metricsData,
          theme: 'grid',
          headStyles: { fillColor: [139, 92, 246], textColor: 255 },
          styles: { fontSize: 10, cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 30, halign: 'center' }
          }
        });
        
        // Training & Development
        const trainingY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(14);
        doc.text('🎓 TRAINING & DEVELOPMENT PROGRAMS', 20, trainingY);
        
        const trainingData = [
          ['Leadership Excellence', '28 enrolled', '22 completed', '79%', 'Active'],
          ['Technical Skills Bootcamp', '45 enrolled', '38 completed', '84%', 'Active'],
          ['Communication Mastery', '35 enrolled', '31 completed', '89%', 'Completed'],
          ['Digital Transformation', '52 enrolled', '41 completed', '79%', 'Active'],
          ['Project Management', '33 enrolled', '29 completed', '88%', 'Active']
        ];
        
        (doc as any).autoTable({
          startY: trainingY + 10,
          head: [['Program Name', 'Enrolled', 'Completed', 'Success Rate', 'Status']],
          body: trainingData,
          theme: 'grid',
          headStyles: { fillColor: [16, 185, 129], textColor: 255 },
          styles: { fontSize: 9, cellPadding: 3 },
          columnStyles: {
            0: { cellWidth: 45 },
            1: { cellWidth: 25, halign: 'center' },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 25, halign: 'center' },
            4: { cellWidth: 25, halign: 'center' }
          }
        });
        
        // Executive Summary Box
        const summaryBoxY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFillColor(239, 246, 255);
        doc.rect(20, summaryBoxY, 170, 35, 'F');
        doc.setDrawColor(59, 130, 246);
        doc.rect(20, summaryBoxY, 170, 35);
        
        doc.setFontSize(12);
        doc.setTextColor(59, 130, 246);
        doc.text('📋 EXECUTIVE SUMMARY', 25, summaryBoxY + 8);
        
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text('This comprehensive HR report demonstrates strong organizational health with:', 25, summaryBoxY + 16);
        doc.text(`• ${Math.round((avgPerformance/5)*100)}% overall performance score across all departments`, 25, summaryBoxY + 22);
        doc.text(`• ${avgAttendance}% attendance rate indicating high employee engagement`, 25, summaryBoxY + 28);
        doc.text('• Balanced compensation structure and active recruitment pipeline', 25, summaryBoxY + 34);
        
        // Report Metadata
        const metadataY = summaryBoxY + 45;
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text('Report Classification: Internal Use Only', 20, metadataY);
        doc.text('Data Sources: HRIS, Attendance System, Performance Management', 20, metadataY + 6);
        doc.text('Next Review Date: ' + new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString(), 20, metadataY + 12);
        });
        
        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`HR Dashboard Analytics Report - Page ${i} of ${pageCount}`, 20, doc.internal.pageSize.height - 10);
          doc.text(`Generated: ${currentDate} | Confidential`, doc.internal.pageSize.width - 80, doc.internal.pageSize.height - 10);
          
          // Add a subtle footer line
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.5);
          doc.line(20, doc.internal.pageSize.height - 15, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 15);
        }
        
        // Save the PDF
        const fileName = `HR-Dashboard-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        // Show success message
        alert('✅ Comprehensive HR Report generated successfully!\n\n📄 Report includes:\n• Executive Summary\n• Department Analysis\n• Top Performers\n• Attendance Trends\n• Recruitment Pipeline\n• Training Programs\n• Strategic Insights\n\nCheck your downloads folder for the PDF file.');
      }).catch(error => {
        console.error('Error loading jsPDF autoTable:', error);
        alert('❌ Error generating PDF report. Please try again.\n\nIf the issue persists, please contact IT support.');
      });
    }).catch(error => {
      console.error('Error loading jsPDF:', error);
      alert('❌ Error loading PDF library. Please try again.\n\nPlease ensure you have a stable internet connection.');
    });
  };

  return (
    <div className="space-y-4">
      {/* Compact Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-xl p-4 text-white shadow-lg">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="text-blue-100 font-medium text-sm">HR Dashboard</span>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold leading-tight">
                Welcome back, Admin
              </h1>
              <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
                Your team is performing exceptionally well. Here's your organization overview.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xl font-bold">{totalEmployees}</div>
                <div className="text-blue-200 text-xs">Employees</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{avgAttendance}%</div>
                <div className="text-blue-200 text-xs">Attendance</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{avgPerformance.toFixed(1)}</div>
                <div className="text-blue-200 text-xs">Performance</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <button 
              onClick={() => handleNavigation('employees')}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1 text-sm"
            >
              <Plus className="h-3 w-3" />
              <span>Add Employee</span>
            </button>
            <button 
              onClick={() => handleNavigation('attendance')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1 text-sm"
            >
              <Calendar className="h-3 w-3" />
              <span>Attendance</span>
            </button>
            <button 
              onClick={() => handleNavigation('payroll')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1 text-sm"
            >
              <DollarSign className="h-3 w-3" />
              <span>Payroll</span>
            </button>
            <button 
              onClick={() => handleNavigation('recruitment')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1 text-sm"
            >
              <UserCheck className="h-3 w-3" />
              <span>Recruitment</span>
            </button>
            <button 
              onClick={() => handleNavigation('performance')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1 text-sm"
            >
              <BarChart3 className="h-3 w-3" />
              <span>Performance</span>
            </button>
            <button 
              onClick={() => handleNavigation('training')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1 text-sm"
            >
              <Award className="h-3 w-3" />
              <span>Training</span>
            </button>
            <button 
              onClick={() => handleNavigation('notifications')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1 text-sm"
            >
              <Bell className="h-3 w-3" />
              <span>Notifications</span>
            </button>
            <button 
              onClick={generatePDFReport}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1 text-sm"
            >
              <FileText className="h-3 w-3" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compact Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div onClick={() => handleNavigation('employees')} className="cursor-pointer group">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md group-hover:shadow-blue-200">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                calculateTrend(totalEmployees, prevTotalEmployees).isPositive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {calculateTrend(totalEmployees, prevTotalEmployees).isPositive ? (
                  <ArrowUpRight className="h-2 w-2" />
                ) : (
                  <ArrowDownRight className="h-2 w-2" />
                )}
                <span>{Math.abs(calculateTrend(totalEmployees, prevTotalEmployees).value)}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-600 group-hover:text-gray-700">Total Employees</h3>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">{totalEmployees}</p>
              <p className="text-xs text-gray-500">{activeEmployees} active</p>
            </div>
          </div>
        </div>

        <div onClick={() => handleNavigation('payroll')} className="cursor-pointer group">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md group-hover:shadow-green-200">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                calculateTrend(avgSalary, prevAvgSalary).isPositive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {calculateTrend(avgSalary, prevAvgSalary).isPositive ? (
                  <ArrowUpRight className="h-2 w-2" />
                ) : (
                  <ArrowDownRight className="h-2 w-2" />
                )}
                <span>{Math.abs(calculateTrend(avgSalary, prevAvgSalary).value)}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-600 group-hover:text-gray-700">Average Salary</h3>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-green-600">${avgSalary.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Annual</p>
            </div>
          </div>
        </div>

        <div onClick={() => handleNavigation('attendance')} className="cursor-pointer group">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md group-hover:shadow-purple-200">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                calculateTrend(avgAttendance, prevAvgAttendance).isPositive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {calculateTrend(avgAttendance, prevAvgAttendance).isPositive ? (
                  <ArrowUpRight className="h-2 w-2" />
                ) : (
                  <ArrowDownRight className="h-2 w-2" />
                )}
                <span>{Math.abs(calculateTrend(avgAttendance, prevAvgAttendance).value)}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-600 group-hover:text-gray-700">Attendance Rate</h3>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-purple-600">{avgAttendance}%</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>

        <div onClick={() => handleNavigation('performance')} className="cursor-pointer group">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md group-hover:shadow-orange-200">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                calculateTrend(avgPerformance, prevAvgPerformance).isPositive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {calculateTrend(avgPerformance, prevAvgPerformance).isPositive ? (
                  <ArrowUpRight className="h-2 w-2" />
                ) : (
                  <ArrowDownRight className="h-2 w-2" />
                )}
                <span>{Math.abs(calculateTrend(avgPerformance, prevAvgPerformance).value)}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-600 group-hover:text-gray-700">Performance Score</h3>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-orange-600">{avgPerformance.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Out of 5.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Weekly Attendance Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Weekly Attendance</h3>
              <p className="text-gray-500 text-xs mt-0.5">Last 7 days overview</p>
            </div>
            <button 
              onClick={() => handleNavigation('attendance')}
              className="flex items-center space-x-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
            >
              <Eye className="h-3 w-3" />
              <span className="text-xs font-medium">Details</span>
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
                }
              ]}
              type="line" 
              height={200} 
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Present</span>
              <span className="font-semibold text-gray-900">
                {Math.round(mockAttendanceData.slice(-7).reduce((sum, item) => sum + item.present, 0) / 7)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Absent</span>
              <span className="font-semibold text-gray-900">
                {Math.round(mockAttendanceData.slice(-7).reduce((sum, item) => sum + item.absent, 0) / 7)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                Top Performers
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">Highest rated team members</p>
            </div>
            <button 
              onClick={() => handleNavigation('employees')}
              className="flex items-center space-x-1 px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
            >
              <Award className="h-3 w-3" />
              <span className="text-xs font-medium">View All</span>
            </button>
          </div>
          <div className="space-y-2">
            {mockEmployees
              .sort((a, b) => b.performanceRating - a.performanceRating)
              .slice(0, 4)
              .map((employee, index) => (
                <button
                  key={employee.id}
                  onClick={() => handleNavigation('employees')}
                  className="w-full flex items-center space-x-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg transition-all duration-200 text-left group hover:scale-102"
                >
                  <div className="relative">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 group-hover:text-green-700 transition-colors text-sm">{employee.name}</div>
                    <div className="text-xs text-gray-600">{employee.department}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-green-600">{employee.performanceRating.toFixed(1)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {employee.attendanceRate}%
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Compact Secondary Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Performance by Department */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Department Performance</h3>
              <p className="text-gray-500 text-xs mt-0.5">Average ratings by department</p>
            </div>
            <button 
              onClick={() => handleNavigation('performance')}
              className="flex items-center space-x-1 px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors"
            >
              <BarChart3 className="h-3 w-3" />
              <span className="text-xs font-medium">Analyze</span>
            </button>
          </div>
          <div className="w-full overflow-hidden">
            <Chart data={performanceTrendData} type="bar" height={180} color={semanticColors.departments.marketing} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <div className="text-sm font-bold text-purple-600">{Math.round(avgPerformance * 20)}%</div>
              <div className="text-xs text-gray-600">Company Avg</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-sm font-bold text-green-600">{highPerformers}</div>
              <div className="text-xs text-gray-600">Top Performers</div>
            </div>
          </div>
        </div>

        {/* Salary Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Salary Distribution</h3>
              <p className="text-gray-500 text-xs mt-0.5">Compensation breakdown</p>
            </div>
            <button 
              onClick={() => handleNavigation('payroll')}
              className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors"
            >
              <DollarSign className="h-3 w-3" />
              <span className="text-xs font-medium">Payroll</span>
            </button>
          </div>
          <div className="w-full overflow-hidden">
            <Chart data={salaryDistributionData} type="line" height={180} color={semanticColors.status.warning} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {salaryDistributionData.map((range, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                <span className="text-xs font-medium text-gray-700">{range.label}</span>
                <span className="text-sm font-bold text-yellow-600">{range.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compact Alerts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center">
                <Zap className="h-4 w-4 mr-1 text-orange-500" />
                Priority Alerts
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">Items requiring attention</p>
            </div>
            <button 
              onClick={() => handleNavigation('notifications')}
              className="flex items-center space-x-1 px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors"
            >
              <Bell className="h-3 w-3" />
              <span className="text-xs font-medium">View All</span>
            </button>
          </div>
          <div className="space-y-2">
            {upcomingReviews > 0 && (
              <button 
                onClick={() => handleNavigation('performance')}
                className="w-full flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 rounded-lg transition-all text-left border-l-4 border-yellow-400 group"
              >
                <div className="p-1.5 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 group-hover:text-yellow-700 text-sm">
                    {upcomingReviews} Performance Reviews Due
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">Schedule reviews to maintain standards</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-yellow-600 transition-colors" />
              </button>
            )}
            
            {lowAttendance > 0 && (
              <button 
                onClick={() => handleNavigation('attendance')}
                className="w-full flex items-start space-x-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-lg transition-all text-left border-l-4 border-red-400 group"
              >
                <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <Clock className="h-3 w-3 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 group-hover:text-red-700 text-sm">
                    {lowAttendance} Low Attendance Issues
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">Consider reaching out for support</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors" />
              </button>
            )}
            
            <button 
              onClick={() => handleNavigation('payroll')}
              className="w-full flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all text-left border-l-4 border-blue-400 group"
            >
              <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileText className="h-3 w-3 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 group-hover:text-blue-700 text-sm">
                  Payroll Due in 3 Days
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Ensure timesheets are submitted</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center">
                <Target className="h-4 w-4 mr-1 text-purple-500" />
                Key Insights
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">Data-driven observations</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-l-4 border-purple-400">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 text-sm">Top Department</span>
                <span className="text-sm font-bold text-purple-600">
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
              <p className="text-xs text-gray-600">Highest performance rating</p>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 text-sm">Attendance Trend</span>
                <span className="text-sm font-bold text-blue-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Improving
                </span>
              </div>
              <p className="text-xs text-gray-600">Consistent positive trend</p>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 text-sm">Team Growth</span>
                <span className="text-sm font-bold text-green-600">+{recentHires} this month</span>
              </div>
              <p className="text-xs text-gray-600">New members onboarded</p>
            </div>

            <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-l-4 border-yellow-400">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 text-sm">Open Positions</span>
                <span className="text-sm font-bold text-yellow-600">{openPositions} active</span>
              </div>
              <p className="text-xs text-gray-600">Recruitment pipeline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Department Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Department Overview</h3>
            <p className="text-gray-500 text-xs mt-0.5">Team performance and metrics breakdown</p>
          </div>
          <button 
            onClick={() => handleNavigation('employees')}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm"
          >
            <Users className="h-3 w-3" />
            <span className="font-medium">View All</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Object.entries(departmentData).map(([dept, count]) => {
            const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
            const avgDeptSalary = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.salary, 0) / count);
            const avgDeptPerformance = deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / count;
            const avgDeptAttendance = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / count);
            
            return (
              <button
                key={dept}
                onClick={() => handleNavigation('employees')}
                className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105 text-left w-full border border-gray-200 hover:border-blue-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900 text-sm">{dept}</h4>
                  <div className="flex items-center space-x-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    <Users className="h-2 w-2" />
                    <span>{count}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Salary:</span>
                    <span className="font-medium text-gray-900 text-xs">${avgDeptSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Performance:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-2 w-2 text-yellow-500 fill-current" />
                      <span className="font-medium text-gray-900 text-xs">{avgDeptPerformance.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Attendance:</span>
                    <span className="font-medium text-gray-900 text-xs">{avgDeptAttendance}%</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Score</span>
                      <span>{Math.round((avgDeptPerformance / 5) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
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