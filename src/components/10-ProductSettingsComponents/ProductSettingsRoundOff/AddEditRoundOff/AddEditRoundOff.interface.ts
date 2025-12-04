export interface RoundOff {
  id?: number;
  fromRange: string;
  toRange: string;
  prices: number[];
}

export interface AddEditRoundOffProps {
  editData?: RoundOff | null;
  onSuccess: () => void;
}
