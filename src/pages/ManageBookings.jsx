import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, where, documentId, collectionGroup } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
    Calendar,
    Search,
    CheckCircle,
    XCircle,
    Eye,
    Loader2,
    AlertCircle,
    FileText,
    X,
    Filter,
    RefreshCw,
    Clock,
    Mail,
    Phone,
    MapPin,
    DollarSign,
    CreditCard
} from 'lucide-react';
import { format } from 'date-fns';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updating, setUpdating] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Enhanced Filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');

    const itemsPerPage = 10;

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const bookingsRef = collection(db, 'bookings');
            const snapshot = await getDocs(bookingsRef);

            const bookingsData = await Promise.all(snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                const booking = {
                    id: docSnap.id,
                    ...data,
                    bookingId: docSnap.id,
                    totalPrice: data.totalPrice || data.amount || 0,
                    startDate: data.startDate?.toDate ? data.startDate.toDate() : (data.startDate ? new Date(data.startDate) : null),
                    endDate: data.endDate?.toDate ? data.endDate.toDate() : (data.endDate ? new Date(data.endDate) : null),
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
                };

                // Fetch user info for display only
                if (!booking.userName && booking.userId) {
                    try {
                        const userDoc = await getDocs(query(collection(db, 'users'), where(documentId(), '==', booking.userId)));
                        if (!userDoc.empty) {
                            const userData = userDoc.docs[0].data();
                            booking.userName = userData.name || 'Unknown User';
                            booking.userEmail = userData.email || 'N/A';
                            booking.userPhone = userData.phone || 'N/A';
                        }
                    } catch (e) {
                        console.error("User fetch error", e);
                        booking.userName = 'Unknown User';
                        booking.userEmail = 'N/A';
                        booking.userPhone = 'N/A';
                    }
                }

                // Fetch hoarding info for display
                if (!booking.hoardingTitle && booking.hoardingId) {
                    try {
                        const hoardingQuery = query(collectionGroup(db, 'hoardings'), where(documentId(), '==', booking.hoardingId));
                        const hoardingDoc = await getDocs(hoardingQuery);
                        if (!hoardingDoc.empty) {
                            const hData = hoardingDoc.docs[0].data();
                            booking.hoardingTitle = hData.title || 'Unknown Hoarding';
                            booking.hoardingAddress = hData.location || hData.address || 'N/A';
                        }
                    } catch (e) {
                        console.error("Hoarding fetch error", e);
                        booking.hoardingTitle = 'Unknown Hoarding';
                        booking.hoardingAddress = 'N/A';
                    }
                }

                return booking;
            }));

            // Sort by creation date (newest first)
            bookingsData.sort((a, b) => (b.createdAt || b.startDate || 0) - (a.createdAt || a.startDate || 0));
            setBookings(bookingsData);
        } catch (err) {
            console.error(err);
            setError("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (bookingId, newStatus) => {
        if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this booking?`)) return;

        try {
            setUpdating(bookingId);
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, {
                status: newStatus,
                updatedAt: new Date()
            });

            // Update local state
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));

            if (selectedBooking && selectedBooking.id === bookingId) {
                setSelectedBooking(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            console.error('Error updating booking status:', err);
            alert("Failed to update booking status. Please try again.");
        } finally {
            setUpdating(null);
        }
    };

    const updatePaymentStatus = async (bookingId, newPaymentStatus) => {
        if (!window.confirm(`Are you sure you want to mark this booking as ${newPaymentStatus}?`)) return;

        try {
            setUpdating(bookingId);
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, {
                paymentStatus: newPaymentStatus,
                updatedAt: new Date()
            });

            // Update local state
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, paymentStatus: newPaymentStatus } : b
            ));

            if (selectedBooking && selectedBooking.id === bookingId) {
                setSelectedBooking(prev => ({ ...prev, paymentStatus: newPaymentStatus }));
            }
        } catch (err) {
            console.error('Error updating payment status:', err);
            alert("Failed to update payment status. Please try again.");
        } finally {
            setUpdating(null);
        }
    };

    const openModal = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    // Enhanced filtering logic
    const filteredBookings = bookings.filter(b => {
        const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            b.userName?.toLowerCase().includes(searchLower) ||
            b.hoardingTitle?.toLowerCase().includes(searchLower) ||
            b.userEmail?.toLowerCase().includes(searchLower) ||
            b.id.toLowerCase().includes(searchLower);

        let matchesDate = true;
        if (dateFilter === 'upcoming' && b.startDate) {
            matchesDate = b.startDate >= new Date();
        } else if (dateFilter === 'past' && b.endDate) {
            matchesDate = b.endDate < new Date();
        }

        return matchesStatus && matchesSearch && matchesDate;
    });

    // Pagination
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBookings = filteredBookings.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, dateFilter]);

    // Statistics
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'Pending').length,
        approved: bookings.filter(b => b.status === 'Approved').length,
        rejected: bookings.filter(b => b.status === 'Rejected').length,
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            Approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/40',
            Rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/40',
            Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/40',
        };
        const defaultStyle = 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || defaultStyle}`}>
                {status || 'Unknown'}
            </span>
        );
    };

    const PaymentStatusBadge = ({ paymentStatus }) => {
        const styles = {
            Paid: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/40',
            Pending: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/40',
        };
        const defaultStyle = 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[paymentStatus] || defaultStyle}`}>
                {paymentStatus || 'Unknown'}
            </span>
        );
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center p-12 text-red-500">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p>{error}</p>
            <button onClick={fetchBookings} className="mt-4 text-blue-600 hover:underline">Retry</button>
        </div>
    );

    return (
        <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Booking Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Single source of truth for all booking operations.
                    </p>
                </div>
                <button
                    onClick={fetchBookings}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Bookings</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Approved</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Rejected</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by user, hoarding, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">All Dates</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                    </select>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Hoarding</th>
                                <th className="px-6 py-4">Booking Period</th>
                                <th className="px-6 py-4 text-center">Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Payment</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {currentBookings.length > 0 ? currentBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {booking.userName?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {booking.userName || 'Unknown'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {booking.userEmail}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-gray-100 max-w-[200px] truncate" title={booking.hoardingTitle}>
                                            {booking.hoardingTitle || 'Unknown Hoarding'}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate max-w-[180px] flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {booking.hoardingAddress || 'No Address'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 dark:text-gray-100 text-xs">
                                            {booking.startDate ? format(booking.startDate, 'MMM d, yyyy') : 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            to {booking.endDate ? format(booking.endDate, 'MMM d, yyyy') : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg font-semibold">
                                            ₹{booking.totalPrice?.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <PaymentStatusBadge paymentStatus={booking.paymentStatus} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openModal(booking)}
                                                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            {booking.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(booking.id, 'Approved')}
                                                        disabled={updating === booking.id}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Approve"
                                                    >
                                                        {updating === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(booking.id, 'Rejected')}
                                                        disabled={updating === booking.id}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p>No bookings found matching your filters.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of{' '}
                            {filteredBookings.length} bookings
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Details Modal */}
            {isModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {selectedBooking.userName?.charAt(0).toUpperCase() || 'B'}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Booking Details</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {selectedBooking.id.slice(0, 12)}...</p>
                                </div>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Status, Payment & Amount Banner */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-900/40">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">Booking Status</p>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={selectedBooking.status} />
                                        <select
                                            value={selectedBooking.status || 'Pending'}
                                            onChange={(e) => updateStatus(selectedBooking.id, e.target.value)}
                                            disabled={updating === selectedBooking.id}
                                            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 p-4 rounded-xl border border-orange-200 dark:border-orange-900/40">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">Payment Status</p>
                                    <div className="flex items-center gap-2">
                                        <PaymentStatusBadge paymentStatus={selectedBooking.paymentStatus} />
                                        <select
                                            value={selectedBooking.paymentStatus || 'Pending'}
                                            onChange={(e) => updatePaymentStatus(selectedBooking.id, e.target.value)}
                                            disabled={updating === selectedBooking.id}
                                            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-4 rounded-xl border border-green-200 dark:border-green-900/40">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{selectedBooking.totalPrice?.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    Customer Information
                                </h3>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-600 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.userName || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                                            <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="font-medium text-gray-900 dark:text-white truncate">{selectedBooking.userEmail || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                                            <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.userPhone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hoarding Details */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    Hoarding Details
                                </h3>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-600 space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Title</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.hoardingTitle || 'N/A'}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                                            <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.hoardingAddress || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Period */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    Booking Period
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-900/40">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Start Date</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {selectedBooking.startDate ? format(selectedBooking.startDate, 'PPP') : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 p-4 rounded-xl border border-purple-200 dark:border-purple-900/40">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">End Date</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {selectedBooking.endDate ? format(selectedBooking.endDate, 'PPP') : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - Approval Actions */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                            {selectedBooking.status === 'Pending' ? (
                                <>
                                    <button
                                        onClick={() => { updateStatus(selectedBooking.id, 'Rejected'); closeModal(); }}
                                        disabled={updating === selectedBooking.id}
                                        className="px-5 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 disabled:opacity-50"
                                    >
                                        Reject Booking
                                    </button>
                                    <button
                                        onClick={() => { updateStatus(selectedBooking.id, 'Approved'); closeModal(); }}
                                        disabled={updating === selectedBooking.id}
                                        className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        Approve Booking
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={closeModal}
                                    className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;
