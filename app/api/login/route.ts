import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../mongoDB/database';
import { User } from '../mongoDB/schema';
import { compareSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

const key = process.env.TOKEN_KEY as string;

export const POST = async (request: NextRequest) => {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json('Invalid username or password', { status: 400 });
  }
  try {
    await connectToDatabase();
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json('User not found', { status: 404 });
    }
    const isPasswordMatch = compareSync(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json('Invalid password', { status: 401 });
    }
    const token = sign({ username }, key, { expiresIn: '12h' });

    return NextResponse.json({ user: user.username, token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json('Something went wrong', { status: 404 });
  }
};

export const GET = async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json('No token provided');
  }
  try {
    const { username } = verify(token, key) as { username: string };
    await connectToDatabase();
    const user = await User.findOne({
      username,
    });

    if (!user) {
      return NextResponse.json('User not found', { status: 404 });
    }
    return NextResponse.json({ user: user.username }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json('Invalid token', { status: 401 });
  }
};
