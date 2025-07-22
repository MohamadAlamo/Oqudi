export type TLoginResponse = TUser & {
  token: string;
};

export type TLoginRequest = {
  email: string;
  password: string;
};

export type TRegResponse = {
  token: string;
};

export type TRegRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: string;
};

export type TUser = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  accountType: string;
  properties: string[];
  units: string[];
  notes?: string;
  location: string;
};
