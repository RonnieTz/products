import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../mongoDB/database';
import { Category } from '../mongoDB/schema';
import { verify } from 'jsonwebtoken';
const key = process.env.TOKEN_KEY as string;

export const GET = async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json('No token', { status: 401 });
  }
  const verified = verify(token, key);
  // console.log(verified);

  await connectToDatabase();
  //@ts-ignore
  const res = await Category.find({ user: verified.username! });
  console.log(res);

  return NextResponse.json(res);
};

export const POST = async (req: NextRequest) => {
  await connectToDatabase();
  const body = await req.json();
  const oldCategory = await Category.findOne(body);
  if (oldCategory) {
    return NextResponse.json('Category already exists.', { status: 409 });
  }
  const category = new Category(body);
  await category.save();
  const res = await Category.find();
  return NextResponse.json(res);
};

export const DELETE = async (req: NextRequest) => {
  await connectToDatabase();
  const category = req.nextUrl.searchParams.get('category');
  await Category.findOneAndDelete({ category });
  const categories = await Category.find();
  return NextResponse.json(categories);
};
