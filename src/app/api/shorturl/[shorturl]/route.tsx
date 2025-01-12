// app/api/shorturl/[shorturl]/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import Url from "@/model/url";
import connectMongo from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { shorturl: string } }
) {

await connectMongo();
  try {
    // Await params before using
    const shorturl = (await Promise.resolve(params)).shorturl;
    const { password } = await req.json();

    console.log("Checking password for short URL:", shorturl);
    console.log("Password received:", password);

    // Note: Using shortUrl here because that's the field name in your MongoDB schema
    const urlEntry = await Url.findOne({ shortUrl: shorturl });

    if (!urlEntry) {
      return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
    }

    if (!urlEntry.isPasswordProtected) {
      return NextResponse.json({ error: "This URL is not password protected" }, { status: 400 });
    }

    if (urlEntry.password !== password) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    return NextResponse.json({ originalUrl: urlEntry.originalUrl }, { status: 200 });
  } catch (error) {
    console.error("Error occurred while checking password:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}