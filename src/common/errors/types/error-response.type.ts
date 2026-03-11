export type ErrorFieldDetail = {
  field: string;
  reason: string;
};

export type ErrorDetails = {
  fields?: ErrorFieldDetail[];
  [key: string]: unknown;
} | null;

export type ErrorResponse = {
  statusCode: number;
  code: string;
  message: string;
  details: ErrorDetails;
  path: string;
  timestamp: string;
};
