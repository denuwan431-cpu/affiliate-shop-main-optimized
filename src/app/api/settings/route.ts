import { db } from '@/db';
import { settings } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allSettings = await db.query.settings.findMany();
    const config = allSettings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
