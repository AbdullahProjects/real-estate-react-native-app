export interface Property {
  id: string; // uuid
  title: string;
  description: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  address: string;
  city: string;
  latitude: number; // float8
  longitude: number; // float8
  images: string[]; // _text (array of image URLs/paths)
  is_featured: boolean;
  is_sold: boolean;
  created_at: string; // timestamptz
}