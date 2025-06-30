export interface Address {
  id: string;
  address: string;
  latitude: number;
  longitude: string;
  detail?: string;
  reference?: string;
  user_id: string;
  selected: boolean;
}
