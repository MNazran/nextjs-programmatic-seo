import Header from "@/components/Header";
import RestaurantItem from "@/components/RestaurantItem";
import { searchRestaurants } from "@/data/restaurants";
import { Metadata } from "next";
import { cache } from "react";

interface PageProps {
  params: Promise<{ location: string; q: string }>;
}

const getRestaurants = cache(searchRestaurants);

// Dynamic SEO metadata generation for this page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Resolve and decode query/location parameters from the URL
  const { q, location } = await params;

  const qDecoded = decodeURIComponent(q);
  const locationDecoded = decodeURIComponent(location);

  const results = await getRestaurants(qDecoded, locationDecoded);

  // Return SEO-friendly metadata that updates based on search
  return {
    title: `Top ${results.length} ${qDecoded} near ${locationDecoded} - Updated ${new Date().getFullYear()}`,
    description: `Find the best ${qDecoded} near ${locationDecoded}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { q, location } = await params;

  const qDecoded = decodeURIComponent(q);
  const locationDecoded = decodeURIComponent(location);

  const results = await getRestaurants(qDecoded, locationDecoded);

  return (
    <div>
      <Header q={qDecoded} location={locationDecoded} />
      <main className="container mx-auto space-y-8 px-4 py-8">
        <h1>
          Top {results.length} {qDecoded} near {locationDecoded}
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((restaurant) => (
            <RestaurantItem key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </main>
    </div>
  );
}
