'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface Visit {
  timestamp: string;
  ip: string;
  location: string;
  coordinates?: [number, number];
}

interface MapProps {
  visits: Visit[];
}

export default function Map({ visits }: MapProps) {
  // 解析位置字符串获取坐标
  const getCoordinates = (location: string): [number, number] => {
    const match = location.match(/\((\d+\.\d+),\s*(\d+\.\d+)\)/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
    return [0, 0];
  };

  // 过滤出有效的访问记录
  const validVisits = visits.filter(visit => {
    const coords = getCoordinates(visit.location);
    return coords[0] !== 0 && coords[1] !== 0;
  });

  // 计算地图中心点
  const center: [number, number] = validVisits.length > 0
    ? getCoordinates(validVisits[0].location)
    : [35.8617, 104.1954]; // 默认中心点（中国）

  return (
    <MapContainer
      center={center}
      zoom={validVisits.length > 0 ? 4 : 2}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {validVisits.map((visit, index) => {
        const coords = getCoordinates(visit.location);
        return (
          <Marker key={index} position={coords}>
            <Popup>
              <div className="text-sm">
                <p><strong>IP:</strong> {visit.ip}</p>
                <p><strong>位置:</strong> {visit.location}</p>
                <p><strong>时间:</strong> {new Date(visit.timestamp).toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
} 