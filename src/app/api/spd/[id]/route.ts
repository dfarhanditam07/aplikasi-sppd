import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db('surat-dinas');
    const collection = db.collection('surat-dinas');

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { ...data, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Data tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const client = await clientPromise;
    const db = client.db('surat-dinas');
    const collection = db.collection('surat-dinas');

    const result = await collection.findOneAndDelete(
      { _id: new ObjectId(params.id) }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Data tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data' },
      { status: 500 }
    );
  }
} 