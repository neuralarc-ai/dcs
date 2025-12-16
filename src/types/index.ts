export interface Tender {
  id: number;
  dateSubmitted: string;
  name: string;
  deadline: string;
  quotedAmount: number;
  ourSubmissionDate: string | null;
  status: 'submitted' | 'pending';
  description: string;
  requirements: string;
}

export interface SubmittedTender {
  id: number;
  dateSubmitted: string;
  name: string;
  deadline: string;
  documentUrl: string;
  documentName: string;
}

