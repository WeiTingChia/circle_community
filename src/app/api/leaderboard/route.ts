import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const topUsers = await User.find()
      .select('username loginCount lastLogin')
      .sort({ loginCount: -1 })
      .limit(10);
    return NextResponse.json(topUsers);
  } catch (error) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}