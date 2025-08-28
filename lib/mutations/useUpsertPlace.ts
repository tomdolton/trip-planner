import { useMutation, useQueryClient } from "@tanstack/react-query";

import { GooglePlaceResult } from "@/types/google-places";

import { supabase } from "@/lib/supabase";

export function useUpsertPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (googlePlace: GooglePlaceResult) => {
      // Map string price_level to integer if needed
      const priceLevelMap: Record<string, number> = {
        PRICE_LEVEL_FREE: 0,
        PRICE_LEVEL_INEXPENSIVE: 1,
        PRICE_LEVEL_MODERATE: 2,
        PRICE_LEVEL_EXPENSIVE: 3,
        PRICE_LEVEL_VERY_EXPENSIVE: 4,
      };
      let price_level = googlePlace.price_level;
      if (typeof price_level === "string" && priceLevelMap[price_level] !== undefined) {
        price_level = priceLevelMap[price_level];
      }
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User must be authenticated to save places");
      }

      // First, check if this place already exists
      const { data: existingPlace } = await supabase
        .from("places")
        .select("*")
        .eq("google_place_id", googlePlace.place_id)
        .maybeSingle();

      if (existingPlace) {
        // Update existing place with fresh data
        const { data, error } = await supabase
          .from("places")
          .update({
            name: googlePlace.name,
            lat: googlePlace.lat,
            lng: googlePlace.lng,
            formatted_address: googlePlace.formatted_address,
            place_types: googlePlace.types,
            rating: googlePlace.rating || null,
            price_level: price_level ?? null,
            website: googlePlace.website || null,
            phone_number: googlePlace.formatted_phone_number || null,
            photos: googlePlace.photos ? JSON.stringify(googlePlace.photos) : null,
            opening_hours: googlePlace.opening_hours
              ? JSON.stringify(googlePlace.opening_hours)
              : null,
            is_google_place: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingPlace.id)
          .select()
          .single();

        if (error) throw new Error(error.message);
        return data;
      } else {
        // Create new place
        const { data, error } = await supabase
          .from("places")
          .insert([
            {
              google_place_id: googlePlace.place_id,
              name: googlePlace.name,
              lat: googlePlace.lat,
              lng: googlePlace.lng,
              formatted_address: googlePlace.formatted_address,
              place_types: googlePlace.types,
              rating: googlePlace.rating || null,
              price_level: price_level ?? null,
              website: googlePlace.website || null,
              phone_number: googlePlace.formatted_phone_number || null,
              photos: googlePlace.photos ? JSON.stringify(googlePlace.photos) : null,
              opening_hours: googlePlace.opening_hours
                ? JSON.stringify(googlePlace.opening_hours)
                : null,
              is_google_place: true,
              user_id: user.id,
            },
          ])
          .select()
          .single();

        if (error) throw new Error(error.message);
        return data;
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
}
