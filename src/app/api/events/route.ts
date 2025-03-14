import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ date: -1 });
    return NextResponse.json(events);
  } catch (_error) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const event = await Event.create(data);
    return NextResponse.json(event);
  } catch (_error) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}