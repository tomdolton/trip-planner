import { NextRequest, NextResponse } from "next/server";

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    thumb: string;
  };
  alt_description?: string;
  user: {
    name: string;
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get("title");
  const description = searchParams.get("description");

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const searchQuery = createSearchQuery(title, description || undefined);

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image from Unsplash");
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const image: UnsplashImage = data.results[0];
      return NextResponse.json({ imageUrl: image.urls.small });
    }

    // No results found
    return NextResponse.json({ imageUrl: null });
  } catch (error) {
    console.error("Error fetching trip image:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}

function createSearchQuery(title: string, description?: string): string {
  const text = `${title} ${description || ""}`.toLowerCase();

  const stopWords = new Set([
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "a",
    "an",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "must",
    "shall",
  ]);

  const travelKeywords = new Set([
    "trip",
    "travel",
    "vacation",
    "holiday",
    "journey",
    "adventure",
    "visit",
    "explore",
    "tour",
    "getaway",
    "break",
    "escape",
    "excursion",
    "weekend",
    "day",
    "days",
  ]);

  const words = text.split(/\s+/).filter((word) => word.length > 2);

  const scoredWords = words.map((word) => {
    let score = 0;
    const cleanWord = word.replace(/[^\w]/g, "");

    if (stopWords.has(cleanWord)) {
      return { word: cleanWord, score: -1 };
    }

    if (travelKeywords.has(cleanWord)) {
      return { word: cleanWord, score: 0.5 };
    }

    score += cleanWord.length > 4 ? 3 : 1;

    if (/^[A-Z]/.test(word)) score += 4;

    if (
      /^(mount|mountain|lake|river|city|town|beach|island|park|national|state|bay|cape|valley|hill|peak|forest|coast|peninsula|strait|fjord|glacier|desert|canyon|falls|waterfall|spring|hot|cold|grande|grand|petit|little|old|new|upper|lower|inner|outer|royal|saint|san|santa|los|las|der|die|das|le|la|les|du|de|ben|loch|glen|strath|kyle|ness|tor|down|fell|moor|heath|wick|by|thorpe|ton|ham|burg|berg|feld|tal|bad|sur|sous|pont|port|porto|puerto|mare|mer|sea|ocean|oceano|playa|praia|costa|cote|sierra|serra|monte|monti|col|pass|paso|via|strada|rue|abbey|castle|palazzo|palais|temple|shrine|pagoda|cathedral|basilica|chiesa|kirche|iglesia|mezquita|masjid|gurdwara|wat|vihara|gompa)$/i.test(
        cleanWord
      )
    ) {
      score += 2;
    }

    if (
      /^(north|northern|south|southern|east|eastern|west|western|central|middle|upper|lower|inner|outer|greater|grand|new|old|ancient|modern|alto|alta|bajo|baja|nord|sud|est|ouest|norte|sur|este|oeste|haut|haute|bas|basse|ober|unter|gross|klein|gross|grande|piccolo|novo|nova|velho|velha|novy|nove|stary|stara|kitakyushu|minami|kita|higashi|nishi|chuo|shin|kyu|maha|uttar|dakshin|purva|paschim|madhya|pradesh|nagar|abad|pura|ganj|kot|kand|stan|istan|land|shire|borough|county|state|province|region|territory|district|prefecture|oblast|canton|departement|arrondissement|municipality|commune|parish|ward|division|zone|area|sector)$/i.test(
        cleanWord
      )
    ) {
      score += 1;
    }

    return { word: cleanWord, score };
  });

  const highScoringWords = scoredWords
    .filter((item) => item.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.word)
    .filter((word, index, arr) => arr.indexOf(word) === index);

  const travelWords = scoredWords
    .filter((item) => item.score === 0.5)
    .map((item) => item.word)
    .filter((word, index, arr) => arr.indexOf(word) === index);

  let topWords = highScoringWords.slice(0, 5);

  if (topWords.length < 5 && travelWords.length > 0) {
    const remainingSlots = 5 - topWords.length;
    topWords = [...topWords, ...travelWords.slice(0, remainingSlots)];
  }

  if (topWords.length > 0) {
    return topWords.join(" ");
  }

  const capitalizedWords = title
    .split(" ")
    .filter((word) => /^[A-Z]/.test(word) && word.length > 2)
    .slice(0, 3);

  if (capitalizedWords.length > 0) {
    return capitalizedWords.join(" ");
  }

  return title;
}
