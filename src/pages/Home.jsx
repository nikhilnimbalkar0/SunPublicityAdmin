import React, { useState, useEffect } from 'react';
import { collection, getCountFromServer, query, where, getDocs, collectionGroup } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
    LayoutDashboard,
    Users,
    Map as MapIcon,
    Calendar,
    DollarSign,
    TrendingUp
} from 'lucide-react';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const [stats, setStats] = useState({
        totalHoardings: 0,
        totalCustomers: 0,
        activeBookings: 0,
        monthlyRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // 1. Total Hoardings
            // Using collectionGroup as hoardings are distributed across categories
            const hoardingsSnapshot = await getDocs(collectionGroup(db, 'hoardings'));

            // 2. Total Customers (users with role 'customer')
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const customers = usersSnapshot.docs.filter(doc => doc.data().role === 'customer').length;

            // 3. Active Bookings
            const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
            const activeBookings = bookingsSnapshot.docs.filter(doc => doc.data().status === 'Approved').length;

            // 4. Monthly Revenue
            const currentMonth = new Date().getMonth();
            const revenue = bookingsSnapshot.docs.reduce((acc, doc) => {
                const data = doc.data();
                if (data.paymentStatus === 'Paid' && data.createdAt) {
                    const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                    if (date.getMonth() === currentMonth) {
                        return acc + (Number(data.amount) || 0);
                    }
                }
                return acc;
            }, 0);

            setStats({
                totalHoardings: hoardingsSnapshot.size,
                totalCustomers: customers,
                activeBookings,
                monthlyRevenue: revenue
            });

        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back to Sun Publicity Admin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Active Bookings"
                    value={stats.activeBookings}
                    icon={Calendar}
                    color="green"
                />
                <StatCard
                    title="Monthly Revenue"
                    value={`₹${stats.monthlyRevenue.toLocaleString('en-IN')}`}
                    icon={DollarSign}
                    color="yellow"
                />
                <StatCard
                    title="All Hoardings"
                    value={stats.totalHoardings}
                    icon={MapIcon}
                    color="purple"
                />
            </div>
        </div>
    );
};

export default Home;
