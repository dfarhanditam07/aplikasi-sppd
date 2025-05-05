import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { initDatabase } from '@/lib/init-db';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status harus diisi' },
        { status: 400 }
      );
    }

    // Inisialisasi database
    await initDatabase();

    const client = await clientPromise;
    const db = client.db('surat-dinas');
    const collection = db.collection('surat-dinas');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Surat dinas tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Status surat dinas berhasil diupdate',
        data: { id, status }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate data' },
      { status: 500 }
    );
  }
} 