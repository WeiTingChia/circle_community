import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'thomasIsAwesomeCoolGuy';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    const user = await User.findOne({ username });
    console.log("USER LOGIN", username, user)
    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: '密碼錯誤' }, { status: 401 });
    }

    // 更新登入次數和時間
    user.loginCount += 1;
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    return NextResponse.json({ token });
  } catch (_error) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}