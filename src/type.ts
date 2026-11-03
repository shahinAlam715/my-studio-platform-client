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

/** One raw document from `GET /studiodata` — same as `StudioDetail`, but the
 *  `_id` may arrive as extended JSON and numeric fields may arrive as numbers. */
export type StudioRecord = Omit<StudioDetail, "_id"> & {
  _id: string | { $oid: string };
  hourlyRate: string | number;
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

/** Reservation lifecycle shown on the My Bookings page. */
export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

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
  /** Missing on documents created before statuses existed. */
  status?: BookingStatus;
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
  /** Called after a successful delete so the caller (e.g. My listings) can
   *  drop the card instead of navigating away. */
  onDeleted?: () => void;
};

export type BookingButtonProps = {
  studio: StudioDetail;
};

export type UpdateStudioProps = {
  studio: StudioDetail;
  /** Called after a successful update so the caller can refetch its list. */
  onUpdated?: () => void;
};

export type BookingCardProps = {
  booking: IBooking;
  /** Called after a successful delete so My Bookings can drop the card. */
  onRemoved?: (id: string) => void;
};

export type DetailsPageProps = {
  params: Promise<{ id: string }>;
};

export type FieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
};
