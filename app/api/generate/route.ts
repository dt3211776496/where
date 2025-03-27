import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { key, targetUrl } = await request.json();
    
    // 生成唯一的追踪ID
    const trackingId = crypto.randomBytes(8).toString('hex');
    
    // 创建新的追踪记录
    await prisma.tracking.create({
      data: {
        id: trackingId,
        key,
        targetUrl,
        visits: []
      }
    });
    
    // 构建追踪链接
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/r/${trackingId}`;
    
    return NextResponse.json({ trackingUrl });
  } catch (error) {
    console.error('Error generating tracking URL:', error);
    return NextResponse.json(
      { error: '生成追踪链接时发生错误' },
      { status: 500 }
    );
  }
} 