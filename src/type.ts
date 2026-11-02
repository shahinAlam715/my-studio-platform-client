import type { ComponentProps, ComponentType, ReactNode } from "react";

/**
 * Single source of truth for every custom type in the app.
 * Pages and components import from here instead of re-declaring their own.
 */

/* ------------------------------ API models ------------------------------ */

/** Raw record returned by `GET /studiodata`. */
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

/** A single review attached to a studio. */
export type StudioReview = {
  name: string;
  rating: number;
  comment: string;
};

/** Full record returned by `GET /studiodata/:id`. */
export type StudioDetail = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  overview: string;
  ownerName: string;
  ownerEmail: string;
  rating?: number;
  amenities?: string[];
  gallery?: string[];
  reviews?: StudioReview[];
};

/** Card view-model rendered by the home and explore grids. */
export type Studio = {
  id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  price: number;
  instantBook?: boolean;
  image?: string;
};

/** Booking returned by `GET /bookings`. */
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

/* --------------------------- Shared UI models --------------------------- */

/** Session slice the navbar reads from the auth client. */
export type UserSession = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

/** A slide of the hero carousel. */
export type HeroSlide = {
  eyebrow: string;
  headline: string;
  body: string;
  image: string;
  imageAlt: string;
};

/** Sidebar entry on the dashboard. */
export type DashboardTab = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

/** External social profile, drawn as a filled brand glyph. */
export type SocialLink = {
  href: string;
  label: string;
  path: string;
};

/* ---------------------------- Component props --------------------------- */

export type LogoIconProps = {
  className?: string;
};

export type ColumnHeadingProps = {
  children: ReactNode;
};

export type StudioImageProps = {
  src?: string;
  alt: string;
};

export type DeleteStudioProps = {
  id: string;
};

export type BookingButtonProps = {
  studio: StudioDetail;
};

export type UpdateStudioProps = {
  studio: StudioDetail;
};

export type BookingCardProps = {
  booking: IBooking;
};

export type DetailsPageProps = {
  params: Promise<{ id: string }>;
};

export type FieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
};
