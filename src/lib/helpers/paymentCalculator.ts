/**
 * Payment Schedule Calculator Utility
 * Simple functions for calculating contract payment schedules
 */

export interface ScheduleInputs {
  rentalAmount: string;
  serviceCharge: string;
  vatPercentage: string;
  securityDeposit: string;
  paymentFrequency: 'Monthly' | 'Quarterly' | 'Semi-annually' | 'Annually';
  duration: string;
  startDate: string;
  currency: string;
}

export interface PaymentObject {
  paymentNumber: number;
  dueDate: Date;
  formattedDueDate: string;
  monthsCovered: number;
  baseRental: number;
  serviceCharge: number;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  currency: string;
}

export interface ScheduleSummary {
  numberOfPayments: number;
  totalContractValue: number;
  totalServiceCharges: number;
  totalVATAmount: number;
  grandTotal: number;
  securityDeposit: number;
  payments: PaymentObject[];
  paymentFrequency: string;
  contractDuration: string;
  vatPercentage: number;
}

// ===== INPUT HELPERS =====

/**
 * Convert money input string to number
 * Example: "1,200.50" → 1200.50
 */
export const parseAmount = (input: string): number => {
  const cleaned = input.replace(/,/g, '');
  const number = parseFloat(cleaned);
  return isNaN(number) ? 0 : number;
};

/**
 * Parse duration string to total months
 * Example: "1 year 2 months" → 14
 */
export const getTotalMonths = (duration: string): number => {
  if (!duration) return 12;

  let totalMonths = 0;
  const yearMatch = duration.match(/(\d+)\s*year/i);
  const monthMatch = duration.match(/(\d+)\s*month/i);

  if (yearMatch) {
    totalMonths += parseInt(yearMatch[1]) * 12;
  }
  if (monthMatch) {
    totalMonths += parseInt(monthMatch[1]);
  }

  return totalMonths || 12;
};

/**
 * Get months between payments based on frequency
 * Example: "Quarterly" → 3
 */
export const getMonthsPerPayment = (frequency: string): number => {
  switch (frequency) {
    case 'Monthly':
      return 1;
    case 'Quarterly':
      return 3;
    case 'Semi-annually':
      return 6;
    case 'Annually':
      return 12;
    default:
      return 1;
  }
};

/**
 * Calculate how many payments needed for duration
 * Example: 13 months, quarterly → 5 payments
 */
export const getPaymentCount = (
  totalMonths: number,
  frequency: string,
): number => {
  const monthsPerPayment = getMonthsPerPayment(frequency);
  return Math.ceil(totalMonths / monthsPerPayment);
};

// ===== MONEY CALCULATIONS =====

/**
 * Calculate monthly rental rate from annual amount
 * Example: 12,000 annual → 1,000 monthly
 */
export const calculateMonthlyRental = (annualRental: number): number => {
  return annualRental / 12;
};

/**
 * Calculate monthly service charge rate from annual amount
 * Example: 2,400 annual service charge ÷ 12 = 200 per month
 */
export const calculateMonthlyServiceCharge = (
  annualServiceCharge: number,
): number => {
  return annualServiceCharge / 12;
};

/**
 * Calculate service charge for specific payment based on months covered
 * Example: Monthly rate 200 × 3 months = 600 for quarterly payment
 */
export const calculateServiceChargeForPayment = (
  annualServiceCharge: number,
  monthsCovered: number,
): number => {
  const monthlyRate = calculateMonthlyServiceCharge(annualServiceCharge);
  return monthlyRate * monthsCovered;
};

/**
 * Calculate VAT amount
 * Example: 1,000 amount × 15% = 150 VAT
 */
export const calculateVAT = (amount: number, vatPercent: number): number => {
  return amount * (vatPercent / 100);
};

// ===== PAYMENT DISTRIBUTION =====

/**
 * Calculate how many months a specific payment covers (FIXED: logical distribution)
 * Example: Payment 5 of 5 for "1 year 1 month" quarterly → 1 month
 */
export const calculateMonthsForPayment = (
  paymentNumber: number,
  totalMonths: number,
  frequency: string,
): number => {
  const monthsPerPayment = getMonthsPerPayment(frequency);
  const isLastPayment =
    paymentNumber === Math.ceil(totalMonths / monthsPerPayment);

  if (isLastPayment) {
    // Last payment covers remaining months
    const monthsCoveredByPreviousPayments =
      (paymentNumber - 1) * monthsPerPayment;
    return totalMonths - monthsCoveredByPreviousPayments;
  }

  return monthsPerPayment;
};

