import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MessageCircle, Mail, Phone, User2, Clock } from 'lucide-react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
      } catch (error) {
        console.error('Error fetching contact messages:', error);
        alert('Failed to fetch contact messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const formatTimestamp = (value) => {
    if (!value) return 'N/A';

    try {
      const date = value?.toDate ? value.toDate() : new Date(value);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <MessageCircle className="w-8 h-8 mr-3 text-primary-600" />
          Contact Messages
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View messages submitted from the website contact section
        </p>
      </div>

      {messages.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No contact messages found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {messages.map((msg) => (
            <Card key={msg.id} className="p-4 flex flex-col space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center text-gray-900 dark:text-white font-semibold">
                    <User2 className="w-4 h-4 mr-2 text-primary-600" />
                    <span>{msg.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-1.5" />
                    <span>{formatTimestamp(msg.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300 border-y border-gray-200 dark:border-gray-700 py-2 space-y-1">
                {msg.email && (
                  <div className="flex items-center break-all">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{msg.email}</span>
                  </div>
                )}
                {msg.phone && (
                  <div className="flex items-center break-all">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{msg.phone}</span>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap break-words">
                {msg.message || 'No message provided.'}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
