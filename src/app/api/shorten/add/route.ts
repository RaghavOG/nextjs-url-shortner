import connectMongo from "@/lib/db";  // MongoDB connection helper
import Url from "@/model/url";  // The URL model
import { NextRequest } from "next/server";  // Type for Next.js request

export async function POST(req: NextRequest) {
  try {
    // Ensure connection to MongoDB
    await connectMongo();

    // Parse the incoming JSON body
    const { originalUrl, shortUrl } = await req.json();

    // Check if both fields are provided
    if (!originalUrl || !shortUrl) {
      return new Response(
        JSON.stringify({ error: "Both 'originalUrl' and 'shortUrl' are required" }),
        { status: 400 }
      );
    }

    // Validate the original URL format (basic check)
    const urlPattern = /^(https?:\/\/[^\s]+)$/;
    if (!urlPattern.test(originalUrl)) {
      return new Response(
        JSON.stringify({ error: "Invalid 'originalUrl' format. It must be a valid URL." }),
        { status: 400 }
      );
    }

    // Check if the short URL already exists
    const existing = await Url.findOne({ shortUrl });
    if (existing) {
      return new Response(
        JSON.stringify({ error: "The short URL already exists. Please choose a different one." }),
        { status: 400 }
      );
    }

    // Create a new URL entry in the database
    const newUrl = await Url.create({ originalUrl, shortUrl });
    return new Response(
      JSON.stringify({ message: "URL shortened successfully", shortUrl: newUrl.shortUrl }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occurred while shortening URL:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error. Please try again later." }),
      { status: 500 }
    );
  }
}