/**
 * Calculate rental amount for specific payment based on months covered
 * Example: Monthly rate 1,000 × 3 months = 3,000 for quarterly payment
 */
export const calculateRentalForPayment = (
  monthlyRate: number,
  monthsCovered: number,
): number => {
  return monthlyRate * monthsCovered;
};

// ===== DATE HELPERS =====

/**
 * Create payment due date
 * Example: Start Jan 1, payment 2, quarterly → Apr 1
 */
export const createPaymentDate = (
  startDate: Date,
  paymentNumber: number,
  frequency: string,
): Date => {
  const monthsPerPayment = getMonthsPerPayment(frequency);
  const monthsFromStart = (paymentNumber - 1) * monthsPerPayment;

  const paymentDate = new Date(startDate);
  paymentDate.setMonth(paymentDate.getMonth() + monthsFromStart);

  return paymentDate;
};

/**
 * Format date for display
 * Example: Date object → "01.01.2025"
 */
export const formatDate = (date: Date): string => {
  if (!date) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// ===== OBJECT BUILDERS =====

/**
 * Build single payment object with all calculated amounts
 */
export const buildSinglePayment = (
  paymentNumber: number,
  startDate: Date,
  inputs: ScheduleInputs,
  totalMonths: number,
): PaymentObject => {
  const monthlyRental = calculateMonthlyRental(
    parseAmount(inputs.rentalAmount),
  );

  const monthsCovered = calculateMonthsForPayment(
    paymentNumber,
    totalMonths,
    inputs.paymentFrequency,
  );

  const rentalForThisPayment = calculateRentalForPayment(
    monthlyRental,
    monthsCovered,
  );

  const serviceChargeForThisPayment = calculateServiceChargeForPayment(
    parseAmount(inputs.serviceCharge),
    monthsCovered,
  );

  const subtotal = rentalForThisPayment + serviceChargeForThisPayment;
  const vatAmount = calculateVAT(subtotal, parseAmount(inputs.vatPercentage));
  const totalAmount = subtotal + vatAmount;

  const paymentDate = createPaymentDate(
    startDate,
    paymentNumber,
    inputs.paymentFrequency,
  );

  return {
    paymentNumber,
    dueDate: paymentDate,
    formattedDueDate: formatDate(paymentDate),
    monthsCovered,
    baseRental: parseFloat(rentalForThisPayment.toFixed(2)),
    serviceCharge: parseFloat(serviceChargeForThisPayment.toFixed(2)),
    subtotal: parseFloat(subtotal.toFixed(2)),
    vatAmount: parseFloat(vatAmount.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    currency: inputs.currency,
  };
};

/**
 * Build complete payment schedule
 */
export const buildPaymentSchedule = (
  inputs: ScheduleInputs,
): ScheduleSummary => {
  const totalMonths = getTotalMonths(inputs.duration);
  const paymentCount = getPaymentCount(totalMonths, inputs.paymentFrequency);
  const startDate = new Date(inputs.startDate);

  // Build all payment objects
  const payments: PaymentObject[] = [];
  for (let i = 1; i <= paymentCount; i++) {
    payments.push(buildSinglePayment(i, startDate, inputs, totalMonths));
  }

  // Calculate totals
  const totalContractValue = parseAmount(inputs.rentalAmount);
  const totalServiceCharges = payments.reduce(
    (sum, payment) => sum + payment.serviceCharge,
    0,
  );
  const totalVATAmount = payments.reduce(
    (sum, payment) => sum + payment.vatAmount,
    0,
  );
  const grandTotal = payments.reduce(
    (sum, payment) => sum + payment.totalAmount,
    0,
  );
  const securityDeposit = parseAmount(inputs.securityDeposit);

  return {
    numberOfPayments: paymentCount,
    totalContractValue,
    totalServiceCharges: parseFloat(totalServiceCharges.toFixed(2)),
    totalVATAmount: parseFloat(totalVATAmount.toFixed(2)),
    grandTotal: parseFloat(grandTotal.toFixed(2)),
    securityDeposit,
    payments,
    paymentFrequency: inputs.paymentFrequency,
    contractDuration: inputs.duration,
    vatPercentage: parseAmount(inputs.vatPercentage),
  };
};
