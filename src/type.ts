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



export interface IBooking {
  _id: string;
  userName: string;
  email: string;
  image: string;
  bookingdate: string;
  studioId: string;
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  ownerName: string;
  ownerEmail: string;
}
