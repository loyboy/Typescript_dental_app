export interface PaymentJSON {
  _id: string;
  date: Date;
  status: string;
  description: string;
  paidFees: number;
  discount: number;
  insurance: number;
  receipt: number;
  patientSignature?: string;
}
