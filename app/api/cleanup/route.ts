import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 删除3天前的访问记录
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    await prisma.visit.deleteMany({
      where: {
        timestamp: {
          lt: threeDaysAgo
        }
      }
    });

    // 删除没有访问记录的追踪链接
    await prisma.tracking.deleteMany({
      where: {
        visits: {
          none: {}
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: '清理失败' }, { status: 500 });
  }
} 