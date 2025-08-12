export type TGetTenantResponse = {
  _id: string;
  name: {
    firstName: string;
    lastName: string;
  };
  phone: string;
  email: string;
  location: string;
  VAT_ID: string;
};

export type TAddTenantResponse = {
  token: string;
};

export type TAddTenantRequest = {
  name: string;
  VAT_ID: string;
  location: string;
  email: string;
  phone: string;
  notes: string | undefined;
};

export type TGetTenantRequest = {};
