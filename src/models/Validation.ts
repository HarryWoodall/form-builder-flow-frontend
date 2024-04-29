export type SpellCheckPageRequest = {
  Title?: string;
  BannerTitle?: string;
  LeadingParagraph?: string;
  Elements?: SpellCheckPageElement[];
};

export type SpellCheckPageElement = {
  QuestionId?: string;
  Label?: string;
  Text?: string;
  Hint?: string;
  IAG?: string;
  CustomValidationMessage?: string;
  SummaryLabel?: string;
  Options?: {
    Text?: string;
  }[];
};

export type PageSpellCheck = {
  page: string;
  pageIndex: number;
  result: SpellCheckItemValidationResult[];
};

export type SpellCheckResult = {
  start: number;
  end: number;
  misspeltWord: string;
  corrections: string[];
};

export type SpellCheckItemValidationResult = {
  questionId?: string;
  type: string;
  fullString: string;
  spellCheckResult: SpellCheckResult[];
};

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
