import connectMongo from "@/lib/db";  
import Url from "@/model/url";  
import { NextRequest, NextResponse } from "next/server";  

export async function GET(req: NextRequest, { params }: { params: { shortUrl: string } }) {
  try {
    await connectMongo();

    const { shortUrl } = await params;

    const urlEntry = await Url.findOne({ shortUrl });

    if (!urlEntry) {
      return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
    }

    return NextResponse.redirect(urlEntry.originalUrl);
  } catch (error) {
    console.error("Error occurred while redirecting:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
