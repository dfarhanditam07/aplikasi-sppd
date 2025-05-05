import clientPromise from './mongodb';

export async function initDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('surat-dinas');

    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'surat-dinas');

    if (!collectionExists) {
      await db.createCollection('surat-dinas');
    }

    await db.collection('surat-dinas').createIndex({ status: 1 });
    await db.collection('surat-dinas').createIndex({ tanggal: 1 });
    await db.collection('surat-dinas').createIndex({ nama: 1 });
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}