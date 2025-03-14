import { type NextRequest, NextResponse } from "next/server"

// Define the type for search results
interface SearchResult {
  title: string
  link: string
  snippet: string
  position: number
}

interface SearchResponse {
  searchResults: SearchResult[]
  error?: string
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    // Get the API key from environment variables
    const apiKey = process.env.SERPER_API_KEY

    if (!apiKey) {
      console.error("❌ Serper API Key is missing")
      return NextResponse.json(
        { error: "Search API Key is not set. Please check your environment variables." },
        { status: 500 },
      )
    }

    // Call the Serper.dev API (Google Search API)
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        num: 5, // Number of results to return
      }),
    })

    if (!response.ok) {
      throw new Error(`Search API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Extract and format the search results
    const searchResults: SearchResult[] =
      data.organic?.map((result: any, index: number) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        position: index + 1,
      })) || []

    return NextResponse.json({
      searchResults,
    } as SearchResponse)
  } catch (error) {
    console.error("❌ Search API error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to perform search",
        searchResults: [],
      } as SearchResponse,
      { status: 500 },
    )
  }
}

