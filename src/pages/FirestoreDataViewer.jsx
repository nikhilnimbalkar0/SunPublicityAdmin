import React, { useState } from 'react';
import {
    useAllFirestoreData,
    useUsers,
    useBookings,
    useCategories,
    useHoardings,
    useContactMessages,
    useDashboardStats
} from '../hooks/useFirestore';
import { fetchAllData } from '../services/firestoreService';

/**
 * Firestore Data Viewer - Demo page to fetch and display all Firestore data
 */
const FirestoreDataViewer = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [realtimeEnabled, setRealtimeEnabled] = useState(false);
    const [jsonView, setJsonView] = useState(false);

    // Fetch all data
    const { data: allData, loading: allLoading, error: allError, refetch: refetchAll } = useAllFirestoreData(realtimeEnabled);

    // Individual collections
    const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers(realtimeEnabled);
    const { bookings, loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useBookings(realtimeEnabled);
    const { categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories(realtimeEnabled);
    const { hoardings, loading: hoardingsLoading, error: hoardingsError, refetch: refetchHoardings } = useHoardings();
    const { messages, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useContactMessages(realtimeEnabled);
    const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();

    // Download data as JSON
    const downloadJSON = (data, filename) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Export all data
    const handleExportAll = async () => {
        try {
            const data = await fetchAllData();
            downloadJSON(data, 'firestore_all_data');
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Failed to export data: ' + error.message);
        }
    };

    const tabs = [
        { id: 'all', label: 'All Data', count: allData ? Object.keys(allData).length - 1 : 0 },
        { id: 'users', label: 'Users', count: users.length },
        { id: 'bookings', label: 'Bookings', count: bookings.length },
        { id: 'categories', label: 'Categories', count: categories.length },
        { id: 'hoardings', label: 'Hoardings', count: hoardings.length },
        { id: 'messages', label: 'Messages', count: messages.length },
        { id: 'stats', label: 'Statistics', count: stats ? Object.keys(stats).length : 0 }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'all':
                if (allLoading) return <LoadingSpinner />;
                if (allError) return <ErrorMessage message={allError} />;
                return <DataDisplay data={allData} jsonView={jsonView} onExport={() => downloadJSON(allData, 'all_data')} />;

            case 'users':
                if (usersLoading) return <LoadingSpinner />;
                if (usersError) return <ErrorMessage message={usersError} />;
                return <DataDisplay data={users} jsonView={jsonView} onExport={() => downloadJSON(users, 'users')} onRefresh={refetchUsers} />;

            case 'bookings':
                if (bookingsLoading) return <LoadingSpinner />;
                if (bookingsError) return <ErrorMessage message={bookingsError} />;
                return <DataDisplay data={bookings} jsonView={jsonView} onExport={() => downloadJSON(bookings, 'bookings')} onRefresh={refetchBookings} />;

            case 'categories':
                if (categoriesLoading) return <LoadingSpinner />;
                if (categoriesError) return <ErrorMessage message={categoriesError} />;
                return <DataDisplay data={categories} jsonView={jsonView} onExport={() => downloadJSON(categories, 'categories')} onRefresh={refetchCategories} />;

            case 'hoardings':
                if (hoardingsLoading) return <LoadingSpinner />;
                if (hoardingsError) return <ErrorMessage message={hoardingsError} />;
                return <DataDisplay data={hoardings} jsonView={jsonView} onExport={() => downloadJSON(hoardings, 'hoardings')} onRefresh={refetchHoardings} />;

            case 'messages':
                if (messagesLoading) return <LoadingSpinner />;
                if (messagesError) return <ErrorMessage message={messagesError} />;
                return <DataDisplay data={messages} jsonView={jsonView} onExport={() => downloadJSON(messages, 'messages')} onRefresh={refetchMessages} />;

            case 'stats':
                if (statsLoading) return <LoadingSpinner />;
                if (statsError) return <ErrorMessage message={statsError} />;
                return <StatsDisplay stats={stats} onRefresh={refetchStats} />;

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">🔥 Firestore Data Viewer</h1>
                            <p className="text-gray-600 mt-1">Fetch and view all data from your Firestore database</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleExportAll}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <span>📥</span>
                                Export All
                            </button>
                            <button
                                onClick={() => setRealtimeEnabled(!realtimeEnabled)}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${realtimeEnabled
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                <span>{realtimeEnabled ? '🔴' : '⚪'}</span>
                                {realtimeEnabled ? 'Realtime ON' : 'Realtime OFF'}
                            </button>
                            <button
                                onClick={() => setJsonView(!jsonView)}
                                className={`px-4 py-2 rounded-lg transition-colors ${jsonView
                                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {jsonView ? '📋 JSON' : '📊 Table'}
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading data...</span>
    </div>
);

// Error Message Component
const ErrorMessage = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
            <span className="text-2xl">⚠️</span>
            <div>
                <h3 className="font-semibold">Error loading data</h3>
                <p className="text-sm mt-1">{message}</p>
            </div>
        </div>
    </div>
);

// Data Display Component
const DataDisplay = ({ data, jsonView, onExport, onRefresh }) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
        return (
            <div className="text-center py-12 text-gray-500">
                <span className="text-4xl mb-2 block">📭</span>
                <p>No data available</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {Array.isArray(data) ? `${data.length} items` : 'Data Object'}
                </h2>
                <div className="flex gap-2">
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                            🔄 Refresh
                        </button>
                    )}
                    <button
                        onClick={onExport}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                        💾 Export
                    </button>
                </div>
            </div>

            {jsonView ? (
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
                    {JSON.stringify(data, null, 2)}
                </pre>
            ) : (
                <div className="overflow-auto max-h-[600px]">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                {Array.isArray(data) && data.length > 0 && Object.keys(data[0]).map(key => (
                                    <th key={key} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data) ? (
                                data.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 border-b">
                                        {Object.values(item).map((value, i) => (
                                            <td key={i} className="px-4 py-2 text-sm text-gray-600">
                                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                Object.entries(data).map(([key, value]) => (
                                    <tr key={key} className="hover:bg-gray-50 border-b">
                                        <td className="px-4 py-2 text-sm font-semibold text-gray-700">{key}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600">
                                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Statistics Display Component
const StatsDisplay = ({ stats, onRefresh }) => {
    if (!stats) return null;

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'blue' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: '📅', color: 'green' },
        { label: 'Pending Bookings', value: stats.pendingBookings, icon: '⏳', color: 'yellow' },
        { label: 'Approved Bookings', value: stats.approvedBookings, icon: '✅', color: 'green' },
        { label: 'Rejected Bookings', value: stats.rejectedBookings, icon: '❌', color: 'red' },
        { label: 'Total Categories', value: stats.totalCategories, icon: '📂', color: 'purple' },
        { label: 'Active Categories', value: stats.activeCategories, icon: '✨', color: 'indigo' },
        { label: 'Total Hoardings', value: stats.totalHoardings, icon: '🏢', color: 'orange' },
        { label: 'Contact Messages', value: stats.totalContactMessages, icon: '💬', color: 'pink' },
        { label: 'Unread Messages', value: stats.unreadMessages, icon: '🔔', color: 'red' }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Dashboard Statistics</h2>
                <button
                    onClick={onRefresh}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                    🔄 Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-lg p-4 border border-${stat.color}-200`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className={`text-3xl font-bold text-${stat.color}-700`}>{stat.value}</span>
                        </div>
                        <p className={`text-sm font-medium text-${stat.color}-800`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                    <strong>Last Updated:</strong> {new Date(stats.timestamp).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default FirestoreDataViewer;
