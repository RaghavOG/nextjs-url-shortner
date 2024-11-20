import { NextResponse } from 'next/server'; // Add this import
import connectMongo from "@/lib/db";   
import Url from "@/model/url";  

export async function GET(req, { params }) {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Extract the shortUrl from params
    const { shortUrl } = await params;  // No need to await params

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
