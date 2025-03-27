'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../components/Map'), { ssr: false });

interface Visit {
  timestamp: string;
  ip: string;
  location: string;
  coordinates?: [number, number];
}

interface TrackingData {
  id: string;
  targetUrl: string;
  visits: Visit[];
}

export default function ViewTracking({ params }: { params: { key: string } }) {
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/view/${params.key}`);
        setTrackingData(response.data);
        setLoading(false);
      } catch (error) {
        setError('获取追踪数据时发生错误');
        setLoading(false);
      }
    };

    fetchData();
  }, [params.key]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
        <div className="text-xl">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">追踪记录</h1>
        {trackingData.map((tracking) => (
          <div key={tracking.id} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-2">目标URL: {tracking.targetUrl}</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">访问记录:</h3>
              {tracking.visits.length === 0 ? (
                <p className="text-gray-500">暂无访问记录</p>
              ) : (
                <div className="space-y-2">
                  {tracking.visits.map((visit, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">
                        时间: {new Date(visit.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">IP: {visit.ip}</p>
                      <p className="text-sm text-gray-600">位置: {visit.location}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 