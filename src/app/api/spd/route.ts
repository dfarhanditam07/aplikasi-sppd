import { NextResponse } from 'next/server';
import { validateSuratDinas } from '@/lib/models/surat-dinas';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db';

// Tambahkan fungsi untuk test koneksi
async function testConnection() {
  try {
    const client = await clientPromise;
    await client.db('surat-dinas').command({ ping: 1 });
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    return false;
  }
}

export async function GET() {
  try {
    // Test koneksi terlebih dahulu
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const client = await clientPromise;
    const db = client.db('surat-dinas');
    const collection = db.collection('surat-dinas');
    
    const suratDinasList = await collection.find({}).toArray();
    
    // Konversi ObjectId ke string
    const formattedData = suratDinasList.map(item => ({
      ...item,
      _id: item._id.toString()
    }));
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validasi data
    const errors = validateSuratDinas(data);
    if (errors.length > 0) {
      console.error('Validasi gagal:', errors);
      return NextResponse.json(
        { error: 'Data tidak valid', details: errors },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('surat-dinas');
    const collection = db.collection('surat-dinas');

    // Cek duplikasi nomor SPD
    const existingSPD = await collection.findOne({ nomorSPD: data.nomorSPD });
    if (existingSPD) {
      console.error('Nomor SPD duplikat:', data.nomorSPD);
      return NextResponse.json(
        { error: 'Nomor SPD sudah digunakan' },
        { status: 400 }
      );
    }

    const newSuratDinas = {
      ...data,
      _id: new ObjectId(),
      statusApproval: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await collection.insertOne(newSuratDinas);
    return NextResponse.json(newSuratDinas, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}