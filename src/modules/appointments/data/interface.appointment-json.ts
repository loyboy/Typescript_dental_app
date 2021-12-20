export interface AppointmentJSON {
    _id: string;
    treatmentID: string;
    patientID: string;
    previousId: string;
    date: number;
    procedureId: string;
    involvedTeeth: number[];
    time: number;
    paidAmount: number;
    finalPrice: number;
    isDone: boolean;
    prescriptions: {
        prescription: string;
        id: string
    }[];
    instructions: {
        instruction: string;
        id: string
    }[];
    complaint: string;
    diagnosis: string;
    cinsurance: boolean,
    dentist: string;
    staffID?: string[];
    doctorsID?: string[];
    units: number;
    notes: string;
    status: string;
    discount?: number;
    roomNumber: number;
    treatUnitGroup: {
        treatment: string;
        unit: number;
        fees: number
    }[];

}
