/**
 * Typed REST client for vendetus.autos public API.
 * Auth: API key generated from app.vendetus.autos/integrations.
 *
 * Usage:
 *   const client = new VendetusClient({ apiKey: "pcsk_..." });
 *   const { cars } = await client.listMyCars();
 */

export type ClientOptions = {
  apiKey: string;
  baseUrl?: string;
};

export type Car = {
  id: string;
  slug: string;
  status: "draft" | "active" | "sold" | "archived";
  title: string;
  make: string;
  model: string;
  year: number;
  km: number | null;
  transmission: string | null;
  fuel: string | null;
  body: string | null;
  color: string | null;
  price: number;
  currency: "UYU" | "USD";
  description: string | null;
  location_dept: string;
  dealership_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CarWithPhotos = Car & {
  photos: Array<{
    id: string;
    storage_path: string;
    position: number;
    width: number | null;
    height: number | null;
  }>;
};

export type Offer = {
  id: string;
  type: "cash" | "trade" | "trade_plus_cash";
  cash_amount: number | null;
  cash_currency: "UYU" | "USD" | null;
  trade_make: string | null;
  trade_model: string | null;
  trade_year: number | null;
  trade_km: number | null;
  trade_notes: string | null;
  trade_photos: string[];
  contact_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  status: "new" | "seen" | "accepted" | "rejected" | "countered";
  seller_note: string | null;
  responded_at: string | null;
  created_at: string;
};

export type Comment = {
  id: string;
  author_name: string;
  author_email: string | null;
  body: string;
  seen_at: string | null;
  created_at: string;
};

export type AnalyticsResponse = {
  range: { days: number; since: string };
  totals: {
    view: number;
    gallery_open: number;
    offer_started: number;
    offer_submitted: number;
    comment_submitted: number;
    contact_click: number;
  };
  unique_sessions: number;
  daily_views: Record<string, number>;
  referrers: Record<string, number>;
};

export type CarUpdate = Partial<{
  title: string;
  price: number;
  currency: "UYU" | "USD";
  description: string | null;
  status: "draft" | "active" | "sold" | "archived";
  km: number | null;
  color: string | null;
}>;

export class VendetusClient {
  readonly apiKey: string;
  readonly baseUrl: string;

  constructor(opts: ClientOptions) {
    if (!opts.apiKey) throw new Error("apiKey is required");
    this.apiKey = opts.apiKey;
    this.baseUrl = (opts.baseUrl ?? "https://api.vendetus.autos").replace(/\/$/, "");
  }

  private async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`vendetus API ${res.status}: ${body}`);
    }
    return res.json() as Promise<T>;
  }

  async listMyCars(opts?: {
    status?: "draft" | "active" | "sold" | "archived";
    limit?: number;
  }): Promise<{ cars: Car[] }> {
    const params = new URLSearchParams();
    if (opts?.status) params.set("status", opts.status);
    if (opts?.limit) params.set("limit", String(opts.limit));
    const qs = params.toString() ? `?${params.toString()}` : "";
    return this.request<{ cars: Car[] }>(`/v1/cars${qs}`);
  }

  async getCar(id: string): Promise<{ car: CarWithPhotos }> {
    return this.request<{ car: CarWithPhotos }>(`/v1/cars/${id}`);
  }

  async updateCar(id: string, patch: CarUpdate): Promise<{ car: Car }> {
    return this.request<{ car: Car }>(`/v1/cars/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  }

  async listOffers(carId: string): Promise<{ offers: Offer[] }> {
    return this.request<{ offers: Offer[] }>(`/v1/cars/${carId}/offers`);
  }

  async listComments(carId: string): Promise<{ comments: Comment[] }> {
    return this.request<{ comments: Comment[] }>(
      `/v1/cars/${carId}/comments`,
    );
  }

  async getAnalytics(
    carId: string,
    opts?: { days?: number },
  ): Promise<AnalyticsResponse> {
    const qs = opts?.days ? `?days=${opts.days}` : "";
    return this.request<AnalyticsResponse>(
      `/v1/cars/${carId}/analytics${qs}`,
    );
  }
}
