export type ApiStudio = {
  _id: string | { $oid: string };
  title: string;
  category?: string;
  hourlyRate: string | number;
  location: string;
  imageUrl?: string;
  rating?: number;
  instantBook?: boolean;
};


export type Studio = {
  id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  price: number;
  instantBook: boolean;
  image: string;
};