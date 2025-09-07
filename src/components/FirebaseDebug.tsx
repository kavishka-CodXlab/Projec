import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const FirebaseDebug: React.FC = () => {
  const [status, setStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [error, setError] = useState<string>('');
  const [projectsCount, setProjectsCount] = useState<number>(0);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔥 Firebase Debug: Testing connection...');
        
        // Test Firestore connection
        const projectsRef = collection(db, 'projects');
        const snapshot = await getDocs(projectsRef);
        setProjectsCount(snapshot.docs.length);
        
        // Test write capability
        const testRef = collection(db, 'test');
        await addDoc(testRef, { 
          test: 'debug', 
          timestamp: new Date(),
          message: 'Firebase connection test successful'
        });
        
        setStatus('connected');
        setError('');
        console.log('✅ Firebase Debug: Connection successful');
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Connection failed');
        console.error('❌ Firebase Debug: Connection failed:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-600 max-w-sm">
      <h3 className="font-semibold text-sm mb-2 text-white">Firebase Debug</h3>
      {status === 'testing' && (
        <div className="flex items-center space-x-2 text-yellow-400">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Testing connection...</span>
        </div>
      )}
      {status === 'connected' && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Connected</span>
          </div>
          <div className="text-xs text-gray-400">
            Projects: {projectsCount}
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-red-400">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm">Error</span>
          </div>
          <div className="text-xs text-red-300 break-words">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseDebug;
