import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 获取追踪记录
    const tracking = await prisma.tracking.findUnique({
      where: { id: params.id }
    });

    if (!tracking) {
      return NextResponse.json(
        { error: '无效的追踪链接' },
        { status: 404 }
      );
    }

    // 获取访问者IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '未知';

    // 获取地理位置信息
    let location = '未知';
    try {
      const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
      const { country, regionName, city, lat, lon } = geoResponse.data;
      location = `${country}, ${regionName}, ${city} (${lat}, ${lon})`;
    } catch (error) {
      console.error('Error getting location:', error);
    }

    // 记录访问信息
    await prisma.tracking.update({
      where: { id: params.id },
      data: {
        visits: {
          push: {
            timestamp: new Date(),
            ip,
            location
          }
        }
      }
    });

    // 重定向到目标URL
    return NextResponse.redirect(tracking.targetUrl);
  } catch (error) {
    console.error('Error processing redirect:', error);
    return NextResponse.json(
      { error: '处理重定向时发生错误' },
      { status: 500 }
    );
  }
} 