export type ExhibitionStatus = "available" | "reserved" | "sold";

export type AdminLocation = {
  _id: string;
  name: string;
  address: string;
  contactPerson?: string;
  commissionPercent: number;
  startDate: string;
  endDate: string;
  active: boolean;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type LocationSummary = {
  soldCount: number;
  soldTotal: number;
  commissionOwed: number;
  netForPrzemek: number;
};

export type ExhibitionProduct = {
  _id: string;
  title: string;
  catalog: string;
  price: number | null;
  images: string[];
  published: boolean;
  locationId?: string | null;
  exhibitionStatus?: ExhibitionStatus | null;
  revolutPaymentLink?: string | null;
  soldAt?: string | null;
  pickupAuthorized?: boolean;
};

export type ProductOption = {
  _id: string;
  title: string;
  catalog: string;
  published: boolean;
  locationId?: string | null;
  price?: number | null;
  images?: string[];
};
