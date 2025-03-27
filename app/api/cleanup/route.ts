import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 删除所有过期的记录
    const result = await prisma.tracking.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    return NextResponse.json({
      message: `已删除 ${result.count} 条过期记录`,
      deletedCount: result.count
    });
  } catch (error) {
    console.error('清理过期数据时发生错误:', error);
    return NextResponse.json(
      { error: '清理过期数据时发生错误' },
      { status: 500 }
    );
  }
} 