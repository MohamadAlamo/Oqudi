export type TGetTenantResponse = {
  _id: string;
  name: {
    firstName: string;
    lastName: string;
  };
  phone: string;
  email: string;
  location: string;
  VAT: string;
};

export type TAddTenantResponse = {
  token: string;
};

export type TAddTenantRequest = {
  name: {
    firstName: string;
    lastName: string;
  };
  VAT: string;
  location: string;
  email: string;
  phone: string;
  notes: string | undefined;
};

export type TGetTenantRequest = {};
