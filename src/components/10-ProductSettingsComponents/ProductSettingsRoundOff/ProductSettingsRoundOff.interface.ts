export interface RoundOffItem {
  id: number;
  fromRange: string;
  toRange: string;
  prices: number[];
}

export interface RoundOffResponse {
  status: boolean;
  data: RoundOffItem[];
  token: string;
}
