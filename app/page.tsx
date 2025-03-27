'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import L from 'leaflet';

// 动态导入地图组件
const Map = dynamic(() => import('./components/Map'), { ssr: false });

interface Visit {
  timestamp: string;
  ip: string;
  location: string;
  coordinates?: [number, number];
}

export default function Home() {

  const [key, setKey] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [viewKey, setViewKey] = useState('');
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateTrackingUrl = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/generate', { key, targetUrl });
      setTrackingUrl(response.data.trackingUrl);
      setError('');
    } catch (error) {
      setError('生成追踪链接时发生错误');
      console.error('Error generating tracking URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewTrackingData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(`/api/view/${viewKey}`);
      const allVisits = response.data.flatMap((tracking: any) => tracking.visits);
      setVisits(allVisits);
      setError('');
    } catch (error) {
      setError('获取追踪数据时发生错误');
      console.error('Error fetching tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    setter(e.target.value);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          链接追踪系统
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 生成追踪链接表单 */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">生成追踪链接</h2>
            <form onSubmit={generateTrackingUrl} className="space-y-4">
              <div>
                <label htmlFor="key" className="block text-sm font-medium text-gray-300">
                  密钥
                </label>
                <input
                  type="text"
                  id="key"
                  value={key}
                  onChange={(e) => handleInputChange(e, setKey)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-300">
                  目标网址
                </label>
                <input
                  type="url"
                  id="targetUrl"
                  value={targetUrl}
                  onChange={(e) => handleInputChange(e, setTargetUrl)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
              >
                {loading ? '生成中...' : '生成追踪链接'}
              </button>
            </form>
            {trackingUrl && (
              <div className="mt-6 p-4 bg-gray-700 rounded-md">
                <h3 className="text-lg font-medium text-blue-400 mb-2">生成的追踪链接：</h3>
                <div className="break-all bg-gray-800 p-3 rounded border border-gray-600 text-sm">
                  {trackingUrl}
                </div>
              </div>
            )}
          </div>

          {/* 查看追踪数据表单 */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">查看追踪数据</h2>
            <form onSubmit={viewTrackingData} className="space-y-4">
              <div>
                <label htmlFor="viewKey" className="block text-sm font-medium text-gray-300">
                  输入密钥查看数据
                </label>
                <input
                  type="text"
                  id="viewKey"
                  value={viewKey}
                  onChange={(e) => handleInputChange(e, setViewKey)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
              >
                {loading ? '加载中...' : '查看数据'}
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900 text-red-100 rounded-md">
            {error}
          </div>
        )}

        {/* 地图显示区域 */}
        {visits.length > 0 && (
          <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">访问位置地图</h2>
            <div className="h-[500px] w-full rounded-lg overflow-hidden">
              <Map visits={visits} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
