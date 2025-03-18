import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/models/Message';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { userId } = await req.json();
    const { id } = await params
    const message = await Message.findById(id);
    if (!message) {
      return NextResponse.json({ error: '留言不存在' }, { status: 404 });
    }

    const likeIndex = message.likes.indexOf(userId);
    if (likeIndex === -1) {
      message.likes.push(userId);
    } else {
      message.likes.splice(likeIndex, 1);
    }
    await message.save();

    return NextResponse.json({ message: '操作成功' });
  } catch (error) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}