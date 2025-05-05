import { NextResponse } from 'next/server';
import { SuratDinas } from '@/lib/models/surat-dinas';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const data: SuratDinas = await request.json();

    // Connect to the database
    const client = await clientPromise;
    const db = client.db('surat-dinas'); // Replace with your database name
    const collection = db.collection('surat-dinas'); // Replace with your collection name

    // Insert the data into the database
    const result = await collection.insertOne({
      ...data,
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ...data,
      _id: result.insertedId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan data' },
      { status: 500 }
    );
  }
}