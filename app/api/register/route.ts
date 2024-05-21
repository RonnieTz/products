import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../mongoDB/database';
import { User } from '../mongoDB/schema';
import { hashSync, genSaltSync } from 'bcrypt';

export const POST = async (request: NextRequest) => {
  const { username, password } = await request.json();
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(password, salt);
  await connectToDatabase();
  const user = new User({ username, password: hashedPassword });
  await user.save();
  const a = await User.findOne({ username });
  console.log(a);
  return NextResponse.json({ message: 'Register successful' });
};
