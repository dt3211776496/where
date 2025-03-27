import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    // 获取指定密钥的所有追踪记录
    const trackings = await prisma.tracking.findMany({
      where: { key: params.key }
    });

    if (!trackings || trackings.length === 0) {
      return NextResponse.json(
        { error: '未找到追踪记录' },
        { status: 404 }
      );
    }

    return NextResponse.json(trackings);
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    return NextResponse.json(
      { error: '获取追踪数据时发生错误' },
      { status: 500 }
    );
  }
} 