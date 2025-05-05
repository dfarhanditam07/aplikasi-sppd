import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { initDatabase } from '@/lib/init-db';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Inisialisasi database
    await initDatabase();
    
    const client = await clientPromise;
    const db = client.db('surat-dinas');
    const collection = db.collection('surat-dinas');

    // Hapus _id dari data jika ada
    const dataWithoutId = { ...data };
    delete dataWithoutId._id;

    const newSuratDinas = {
      ...dataWithoutId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    };

    const result = await collection.insertOne(newSuratDinas);
    
    if (!result.acknowledged) {
      throw new Error('Gagal menyimpan data');
    }

    // Tambahkan _id yang baru ke response
    const responseData = {
      ...newSuratDinas,
      _id: result.insertedId.toString()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Gagal membuat surat dinas' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Inisialisasi database
    await initDatabase();
    
    const client = await clientPromise;
    const db = client.db('surat-dinas');
    const collection = db.collection('surat-dinas');

    const data = await collection.find({}).toArray();
    
    // Konversi ObjectId ke string
    const formattedData = data.map(item => ({
      ...item,
      _id: item._id.toString()
    }));
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Inisialisasi database
    await initDatabase();
    
    const client = await clientPromise;
    const db = client.db('surat-dinas');
    const collection = db.collection('surat-dinas');

    // Konversi string _id ke ObjectId
    const { _id, ...dataWithoutId } = data;
    const objectId = new ObjectId(_id);

    const result = await collection.updateOne(
      { _id: objectId },
      { 
        $set: { 
          ...dataWithoutId,
          updatedAt: new Date().toISOString()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Surat dinas tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui surat dinas' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { _id } = await request.json();
    
    // Inisialisasi database
    await initDatabase();
    
    const client = await clientPromise;
    const db = client.db('surat-dinas');
    const collection = db.collection('surat-dinas');

    // Konversi string _id ke ObjectId
    const objectId = new ObjectId(_id);

    const result = await collection.deleteOne({ _id: objectId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Surat dinas tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Surat dinas berhasil dihapus' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Gagal menghapus surat dinas' }, { status: 500 });
  }
} 