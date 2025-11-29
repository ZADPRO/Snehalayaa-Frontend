export interface IMasterData {
  id: number;
  name: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  isDelete: boolean;
}
