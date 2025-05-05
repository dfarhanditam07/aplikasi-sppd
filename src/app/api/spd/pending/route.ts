import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('surat-dinas');
    const collection = db.collection('surat-dinas');

    const pendingSuratDinas = await collection.find({ statusApproval: 'Pending' }).toArray();

    return NextResponse.json(pendingSuratDinas);
  } catch (error) {
    console.error('Error fetching pending surat dinas:', error);
    return NextResponse.json({ error: 'Failed to fetch pending surat dinas' }, { status: 500 });
  }
}