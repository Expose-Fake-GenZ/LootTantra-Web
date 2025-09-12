import { NextRequest, NextResponse } from "next/server";
import { getFilteredPlatforms } from "@/lib/data-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const sortBy = searchParams.get("sortBy") || "updated";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Use the optimized data utility function
    const result = getFilteredPlatforms({
      search,
      category,
      sortBy,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching platforms:", error);
    return NextResponse.json(
      { error: "Failed to fetch platforms" },
      { status: 500 }
    );
  }
}
