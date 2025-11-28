import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Calendar, Search, CheckCircle, XCircle, Trash2, Filter, List, LayoutGrid } from 'lucide-react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingCalendar from '../components/BookingCalendar';
import { format } from 'date-fns';

const ManageBookings = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        let filtered = bookings;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.hoardingTitle?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        // Payment filter
        if (paymentFilter !== 'all') {
            filtered = filtered.filter(booking => booking.paymentStatus === paymentFilter);
        }

        setFilteredBookings(filtered);
    }, [searchTerm, statusFilter, paymentFilter, bookings]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'bookings'));

            const bookingsData = await Promise.all(
                querySnapshot.docs.map(async (docSnap) => {
                    const booking = { id: docSnap.id, ...docSnap.data() };

                    // Fetch user details
                    if (booking.userId) {
                        try {
                            const userSnapshot = await getDocs(
                                query(collection(db, 'users'), where('__name__', '==', booking.userId))
                            );
                            if (!userSnapshot.empty) {
                                booking.userName = userSnapshot.docs[0].data().name || 'Unknown';
                                booking.userEmail = userSnapshot.docs[0].data().email || '';
                            }
                        } catch (error) {
                            console.error('Error fetching user:', error);
                        }
                    }

                    // Fetch hoarding details
                    if (booking.hoardingId) {
                        try {
                            const hoardingSnapshot = await getDocs(
                                query(collection(db, 'hoardings'), where('__name__', '==', booking.hoardingId))
                            );
                            if (!hoardingSnapshot.empty) {
                                const hoardingData = hoardingSnapshot.docs[0].data();
                                booking.hoardingTitle = hoardingData.title || 'Unknown';
                                booking.hoardingLocation = hoardingData.location || '';
                                booking.amount = hoardingData.price || 0;
                            }
                        } catch (error) {
                            console.error('Error fetching hoarding:', error);
                        }
                    }

                    return booking;
                })
            );

            setBookings(bookingsData);
            setFilteredBookings(bookingsData);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            alert('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (bookingId) => {
        try {
            await updateDoc(doc(db, 'bookings', bookingId), {
                status: 'Approved'
            });
            alert('Booking approved successfully');
            fetchBookings();
        } catch (error) {
            console.error('Error approving booking:', error);
            alert('Failed to approve booking');
        }
    };

    const handleReject = async (bookingId) => {
        if (!window.confirm('Are you sure you want to reject this booking?')) return;

        try {
            await updateDoc(doc(db, 'bookings', bookingId), {
                status: 'Rejected'
            });
            alert('Booking rejected');
            fetchBookings();
        } catch (error) {
            console.error('Error rejecting booking:', error);
            alert('Failed to reject booking');
        }
    };

    const handleDelete = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;

        try {
            await deleteDoc(doc(db, 'bookings', bookingId));
            alert('Booking deleted successfully');
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert('Failed to delete booking');
        }
    };

    const handlePaymentStatusChange = async (bookingId, newStatus) => {
        try {
            await updateDoc(doc(db, 'bookings', bookingId), {
                paymentStatus: newStatus
            });
            fetchBookings();
        } catch (error) {
            console.error('Error updating payment status:', error);
            alert('Failed to update payment status');
        }
    };

    if (loading && viewMode === 'list') {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Calendar className="w-8 h-8 mr-3 text-primary-600" />
                        Manage Bookings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        View and manage all customer bookings
                    </p>
                </div>

                {/* View Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <List className="w-4 h-4 mr-2" />
                        List View
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'calendar'
                                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        Calendar View
                    </button>
                </div>
            </div>

            {viewMode === 'calendar' ? (
                <BookingCalendar />
            ) : (
                <>
                    {/* Filters */}
                    <Card className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by user or hoarding..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            {/* Payment Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={paymentFilter}
                                    onChange={(e) => setPaymentFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
                                >
                                    <option value="all">All Payments</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Bookings Table */}
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">User</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Hoarding</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Location</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Payment</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredBookings.length > 0 ? (
                                        filteredBookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {booking.userName || 'Unknown'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {booking.userEmail}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {booking.hoardingTitle || 'Unknown'}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {booking.hoardingLocation || 'N/A'}
                                                </td>
                                                <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    ₹{booking.amount?.toLocaleString() || 0}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {booking.createdAt ? format(booking.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'Approved'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                            : booking.status === 'Pending'
                                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                        }`}>
                                                        {booking.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <select
                                                        value={booking.paymentStatus || 'Unpaid'}
                                                        onChange={(e) => handlePaymentStatusChange(booking.id, e.target.value)}
                                                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${booking.paymentStatus === 'Paid'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                            }`}
                                                    >
                                                        <option value="Paid">Paid</option>
                                                        <option value="Unpaid">Unpaid</option>
                                                    </select>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center space-x-2">
                                                        {booking.status === 'Pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(booking.id)}
                                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                                    title="Approve booking"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(booking.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                    title="Reject booking"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(booking.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Delete booking"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                                                No bookings found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {bookings.length}
                            </p>
                        </Card>
                        <Card className="p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                                {bookings.filter(b => b.status === 'Pending').length}
                            </p>
                        </Card>
                        <Card className="p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                {bookings.filter(b => b.status === 'Approved').length}
                            </p>
                        </Card>
                        <Card className="p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                                ₹{bookings.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}
                            </p>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageBookings;
