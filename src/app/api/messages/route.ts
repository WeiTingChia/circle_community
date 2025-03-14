import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/models/Message';

export async function GET() {
  try {
    await connectDB();
    const messages = await Message.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // 檢查用戶的留言數量
    const userMessageCount = await Message.countDocuments({
      userId: data.userId
    });

    if (userMessageCount >= 3) {
      return NextResponse.json(
        { error: '已達到留言上限（3則）' },
        { status: 400 }
      );
    }

    const message = await Message.create(data);
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: '伺服器錯誤 ' + error }, { status: 500 });
  }
}