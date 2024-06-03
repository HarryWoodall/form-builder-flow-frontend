export type PageTitleValidationResult = {
  pageIndex: number;
  isValid: boolean;
  missmatchData?: {
    elementLabel: string;
    pageTitle: string;
  };
};

export type BackButtonValidationResult = {
  pageIndex: number;
  isValid: boolean;
  errorType?: "Added" | "Missing" | undefined;
};
