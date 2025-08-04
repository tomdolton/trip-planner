import { useState, useEffect } from "react";

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

export function useTripImage(title: string, description?: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!title) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Create search query from title and description
        const searchQuery = createSearchQuery(title, description);

        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const image: UnsplashImage = data.results[0];
          setImageUrl(image.urls.small);
        }
        // If no results found, imageUrl remains null and TripImage will show fallback
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [title, description]);

  return { imageUrl, loading, error };
}

function createSearchQuery(title: string, description?: string): string {
  const text = `${title} ${description || ""}`.toLowerCase();

  // Enhanced filtering with better categorization
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

  // Extract potential locations (capitalized words often indicate places)
  const words = text.split(/\s+/).filter((word) => word.length > 2);

  // Priority scoring system
  const scoredWords = words.map((word) => {
    let score = 0;
    const cleanWord = word.replace(/[^\w]/g, "");

    // Skip if it's a stop word
    if (stopWords.has(cleanWord)) {
      return { word: cleanWord, score: -1 };
    }

    // Travel keywords get a lower score (we'll use them as filler if needed)
    if (travelKeywords.has(cleanWord)) {
      return { word: cleanWord, score: 0.5 };
    }

    // Higher score for longer words (likely to be place names)
    score += cleanWord.length > 4 ? 3 : 1;

    // Higher score for capitalized words in original text (proper nouns/places)
    if (/^[A-Z]/.test(word)) score += 4;

    // Bonus for common location indicators
    if (
      /^(mount|mountain|lake|river|city|town|beach|island|park|national|state|bay|cape|valley|hill|peak|forest|coast|peninsula|strait|fjord|glacier|desert|canyon|falls|waterfall|spring|hot|cold|grande|grand|petit|little|old|new|upper|lower|inner|outer|royal|saint|san|santa|los|las|der|die|das|le|la|les|du|de|ben|loch|glen|strath|kyle|ness|tor|down|fell|moor|heath|wick|by|thorpe|ton|ham|burg|berg|feld|tal|bad|sur|sous|pont|port|porto|puerto|mare|mer|sea|ocean|oceano|playa|praia|costa|cote|sierra|serra|monte|monti|col|pass|paso|via|strada|rue|abbey|castle|palazzo|palais|temple|shrine|pagoda|cathedral|basilica|chiesa|kirche|iglesia|mezquita|masjid|gurdwara|wat|vihara|gompa)$/i.test(
        cleanWord
      )
    ) {
      score += 2;
    }

    // Bonus for country/region patterns
    if (
      /^(north|northern|south|southern|east|eastern|west|western|central|middle|upper|lower|inner|outer|greater|grand|new|old|ancient|modern|alto|alta|bajo|baja|nord|sud|est|ouest|norte|sur|este|oeste|haut|haute|bas|basse|ober|unter|gross|klein|gross|grande|piccolo|novo|nova|velho|velha|novy|nove|stary|stara|kitakyushu|minami|kita|higashi|nishi|chuo|shin|kyu|maha|uttar|dakshin|purva|paschim|madhya|pradesh|nagar|abad|pura|ganj|kot|kand|stan|istan|land|shire|borough|county|state|province|region|territory|district|prefecture|oblast|canton|departement|arrondissement|municipality|commune|parish|ward|division|zone|area|sector)$/i.test(
        cleanWord
      )
    ) {
      score += 1;
    }

    return { word: cleanWord, score };
  });

  // Sort by score and separate high-scoring vs travel keywords
  const highScoringWords = scoredWords
    .filter((item) => item.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.word)
    .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates

  const travelWords = scoredWords
    .filter((item) => item.score === 0.5)
    .map((item) => item.word)
    .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates

  // Start with high-scoring words, then fill with travel keywords if needed
  let topWords = highScoringWords.slice(0, 5);

  if (topWords.length < 5 && travelWords.length > 0) {
    const remainingSlots = 5 - topWords.length;
    topWords = [...topWords, ...travelWords.slice(0, remainingSlots)];
  }

  // If we found good keywords, use them
  if (topWords.length > 0) {
    return topWords.join(" ");
  }

  // Fallback: try to extract any capitalized words from title
  const capitalizedWords = title
    .split(" ")
    .filter((word) => /^[A-Z]/.test(word) && word.length > 2)
    .slice(0, 3);

  if (capitalizedWords.length > 0) {
    return capitalizedWords.join(" ");
  }

  // Last resort: use the original title
  return title;
}
