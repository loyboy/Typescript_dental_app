import { ToothJSON } from "@modules";
import { ProceduresJSON, PaymentJSON, OrthoCase, Insurance, DiagnosisJSON } from "@modules";

export interface PatientJSON {
  _id: string;
  name: string;
  datex:string;
  birthYear: number;
  gender: string;
  tags: string;
  address: string;
  email: string;
  phone: string;
  whatsapphone: string;
  medicalHistory: string[];
  procedureGraphicCode: string[];
  insurance: Insurance;
  gallery: string[];
  diagnosis: (DiagnosisJSON | null)[];
  teeth: (ToothJSON | null)[];
  procedures: (ProceduresJSON | null)[];
  payments: (PaymentJSON | null)[];
  labels: {
    text: string;
    type: string;
  }[];
  alerts: string;
  allergies: string;
  cheifComplaint: string;
  orthoCaseId: string;
  reports: string[];
  diabeticRecord: number;
  bloodPressureRecord: number;
  inrRecord: number;
  bleedingTimeRecord: number;
  pptRecord: number;
  ptRecord: number;
  medicationsDetails: any[];
  IllnessRecord: any[];
  otherLabRecords: any[];
  Concern: any[];
  impactedList: any[];
  missingList: any[];
  medicalNote: string;
}
