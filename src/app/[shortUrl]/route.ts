import connectMongo from "@/lib/db";   
import Url from "@/model/url";  
import { NextRequest, NextResponse } from "next/server";  

export async function GET(
  req: NextRequest, 
  { params }: { params: { shortUrl: string } } // Correct typing for params
) {
  try {
    await connectMongo();

    const { shortUrl } = await params; // Directly access params without await

    // Find the URL entry in the database
    const urlEntry = await Url.findOne({ shortUrl });

    // If the short URL is not found, return a 404 response
    if (!urlEntry) {
      return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
    }

    // Redirect to the original URL
    return NextResponse.redirect(urlEntry.originalUrl);
  } catch (error) {
    console.error("Error occurred while redirecting:", error);
    // Return a 500 response in case of an error
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
