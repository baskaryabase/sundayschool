import { NextApiRequest, NextApiResponse } from 'next';
import BibleVerse from '../../models/BibleVerse';
import { sequelize } from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Make sure database is connected
    await sequelize.authenticate();

    // Get random verse
    const verse = await BibleVerse.findOne({
      order: sequelize.random(),
      attributes: ['id', 'verseText', 'reference', 'language'],
    });

    if (!verse) {
      return res.status(404).json({ message: 'No verses found' });
    }

    return res.status(200).json(verse);
  } catch (error) {
    console.error('Error fetching daily verse:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}
