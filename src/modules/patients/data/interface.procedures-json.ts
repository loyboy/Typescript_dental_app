import { EndoCaseJSON } from "modules/endodontic";

export interface ProceduresJSON {
  id: string;
  slectedGraphicCode: string[];
  patientid: string;
  name: string;
  done: boolean;
  date: string;
  tooth: number[];
  fees: number;
  quantity: number;
  status?: string;
  surface?: string;
  endoCaseId?: string;
  implantId?: string;
  // priority: number;
  // desc?: string;
  // discount?: string;
  // fdiscount?: string;
  // insurance?: string;
  // psignature?: string;
}

export interface DiagnosisJSON {
  _id: string;

  name: string;
  tooth: number;
  diagnosis: string;
}
