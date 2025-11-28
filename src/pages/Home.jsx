import { Home as HomeIcon } from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                    <HomeIcon className="w-8 h-8 mr-3 text-primary-600" />
                    Home
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Welcome to the Admin Dashboard
                </p>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Quick Start
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Get started by managing your hoardings, bookings, and users.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
