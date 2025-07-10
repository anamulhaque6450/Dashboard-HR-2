import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X, Settings, Filter, Search, Plus, Edit, Trash2, Send, Calendar, Clock, User, Users, Target, TrendingUp, Download, Eye, Archive, Star, MessageSquare, Zap, Shield, DollarSign, BookOpen, UserPlus } from 'lucide-react';
import { mockNotifications, mockEmployees } from '../../data/mockData';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'alert' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  recipients?: string[];
  actionRequired?: boolean;
  relatedId?: string;
  relatedType?: 'employee' | 'course' | 'payroll' | 'recruitment';
}

interface NotificationTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  message: string;
  type: 'success' | 'warning' | 'alert' | 'info';
  priority: 'low' | 'medium' | 'high';
  triggers: string[];
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  performanceReviews: boolean;
  attendanceAlerts: boolean;
  payrollNotifications: boolean;
  trainingReminders: boolean;
  recruitmentUpdates: boolean;
  systemMaintenance: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    ...mockNotifications.map((notif, index) => ({
      ...notif,
      title: [
        'Performance Review Due',
        'New Training Available',
        'Payroll Processed',
        'Attendance Alert'
      ][index],
      priority: ['high', 'medium', 'low', 'high'][index] as 'low' | 'medium' | 'high',
      category: ['Performance', 'Training', 'Payroll', 'Attendance'][index],
      actionRequired: index % 2 === 0,
      recipients: index === 0 ? ['1', '2'] : undefined
    })),
    {
      id: '5',
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
      timestamp: '2024-01-10T20:00:00Z',
      read: false,
      priority: 'medium',
      category: 'System',
      actionRequired: false
    },
    {
      id: '6',
      type: 'success',
      title: 'New Employee Onboarded',
      message: 'John Smith has successfully completed the onboarding process',
      timestamp: '2024-01-10T15:30:00Z',
      read: true,
      priority: 'low',
      category: 'HR',
      actionRequired: false,
      relatedId: '1',
      relatedType: 'employee'
    }
  ]);

  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Performance Review Reminder',
      category: 'Performance',
      subject: 'Performance Review Due',
      message: 'Your performance review is due. Please complete it by {deadline}.',
      type: 'warning',
      priority: 'high',
      triggers: ['review_due', 'review_overdue']
    },
    {
      id: '2',
      name: 'Training Completion',
      category: 'Training',
      subject: 'Training Course Completed',
      message: 'Congratulations! You have successfully completed {course_name}.',
      type: 'success',
      priority: 'medium',
      triggers: ['course_completed']
    },
    {
      id: '3',
      name: 'Attendance Warning',
      category: 'Attendance',
      subject: 'Attendance Alert',
      message: 'Your attendance rate has fallen below the required threshold.',
      type: 'alert',
      priority: 'high',
      triggers: ['low_attendance']
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    performanceReviews: true,
    attendanceAlerts: true,
    payrollNotifications: true,
    trainingReminders: true,
    recruitmentUpdates: false,
    systemMaintenance: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'immediate'
  });

  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('notifications');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  const [newNotification, setNewNotification] = useState({
    type: 'info' as 'success' | 'warning' | 'alert' | 'info',
    title: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: '',
    recipients: [] as string[],
    actionRequired: false,
    scheduleDate: '',
    scheduleTime: ''
  });

  const [templateForm, setTemplateForm] = useState({
    name: '',
    category: '',
    subject: '',
    message: '',
    type: 'info' as 'success' | 'warning' | 'alert' | 'info',
    priority: 'medium' as 'low' | 'medium' | 'high',
    triggers: ''
  });

  const categories = ['Performance', 'Training', 'Payroll', 'Attendance', 'HR', 'System', 'Recruitment'];
  const priorities = ['low', 'medium', 'high'];
  const types = ['success', 'warning', 'alert', 'info'];

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         (filter === 'read' && notification.read) ||
                         (filter === 'action-required' && notification.actionRequired);
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    
    return matchesSearch && matchesFilter && matchesCategory && matchesPriority;
  });

  // Calculate stats
  const unreadCount = notifications.filter(notification => !notification.read).length;
  const actionRequiredCount = notifications.filter(notification => notification.actionRequired && !notification.read).length;
  const highPriorityCount = notifications.filter(notification => notification.priority === 'high' && !notification.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'alert':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Performance': return <TrendingUp className="h-4 w-4" />;
      case 'Training': return <BookOpen className="h-4 w-4" />;
      case 'Payroll': return <DollarSign className="h-4 w-4" />;
      case 'Attendance': return <Calendar className="h-4 w-4" />;
      case 'HR': return <Users className="h-4 w-4" />;
      case 'System': return <Settings className="h-4 w-4" />;
      case 'Recruitment': return <UserPlus className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAsUnread = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: false } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const deleteSelected = () => {
    setNotifications(notifications.filter(notification => !selectedNotifications.includes(notification.id)));
    setSelectedNotifications([]);
  };

  const markSelectedAsRead = () => {
    setNotifications(notifications.map(notification => 
      selectedNotifications.includes(notification.id) 
        ? { ...notification, read: true } 
        : notification
    ));
    setSelectedNotifications([]);
  };

  const handleCreateNotification = (e: React.FormEvent) => {
    e.preventDefault();
    
    const notification: Notification = {
      id: Date.now().toString(),
      type: newNotification.type,
      title: newNotification.title,
      message: newNotification.message,
      timestamp: newNotification.scheduleDate && newNotification.scheduleTime 
        ? `${newNotification.scheduleDate}T${newNotification.scheduleTime}:00Z`
        : new Date().toISOString(),
      read: false,
      priority: newNotification.priority,
      category: newNotification.category,
      recipients: newNotification.recipients.length > 0 ? newNotification.recipients : undefined,
      actionRequired: newNotification.actionRequired
    };

    setNotifications([notification, ...notifications]);
    setShowCreateModal(false);
    resetNotificationForm();
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const template: NotificationTemplate = {
      id: editingTemplate ? editingTemplate.id : Date.now().toString(),
      name: templateForm.name,
      category: templateForm.category,
      subject: templateForm.subject,
      message: templateForm.message,
      type: templateForm.type,
      priority: templateForm.priority,
      triggers: templateForm.triggers.split(',').map(t => t.trim())
    };

    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? template : t));
    } else {
      setTemplates([...templates, template]);
    }

    setShowTemplateModal(false);
    resetTemplateForm();
    setEditingTemplate(null);
  };

  const resetNotificationForm = () => {
    setNewNotification({
      type: 'info',
      title: '',
      message: '',
      priority: 'medium',
      category: '',
      recipients: [],
      actionRequired: false,
      scheduleDate: '',
      scheduleTime: ''
    });
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      category: '',
      subject: '',
      message: '',
      type: 'info',
      priority: 'medium',
      triggers: ''
    });
  };

  const openEditTemplate = (template: NotificationTemplate) => {
    setTemplateForm({
      name: template.name,
      category: template.category,
      subject: template.subject,
      message: template.message,
      type: template.type,
      priority: template.priority,
      triggers: template.triggers.join(', ')
    });
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  const exportNotifications = () => {
    const exportData = [
      'NOTIFICATIONS REPORT',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'SUMMARY:',
      `Total Notifications: ${notifications.length}`,
      `Unread: ${unreadCount}`,
      `Action Required: ${actionRequiredCount}`,
      `High Priority: ${highPriorityCount}`,
      '',
      'BY CATEGORY:',
      ...categories.map(category => {
        const categoryNotifs = notifications.filter(n => n.category === category);
        return `${category}: ${categoryNotifs.length} notifications`;
      }),
      '',
      'NOTIFICATION DETAILS:',
      ...filteredNotifications.map(notification => 
        `[${notification.priority.toUpperCase()}] ${notification.title}: ${notification.message} (${new Date(notification.timestamp).toLocaleDateString()})`
      )
    ].join('\n');

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notifications-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const testNotification = () => {
    const testNotif: Notification = {
      id: Date.now().toString(),
      type: 'info',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working correctly.',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'low',
      category: 'System',
      actionRequired: false
    };

    setNotifications([testNotif, ...notifications]);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="notifications">Notifications</option>
            <option value="templates">Templates</option>
            <option value="analytics">Analytics</option>
          </select>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setFilter('all')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              <p className="text-xs text-blue-600 mt-1">All notifications</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setFilter('unread')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              <p className="text-xs text-red-600 mt-1">Needs attention</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setFilter('action-required')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Action Required</p>
              <p className="text-2xl font-bold text-gray-900">{actionRequiredCount}</p>
              <p className="text-xs text-orange-600 mt-1">Requires response</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setPriorityFilter('high')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{highPriorityCount}</p>
              <p className="text-xs text-purple-600 mt-1">Urgent items</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
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
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="action-required">Action Required</option>
              </select>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
            >
              <CheckCircle size={16} />
              <span>Mark All Read</span>
            </button>
          )}
          {selectedNotifications.length > 0 && (
            <>
              <button
                onClick={markSelectedAsRead}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <CheckCircle size={16} />
                <span>Mark Selected Read</span>
              </button>
              <button
                onClick={deleteSelected}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <Trash2 size={16} />
                <span>Delete Selected</span>
              </button>
            </>
          )}
          <button
            onClick={exportNotifications}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          <button
            onClick={testNotification}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <Zap size={16} />
            <span>Test</span>
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {viewType === 'notifications' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No notifications found.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-3 p-4 border rounded-lg transition-all hover:shadow-md ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedNotifications([...selectedNotifications, notification.id]);
                        } else {
                          setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(notification.category)}
                          <span className="text-xs text-gray-500">{notification.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        {notification.actionRequired && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Action Required
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-600'} mb-2`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{new Date(notification.timestamp).toLocaleString()}</span>
                        {notification.recipients && (
                          <span className="flex items-center space-x-1">
                            <Users size={12} />
                            <span>{notification.recipients.length} recipients</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.read ? (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          >
                            Mark as read
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsUnread(notification.id)}
                            className="text-gray-600 hover:text-gray-800 text-xs font-medium"
                          >
                            Mark as unread
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {viewType === 'templates' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Notification Templates</h3>
            <button 
              onClick={() => setShowTemplateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
            >
              <Plus size={16} />
              <span>Add Template</span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.category}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(template.priority)}`}>
                      {template.priority}
                    </span>
                    {getNotificationIcon(template.type)}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-xs font-medium text-gray-700">Subject:</span>
                    <p className="text-sm text-gray-600">{template.subject}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-700">Message:</span>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.message}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-700">Triggers:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.triggers.map((trigger, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setNewNotification({
                        ...newNotification,
                        type: template.type,
                        title: template.subject,
                        message: template.message,
                        priority: template.priority,
                        category: template.category
                      });
                      setShowCreateModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Use Template
                  </button>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openEditTemplate(template)}
                      className="text-gray-600 hover:text-gray-800 p-1"
                      title="Edit Template"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => deleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete Template"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewType === 'analytics' && (
        <div className="space-y-6">
          {/* Notification Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">This Week</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sent:</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Read:</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Acted Upon:</span>
                  <span className="font-medium">34</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Read Rate:</span>
                  <span className="font-medium text-green-600">70%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">By Category</h4>
              <div className="space-y-3">
                {categories.slice(0, 4).map(category => {
                  const categoryCount = notifications.filter(n => n.category === category).length;
                  const percentage = notifications.length > 0 ? Math.round((categoryCount / notifications.length) * 100) : 0;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(category)}
                        <span className="text-sm text-gray-600">{category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{categoryCount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Response Times</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response:</span>
                  <span className="font-medium">2.3 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fastest:</span>
                  <span className="font-medium text-green-600">12 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slowest:</span>
                  <span className="font-medium text-red-600">2.1 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SLA Met:</span>
                  <span className="font-medium">85%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Performance review notifications sent to 15 employees
                  </p>
                  <p className="text-xs text-blue-700">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    Training completion certificates issued
                  </p>
                  <p className="text-xs text-green-700">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">
                    Attendance alerts triggered for 3 employees
                  </p>
                  <p className="text-xs text-yellow-700">6 hours ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-900">
                    System maintenance notification scheduled
                  </p>
                  <p className="text-xs text-purple-700">8 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create Notification</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetNotificationForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateNotification} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      required
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({...newNotification, type: e.target.value as any})}
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
                      Priority *
                    </label>
                    <select
                      required
                      value={newNotification.priority}
                      onChange={(e) => setNewNotification({...newNotification, priority: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={newNotification.category}
                      onChange={(e) => setNewNotification({...newNotification, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="actionRequired"
                      checked={newNotification.actionRequired}
                      onChange={(e) => setNewNotification({...newNotification, actionRequired: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <label htmlFor="actionRequired" className="text-sm font-medium text-gray-700">
                      Action Required
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter notification title"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter notification message"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={newNotification.scheduleDate}
                      onChange={(e) => setNewNotification({...newNotification, scheduleDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={newNotification.scheduleTime}
                      onChange={(e) => setNewNotification({...newNotification, scheduleTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipients (Optional)
                    </label>
                    <select
                      multiple
                      value={newNotification.recipients}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setNewNotification({...newNotification, recipients: values});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      size={4}
                    >
                      {mockEmployees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} - {employee.department}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple recipients</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetNotificationForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send size={16} />
                    <span>Send Notification</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingTemplate ? 'Edit Template' : 'Create Template'}
                </h3>
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    resetTemplateForm();
                    setEditingTemplate(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter template name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={templateForm.category}
                      onChange={(e) => setTemplateForm({...templateForm, category: e.target.value})}
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
                      Type *
                    </label>
                    <select
                      required
                      value={templateForm.type}
                      onChange={(e) => setTemplateForm({...templateForm, type: e.target.value as any})}
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
                      Priority *
                    </label>
                    <select
                      required
                      value={templateForm.priority}
                      onChange={(e) => setTemplateForm({...templateForm, priority: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={templateForm.subject}
                      onChange={(e) => setTemplateForm({...templateForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter subject line"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={templateForm.message}
                      onChange={(e) => setTemplateForm({...templateForm, message: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter message template (use {variable} for dynamic content)"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Triggers (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={templateForm.triggers}
                      onChange={(e) => setTemplateForm({...templateForm, triggers: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., review_due, course_completed, low_attendance"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplateModal(false);
                      resetTemplateForm();
                      setEditingTemplate(null);
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
                    <span>{editingTemplate ? 'Update Template' : 'Create Template'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Notification Settings</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Delivery Methods */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Delivery Methods</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Email Notifications</div>
                        <div className="text-sm text-gray-600">Receive notifications via email</div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                          className="sr-only"
                        />
                        <div 
                          className={`w-11 h-6 rounded-full shadow-inner cursor-pointer transition-colors ${
                            settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                          }`}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Push Notifications</div>
                        <div className="text-sm text-gray-600">Browser push notifications</div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                          className="sr-only"
                        />
                        <div 
                          className={`w-11 h-6 rounded-full shadow-inner cursor-pointer transition-colors ${
                            settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => setSettings({...settings, pushNotifications: !settings.pushNotifications})}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            settings.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                          }`}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">SMS Notifications</div>
                        <div className="text-sm text-gray-600">Text message notifications</div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                          className="sr-only"
                        />
                        <div 
                          className={`w-11 h-6 rounded-full shadow-inner cursor-pointer transition-colors ${
                            settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => setSettings({...settings, smsNotifications: !settings.smsNotifications})}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            settings.smsNotifications ? 'translate-x-5' : 'translate-x-0'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Categories */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Notification Categories</h4>
                  <div className="space-y-4">
                    {[
                      { key: 'performanceReviews', label: 'Performance Reviews', desc: 'Review reminders and updates' },
                      { key: 'attendanceAlerts', label: 'Attendance Alerts', desc: 'Attendance issues and reports' },
                      { key: 'payrollNotifications', label: 'Payroll Notifications', desc: 'Payroll processing updates' },
                      { key: 'trainingReminders', label: 'Training Reminders', desc: 'Course deadlines and updates' },
                      { key: 'recruitmentUpdates', label: 'Recruitment Updates', desc: 'Hiring process notifications' },
                      { key: 'systemMaintenance', label: 'System Maintenance', desc: 'System updates and downtime' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{label}</div>
                          <div className="text-sm text-gray-600">{desc}</div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={settings[key as keyof NotificationSettings] as boolean}
                            onChange={(e) => setSettings({...settings, [key]: e.target.checked})}
                            className="sr-only"
                          />
                          <div 
                            className={`w-11 h-6 rounded-full shadow-inner cursor-pointer transition-colors ${
                              settings[key as keyof NotificationSettings] ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            onClick={() => setSettings({...settings, [key]: !settings[key as keyof NotificationSettings]})}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                              settings[key as keyof NotificationSettings] ? 'translate-x-5' : 'translate-x-0'
                            }`}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quiet Hours */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Quiet Hours</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Enable Quiet Hours</div>
                        <div className="text-sm text-gray-600">Suppress notifications during specified hours</div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.quietHours.enabled}
                          onChange={(e) => setSettings({
                            ...settings, 
                            quietHours: {...settings.quietHours, enabled: e.target.checked}
                          })}
                          className="sr-only"
                        />
                        <div 
                          className={`w-11 h-6 rounded-full shadow-inner cursor-pointer transition-colors ${
                            settings.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => setSettings({
                            ...settings, 
                            quietHours: {...settings.quietHours, enabled: !settings.quietHours.enabled}
                          })}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            settings.quietHours.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}></div>
                        </div>
                      </div>
                    </div>

                    {settings.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={settings.quietHours.start}
                            onChange={(e) => setSettings({
                              ...settings, 
                              quietHours: {...settings.quietHours, start: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                          <input
                            type="time"
                            value={settings.quietHours.end}
                            onChange={(e) => setSettings({
                              ...settings, 
                              quietHours: {...settings.quietHours, end: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Notification Frequency</h4>
                  <select
                    value={settings.frequency}
                    onChange={(e) => setSettings({...settings, frequency: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="hourly">Hourly Digest</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Digest</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;