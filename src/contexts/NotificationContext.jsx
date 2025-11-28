import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

const NotificationContext = createContext({});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        checkAlerts();
        // Poll every 5 minutes
        const interval = setInterval(checkAlerts, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const checkAlerts = async () => {
        const newNotifications = [];

        try {
            // 1. Check for bookings expiring soon (next 7 days)
            const now = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(now.getDate() + 7);

            const bookingsRef = collection(db, 'bookings');
            const bookingsSnapshot = await getDocs(query(bookingsRef, where('status', '==', 'Approved')));

            bookingsSnapshot.forEach(doc => {
                const booking = doc.data();
                if (booking.endDate) {
                    const endDate = new Date(booking.endDate);
                    if (endDate > now && endDate <= nextWeek) {
                        newNotifications.push({
                            id: `expiry-${doc.id}`,
                            type: 'warning',
                            title: 'Booking Expiring Soon',
                            message: `Booking for ${booking.hoardingTitle || 'Hoarding'} expires on ${endDate.toLocaleDateString()}`,
                            date: new Date(),
                            read: false
                        });
                    }
                }
            });

            // 2. Check for low availability (if we had inventory tracking, but for now let's skip or check pending bookings)
            const pendingSnapshot = await getDocs(query(bookingsRef, where('status', '==', 'Pending')));
            if (pendingSnapshot.size > 0) {
                newNotifications.push({
                    id: 'pending-bookings',
                    type: 'info',
                    title: 'New Booking Requests',
                    message: `You have ${pendingSnapshot.size} pending booking requests.`,
                    date: new Date(),
                    read: false
                });
            }

            setNotifications(prev => {
                // Merge new notifications with existing ones, avoiding duplicates
                const existingIds = new Set(prev.map(n => n.id));
                const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id));
                return [...uniqueNew, ...prev];
            });

            setUnreadCount(prev => prev + newNotifications.length);

        } catch (error) {
            console.error('Error checking alerts:', error);
        }
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const addNotification = (notification) => {
        setNotifications(prev => [{
            ...notification,
            id: Date.now().toString(),
            date: new Date(),
            read: false
        }, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            addNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
