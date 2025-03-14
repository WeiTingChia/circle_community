import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    // 檢查用戶是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: '用戶名已存在' }, { status: 400 });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建新用戶
    const user = await User.create({
      username,
      password: hashedPassword,
      loginCount: 0,
      lastLogin: new Date()
    });

    return NextResponse.json({ message: '註冊成功' });
  } catch (error) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}