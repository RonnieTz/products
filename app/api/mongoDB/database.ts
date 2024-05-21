import { connect } from 'mongoose';
const mongoURL = process.env.MONGODB!;

// Connect to MongoDB

export const connectToDatabase = async () => {
  try {
    await connect(mongoURL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
};
