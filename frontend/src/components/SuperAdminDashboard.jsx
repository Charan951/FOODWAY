import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dashboard data
    const [dashboardStats, setDashboardStats] = useState({
        userCount: 0,
        ownerCount: 0,
        deliveryBoyCount: 0,
        pendingOwnerCount: 0,
        categoryCount: 0
    });

    // Owner approvals data
    const [pendingOwners, setPendingOwners] = useState([]);

    // Categories data
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    // User management data
    const [users, setUsers] = useState([]);
    const [searchRole, setSearchRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Set axios defaults
    axios.defaults.baseURL = 'http://localhost:8000';
    axios.defaults.withCredentials = true;

    useEffect(() => {
        fetchDashboardStats();
        // Auto-refresh dashboard stats every 30 seconds
        const interval = setInterval(fetchDashboardStats, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeTab === 'owners') fetchPendingOwners();
        if (activeTab === 'categories') fetchCategories();
        if (activeTab === 'users') fetchUsers();
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'users') {
            const debounceTimer = setTimeout(() => {
                fetchUsers();
            }, 500);
            return () => clearTimeout(debounceTimer);
        }
    }, [searchRole, searchTerm]);

    const showMessage = (message, type = 'success') => {
        if (type === 'success') {
            setSuccess(message);
            setError('');
        } else {
            setError(message);
            setSuccess('');
        }
        setTimeout(() => {
            setSuccess('');
            setError('');
        }, 3000);
    };

    const handleLogout = async () => {
        try {
            await axios.get('/api/auth/signout');
            dispatch(logout());
            navigate('/signin');
        } catch (error) {
            console.error('Logout error:', error);
            showMessage('Error logging out', 'error');
        }
    };

    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/superadmin/dashboard-stats');
            setDashboardStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            showMessage('Error fetching dashboard statistics', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch pending owners
    const fetchPendingOwners = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/superadmin/pending-owners');
            setPendingOwners(response.data);
        } catch (error) {
            console.error('Error fetching pending owners:', error);
            showMessage('Error fetching pending owners', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Update owner status
    const updateOwnerStatus = async (userId, action) => {
        try {
            setLoading(true);
            await axios.post('/api/superadmin/update-owner-status', { userId, action });
            showMessage(`Owner ${action}d successfully`);
            fetchPendingOwners(); // Refresh the list
            fetchDashboardStats(); // Refresh stats
        } catch (error) {
            console.error('Error updating owner status:', error);
            showMessage('Error updating owner status', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/superadmin/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            showMessage('Error fetching categories', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Create category
    const createCategory = async () => {
        if (!newCategory.name.trim()) {
            showMessage('Category name is required', 'error');
            return;
        }

        try {
            setLoading(true);
            await axios.post('/api/superadmin/categories', newCategory);
            showMessage('Category created successfully');
            setNewCategory({ name: '', description: '' });
            fetchCategories(); // Refresh the list
            fetchDashboardStats(); // Refresh stats
        } catch (error) {
            console.error('Error creating category:', error);
            showMessage('Error creating category', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Delete category
    const deleteCategory = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            setLoading(true);
            await axios.delete(`/api/superadmin/categories/${categoryId}`);
            showMessage('Category deleted successfully');
            fetchCategories(); // Refresh the list
            fetchDashboardStats(); // Refresh stats
        } catch (error) {
            console.error('Error deleting category:', error);
            showMessage('Error deleting category', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchRole !== 'all') params.append('role', searchRole);
            if (searchTerm.trim()) params.append('search', searchTerm.trim());
            
            const response = await axios.get(`/api/superadmin/users?${params.toString()}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showMessage('Error fetching users', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'dashboard', label: 'Dashboard' },
                            { id: 'owners', label: 'Owner Approvals' },
                            { id: 'categories', label: 'Categories' },
                            { id: 'users', label: 'User Management' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Messages */}
                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                {/* Dashboard Overview */}
                {activeTab === 'dashboard' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                                <p className="text-2xl font-bold text-blue-600">{dashboardStats.userCount}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">Total Owners</h3>
                                <p className="text-2xl font-bold text-green-600">{dashboardStats.ownerCount}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">Delivery Boys</h3>
                                <p className="text-2xl font-bold text-purple-600">{dashboardStats.deliveryBoyCount}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">Pending Owners</h3>
                                <p className="text-2xl font-bold text-orange-600">{dashboardStats.pendingOwnerCount}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                                <p className="text-2xl font-bold text-indigo-600">{dashboardStats.categoryCount}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Owner Approvals */}
                {activeTab === 'owners' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Owner Approvals</h2>
                        {loading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : pendingOwners.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No pending approvals</div>
                        ) : (
                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <ul className="divide-y divide-gray-200">
                                    {pendingOwners.map((owner) => (
                                        <li key={owner._id} className="px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">{owner.fullName}</h3>
                                                    <p className="text-sm text-gray-500">{owner.email}</p>
                                                    <p className="text-sm text-gray-500">{owner.mobile}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => updateOwnerStatus(owner._id, 'approve')}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                                        disabled={loading}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => updateOwnerStatus(owner._id, 'reject')}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                                        disabled={loading}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Categories */}
                {activeTab === 'categories' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Management</h2>
                        
                        {/* Add Category Form */}
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Category</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={createCategory}
                                disabled={loading}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                Add Category
                            </button>
                        </div>

                        {/* Categories List */}
                        {loading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : (
                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <ul className="divide-y divide-gray-200">
                                    {categories.map((category) => (
                                        <li key={category._id} className="px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                                                    <p className="text-sm text-gray-500">{category.description}</p>
                                                </div>
                                                <button
                                                    onClick={() => deleteCategory(category._id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                                    disabled={loading}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* User Management */}
                {activeTab === 'users' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">User Management</h2>
                        
                        {/* Search and Filter */}
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select
                                    value={searchRole}
                                    onChange={(e) => setSearchRole(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="user">Users</option>
                                    <option value="owner">Owners</option>
                                    <option value="deliveryBoy">Delivery Boys</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Users List */}
                        {loading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No users found</div>
                        ) : (
                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <ul className="divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <li key={user._id} className="px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">{user.fullName}</h3>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                    <p className="text-sm text-gray-500">{user.mobile}</p>
                                                    <div className="flex items-center space-x-4 mt-2">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            user.role === 'user' ? 'bg-blue-100 text-blue-800' :
                                                            user.role === 'owner' ? 'bg-green-100 text-green-800' :
                                                            user.role === 'deliveryBoy' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                        {user.role === 'owner' && (
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {user.isApproved ? 'Approved' : 'Pending'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;