import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../mongoDB/database';
import { Product, Category } from '../mongoDB/schema';
import { verify } from 'jsonwebtoken';
const key = process.env.TOKEN_KEY as string;

export const GET = async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json('No token', { status: 401 });
  }
  const verified = verify(token, key);

  await connectToDatabase();
  //@ts-ignore
  const products = await Product.find({ user: verified.username! });
  return NextResponse.json(products, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { category, user } = body;
  await connectToDatabase();
  const oldCategory = await Category.findOne({ category, user });
  if (!oldCategory) {
    const newCategory = new Category({ category, user });
    await newCategory.save();
  }

  const product = new Product(body);
  await product.save();
  const products = await Product.find({ user });
  const categories = await Category.find({ user });
  return NextResponse.json({ products, categories }, { status: 200 });
};

export const DELETE = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get('id');
  const user = request.nextUrl.searchParams.get('user');
  await connectToDatabase();
  const { category } = await Product.findById(id);
  await Product.findByIdAndDelete(id);
  const product = await Product.findOne({ category, user });
  if (!product) {
    await Category.findOneAndDelete({ category, user });
  }
  const categories = await Category.find({ user });
  const products = await Product.find({ user });
  return NextResponse.json({ products, categories }, { status: 200 });
};

export const PATCH = async (request: NextRequest) => {
  const body: { _id: string; user: string } = await request.json();
  await connectToDatabase();
  await Product.findOneAndReplace({ _id: body._id }, body);
  const res = await Product.find({ user: body.user });
  return NextResponse.json(res);
};
