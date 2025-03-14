import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/models/Message';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { content, userId } = await req.json();
    
    const message = await Message.findById(params.id);
    if (!message) {
      return NextResponse.json({ error: '留言不存在' }, { status: 404 });
    }

    message.replies.push({ content, userId });
    await message.save();

    return NextResponse.json({ message: '回覆成功' });
  } catch (error) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}