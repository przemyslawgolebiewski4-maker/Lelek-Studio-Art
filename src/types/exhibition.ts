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

/** Physical piece at a location (ExhibitionItem + product snapshot) */
export type ExhibitionProduct = {
  _id: string;
  productId: string;
  locationId?: string | null;
  catalogCode: string;
  instanceCode: string;
  sequence: number;
  displayLabel: string;
  title: string;
  catalog: string;
  price: number | null;
  images: string[];
  published: boolean;
  exhibitionStatus?: ExhibitionStatus | null;
  revolutPaymentLink?: string | null;
  soldAt?: string | null;
  pickupAuthorized?: boolean;
  /** Buyer intent only — never unlocks pickupAuthorized */
  pickupPreference?: "immediate" | "later" | null;
  pickupPreferenceSetAt?: string | null;
};

export type ProductOption = {
  _id: string;
  title: string;
  catalog: string;
  published: boolean;
  price?: number | null;
  images?: string[];
};
