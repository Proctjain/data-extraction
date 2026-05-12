export type StructuredField = { field: string; value: string };

export type DocumentRecord = {
  documentType: string;
  extractedText: string[];
  structuredData: StructuredField[];
  jsonData: Record<string, unknown>;
  metrics: {
    extractionAccuracy: string;
    fieldsStructured: number;
    validationStatus: string;
  };
};

export const mockData: Record<string, DocumentRecord> = {
  "implant_card.png": {
    documentType: "Implant Card",
    extractedText: [
      "Patient: Jane Doe",
      "DOB: 07/28/1985",
      "Sex: Female",
      "Surgeon: Dr. John Doe",
      "Practice: Ohio Surgical Partners",
      "Phone: 410-555-1212",
      "Surgery Date: 01/23/2006",
      "Implant: Meni 1ST MP3",
      "Site: Foot, Right",
      "Quantity: 1",
      "Material: Cobalt Chrome",
      "Manufacturer: BioPro",
      "Serial Number: 0061234780M0",
      "ID: 123456A",
      "Allergies: Penicillin",
    ],
    structuredData: [
      { field: "Patient Name", value: "Jane Doe" },
      { field: "DOB", value: "1985-07-28" },
      { field: "Sex", value: "Female" },
      { field: "Surgeon", value: "Dr. John Doe" },
      { field: "Practice", value: "Ohio Surgical Partners" },
      { field: "Phone", value: "410-555-1212" },
      { field: "Surgery Date", value: "2006-01-23" },
      { field: "Implant", value: "Meni 1ST MP3" },
      { field: "Site", value: "Foot, Right" },
      { field: "Quantity", value: "1" },
      { field: "Material", value: "Cobalt Chrome" },
      { field: "Manufacturer", value: "BioPro" },
      { field: "Serial Number", value: "0061234780M0" },
      { field: "ID", value: "123456A" },
      { field: "Allergies", value: "Penicillin" },
      { field: "Confidence Score", value: "96%" },
    ],
    jsonData: {
      patient: { name: "Jane Doe", dob: "1985-07-28", sex: "F" },
      surgeon: "Dr. John Doe",
      practice: "Ohio Surgical Partners",
      phone: "410-555-1212",
      surgery_date: "2006-01-23",
      implant: "Meni 1ST MP3",
      site: "Foot, Right",
      qty: 1,
      material: "Cobalt Chrome",
      manufacturer: "BioPro",
      serial: "0061234780M0",
      id: "123456A",
      allergies: ["Penicillin"],
      confidence: 0.96,
    },
    metrics: {
      extractionAccuracy: "96%",
      fieldsStructured: 16,
      validationStatus: "Passed",
    },
  },
};

export const DEFAULT_DOC_KEY = "implant_card.png";
