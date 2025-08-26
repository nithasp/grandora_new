export interface PlayerItem {
  __typename: string;
  item_id: string;
  category: string;
  amount: number;
}

export interface Inventory {
  __typename: string;
  currency: PlayerItem[];
}

export interface GetSelf {
  __typename: string;
  inventory: Inventory;
}

export interface Data {
  GetSelf: GetSelf;
}

export interface PlayerServiceInterface {
  data: Data;
  loading: boolean;
  networkStatus: number;
}
