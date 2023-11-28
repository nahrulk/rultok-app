export interface RandomUsers {
  id: string;
  name: string;
  image: string;
}

// LAYOUT INCLUDES TYPES

export interface MenuItemTypes {
  iconString: string;
  colorString: string;
  sizeString: string;
}

export interface MenuItemFollowCompTypes {
  user: RandomUsers;
}
