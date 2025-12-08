import { useState } from 'react';
import { migrateHoardingsToCategories, verifyMigration } from '../utils/migrationScript';
import { Database, PlayCircle, CheckCircle, AlertTriangle, FileCheck } from 'lucide-react';
import Card from '../components/Card';

/**
 * Migration Runner Page
 * Run the migration to move hoardings to category-name-based subcollections
 * Structure: categories/{categoryName}/hoardings/{hoardingId}
 */
const MigrationRunner = () => {
    const [migrationStatus, setMigrationStatus] = useState('idle');
    const [migrationResults, setMigrationResults] = useState(null);
    const [verificationResults, setVerificationResults] = useState(null);
    const [error, setError] = useState(null);

    const runMigration = async (deleteOldData = false) => {
        setMigrationStatus('running');
        setError(null);
        setMigrationResults(null);

        try {
            const results = await migrateHoardingsToCategories(deleteOldData);
            setMigrationResults(results);
            setMigrationStatus('success');
        } catch (err) {
            setError(err.message);
            setMigrationStatus('error');
        }
    };

    const runVerification = async () => {
        setError(null);
        try {
            const results = await verifyMigration();
            setVerificationResults(results);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Database className="w-8 h-8 mr-3 text-primary-600" />
                    Firestore Migration Runner
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Migrate hoardings to category-name-based subcollections
                </p>
            </div>

            <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
                <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">Important</h3>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1 list-disc list-inside">
                            <li>Backup your Firestore data before running</li>
                            <li>Run verification after migration</li>
                            <li>Only delete old data after verifying</li>
                        </ul>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <PlayCircle className="w-5 h-5 mr-2 text-blue-600" />
                        Step 1: Migrate
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Copy hoardings to new structure
                    </p>
                    <button
                        onClick={() => runMigration(false)}
                        disabled={migrationStatus === 'running'}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                    >
                        {migrationStatus === 'running' ? 'Running...' : 'Run Migration'}
                    </button>
                </Card>

                <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <FileCheck className="w-5 h-5 mr-2 text-green-600" />
                        Step 2: Verify
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Check migration success
                    </p>
                    <button
                        onClick={runVerification}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                        Verify Migration
                    </button>
                </Card>

                <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                        Step 3: Clean Up
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Delete old collection
                    </p>
                    <button
                        onClick={() => runMigration(true)}
                        disabled={migrationStatus === 'running'}
                        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
                    >
                        Migrate & Delete Old
                    </button>
                </Card>
            </div>

            {error && (
                <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200">
                    <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">Error</h3>
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    </div>
                </Card>
            )}

            {migrationResults && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Migration Results
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-600 dark:text-blue-400">Total</p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {migrationResults.totalHoardings}
                            </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-green-600 dark:text-green-400">Migrated</p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                {migrationResults.migrated}
                            </p>
                        </div>
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">Failed</p>
                            <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                                {migrationResults.failed}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Per Category
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(migrationResults.categoryMapping || {}).map(([category, count]) => (
                                <div key={category} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{category}</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{count}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            )}

            {verificationResults && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Verification Results
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Old Collection</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {verificationResults.oldCollectionCount}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">New Structure</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {verificationResults.newStructureCount}
                            </p>
                        </div>
                    </div>

                    {verificationResults.oldCollectionCount === verificationResults.newStructureCount ? (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <p className="text-green-800 dark:text-green-300 font-semibold">
                                ✅ Migration verified successfully!
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                            <p className="text-yellow-800 dark:text-yellow-300 font-semibold">
                                ⚠️ Count mismatch detected!
                            </p>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default MigrationRunner;
