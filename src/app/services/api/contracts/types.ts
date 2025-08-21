export type TContract = {
  _id: string;
  owner: string;
  tenant: string;
  startDate: string;
  endDate: string;
  paymentFrequency: string;
  amount: number;
  serviceCharge: {
    amount: number;
    currency: string;
  };
  VAT: string;
  deposit?: number;
  invoices?: any[];
  // schedulePayment?: TPaymentScheduleItem[];
  status: TContractStatus;
  createdAt: string;
  updatedAt: string;
};

export type TPaymentScheduleItem = {
  paymentNumber: number;
  dueDate: string;
  baseRental: number;
  serviceCharge: number;
  vatAmount: number;
  totalAmount: number;
  currency: string;
  status?: 'pending' | 'paid' | 'overdue';
};

export type TCreateContractRequest = {
  owner: string;
  tenant: string;
  property: string;
  unit: string;
  startDate: string;
  endDate: string;
  paymentFrequency: string;
  amount: {
    value: number;
    currency: string;
  };
  serviceCharge: {
    paymentType: string;
    value: number;
    currency: string;
  };
  VAT: string;
  deposit?: number;
  // schedulePayment?: any[];
};

export type TSchedulePaymentItem = {
  paymentId: number;
  date: string;
  value: number;
};

export type TCreateContractResponse = {
  contract: TContract;
  message: string;
};

export const CONTRACT_STATUS = {
  active: 'active',
  expired: 'expired',
  terminated: 'terminated',
  draft: 'draft',
} as const;

export type TContractStatus =
  (typeof CONTRACT_STATUS)[keyof typeof CONTRACT_STATUS];

export const PAYMENT_FREQUENCY = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  SemiAnnually: 'Semi-annually',
  annually: 'Annually',
} as const;

export type TPaymentFrequency =
  (typeof PAYMENT_FREQUENCY)[keyof typeof PAYMENT_FREQUENCY];
