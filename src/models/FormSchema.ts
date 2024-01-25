export const ElementEnums = [
  "Name",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "HR",
  "Img",
  "P",
  "OL",
  "UL",
  "AddAnother",
  "Address",
  "AddressManual",
  "Booking",
  "Button",
  "Checkbox",
  "DateInput",
  "DatePicker",
  "Declaration",
  "DocumentDownload",
  "DocumentUpload",
  "Fieldset",
  "FileUpload",
  "InlineAlert",
  "Legend",
  "Link",
  "Map",
  "MultipleFileUpload",
  "Organisation",
  "Radio",
  "Reusable",
  "Select",
  "Span",
  "Street",
  "Summary",
  "Textarea",
  "Textbox",
  "TimeInput",
  "UploadedFilesSummary",
  "Warning",
] as const;
export type EElementType = (typeof ElementEnums)[number];
export const DocumentTypeEnums = ["Unknown", "Txt", "Html", "Pdf"];
export type EDocumentType = (typeof DocumentTypeEnums)[number];
export type ESize = 0 | 1 | 2 | 3 | 4;
export type ECondition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type EDateUnit = 0 | 1 | 2;
export const BehaviourTypeEnums = [
  "Unknown",
  "GoToPage",
  "SubmitForm",
  "GoToExternalPage",
  "SubmitAndPay",
  "SubmitAndRedirect",
  "SubmitAndEmail",
  "SubmitWithoutSubmission",
];
export type EBehaviourType = (typeof BehaviourTypeEnums)[number];
export type EHttpActionType = 0 | 1 | 2;
export type EActionType = "Unknown" | "RetrieveExternalData" | "UserEmail" | "BackOfficeEmail" | "Validate" | "TemplatedEmail";
export type EEnabledFor = "Unknown" | "TimeWindow";

export interface FormSchema {
  FormName?: null | string;
  BaseURL?: null | string;
  StartPageUrl?: null | string;
  FirstPageSlug?: null | string;
  FormAccessKey?: null | string;
  FormAccessKeyName?: null | string;
  FormAccessReferrers?: string[] | null;
  Embeddable?: boolean;
  FeedbackForm?: null | string;
  FeedbackPhase?: null | string;
  GenerateReferenceNumber?: boolean;
  GeneratedReferenceNumberMapping?: null | string;
  SavePaymentAmount?: boolean;
  PaymentAmountMapping?: null | string;
  ProcessPaymentCallbackResponse?: boolean;
  CallbackFailureContactNumber?: null | string;
  ReferencePrefix?: null | string;
  BreadCrumbs?: Breadcrumb[] | null;
  Pages?: Page[] | null;
  FormActions?: IAction[] | null;
  EnvironmentAvailabilities?: EnvironmentAvailability[] | null;
  HasDocumentUpload?: boolean;
  DocumentType?: EDocumentType[] | null;
}
export interface Breadcrumb {
  Text?: null | string;
  Url?: null | string;
}
export interface Page {
  Title?: null | string;
  PageSlug?: null | string;
  DisplayBreadCrumbs?: boolean;
  DisplayOptionalInTitle?: boolean;
  Elements?: IElement[] | null;
  Behaviours?: Behaviour[] | null;
  IncomingValues?: IncomingValue[] | null;
  IsValidated?: boolean;
  HideTitle?: boolean;
  HideBackButton?: boolean;
  BannerTitle?: null | string;
  LeadingParagraph?: null | string;
  HasIncomingValues?: boolean;
  HasIncomingGetValues?: boolean;
  HasIncomingPostValues?: boolean;
  PageActions?: IAction[] | null;
  HasPageActions?: boolean;
  HasIncomingAction?: boolean;
  HasPageActionsGetValues?: boolean;
  HasPageActionsPostValues?: boolean;
  HasDynamicLookupElements?: boolean;
  RenderConditions?: Condition[] | null;
  HasRenderConditions?: boolean;
  ValidatableElements?: IElement[] | null;
  ValidatableElementsConditional?: IElement[] | null;
}
export interface IElement {
  Type?: EElementType;
  Properties?: null | BaseProperty;
  Lookup?: null | string;
  IsValid?: boolean;
}

export interface Reusable extends IElement {
  ElementRef: null | string;
}

export class BaseProperty {
  ListItems?: string[] | null;
  SearchPeriod?: number;
  Elements?: IElement[] | null;
  FirstLabel?: null | string;
  MinimumFieldsets?: number;
  MaximumFieldsets?: number;
  AddressManualAddressLine1?: null | string;
  AddressManualAddressLine2?: null | string;
  AddressManualAddressTown?: null | string;
  AddressManualAddressPostcode?: null | string;
  AddressManualHint?: null | string;
  AddressLabel?: null | string;
  PostcodeLabel?: null | string;
  AddressManualLabel?: null | string;
  AddressProvider?: null | string;
  AddressIAG?: null | string;
  StockportPostcode?: boolean;
  ValidatePostcode?: boolean;
  DisplayNoResultsIAG?: boolean;
  Disabled?: boolean;
  AddressManualLinkText?: null | string;
  DisableManualAddress?: boolean;
  NoManualAddressDetailText?: null | string;
  AddressManualLineMaxLength?: number;
  AddressManualPostcodeMaxLength?: number;
  Source?: null | string;
  AltText?: null | string;
  Text?: null | string;
  AppendText?: null | string;
  QuestionId?: null | string;
  Label?: null | string;
  StrongLabel?: boolean;
  Optional?: boolean;
  IsDynamicallyGeneratedElement?: boolean;
  Email?: boolean;
  Postcode?: boolean;
  Numeric?: boolean;
  Options?: Option[] | null;
  MaxLength?: number;
  Value?: null | string;
  Hint?: null | string;
  SelectHint?: null | string;
  CustomValidationMessage?: null | string;
  SelectCustomValidationMessage?: null | string;
  ClassName?: null | string;
  Checked?: boolean;
  SelectLabel?: null | string;
  Max?: null | string;
  Min?: null | string;
  TargetMapping?: null | string;
  UpperLimitValidationMessage?: null | string;
  LegendAsH1?: boolean;
  LabelAsH1?: boolean;
  Purpose?: null | string;
  Spellcheck?: boolean;
  NotAnIntegerValidationMessage?: null | string;
  DecimalValidationMessage?: null | string;
  DecimalPlacesValidationMessage?: null | string;
  IAG?: null | string;
  HideOptionalText?: boolean;
  IsConditionalElement?: boolean;
  OrderOptionsAlphabetically?: boolean;
  SummaryLabel?: null | string;
  Warning?: null | string;
  Autofocus?: boolean;
  SetAutofocus?: boolean;
  BookingProvider?: null | string;
  AppointmentTypes?: AppointmentType[] | null;
  CheckYourBooking?: boolean;
  AppointmentTime?: null | string;
  NextAvailableIAG?: null | string;
  NoAvailableTimeForBookingType?: null | string;
  CustomerAddressId?: null | string;
  AutoConfirm?: boolean;
  LimitNextAvailableByDays?: number;
  LimitNextAvailableFromDate?: null | string;
  ButtonId?: null | string;
  ButtonName?: null | string;
  DisableOnClick?: boolean;
  ExclusiveCheckboxValidationMessage?: null | string;
  SelectExactly?: number;
  RestrictFutureDate?: boolean;
  RestrictPastDate?: boolean;
  RestrictCurrentDate?: boolean;
  OutsideRange?: null | string;
  OutsideRangeType?: null | string;
  WithinRange?: null | string;
  WithinRangeType?: null | string;
  IsFutureDateAfterRelative?: null | string;
  IsFutureDateBeforeRelative?: null | string;
  IsPastDateBeforeRelative?: null | string;
  IsPastDateAfterRelative?: null | string;
  Day?: null | string;
  Month?: null | string;
  Year?: null | string;
  ValidationMessageInvalidDate?: null | string;
  ValidationMessageRestrictFutureDate?: null | string;
  ValidationMessageRestrictPastDate?: null | string;
  ValidationMessageRestrictCurrentDate?: null | string;
  ValidationMessageIsFutureDateAfterRelative?: null | string;
  ValidationMessageIsFutureDateBeforeRelative?: null | string;
  ValidationMessageIsPastDateBeforeRelative?: null | string;
  IsDateBefore?: null | string;
  IsDateBeforeAbsolute?: null | string;
  IsDateBeforeValidationMessage?: null | string;
  IsDateAfter?: null | string;
  IsDateAfterAbsolute?: null | string;
  IsDateAfterValidationMessage?: null | string;
  IsDateEqualityAllowed?: boolean;
  HideLabel?: boolean;
  DocumentType?: EDocumentType;
  DocumentUploadUrl?: null | string;
  OpeningTag?: boolean;
  AllowedFileTypes?: string[] | null;
  MaxFileSize?: number;
  Size?: ESize;
  Url?: null | string;
  OpenInTab?: boolean;
  DisplayRightChevron?: boolean;
  LookupSources?: LookupSource[] | null;
  NoMapContent?: null | string;
  MaxCombinedFileSize?: number;
  PageSubmitButtonLabel?: null | string;
  DisplayReCaptcha?: boolean;
  OptionalIf?: null | Condition;
  OrganisationProvider?: null | string;
  AllowSingleOption?: boolean;
  Regex?: null | string;
  RegexValidationMessage?: null | string;
  RequiredIf?: null | string;
  RequiredIfValidationMessage?: null | string;
  StreetProvider?: null | string;
  StreetIAG?: null | string;
  AllowEditing?: boolean;
  Sections?: Section[] | null;
  HasSummarySectionsDefined?: boolean;
  SummarySectionsAutoGenerated?: boolean;
  DisplayCharacterCount?: boolean;
  Width?: ESize;
  Prefix?: null | string;
  Suffix?: null | string;
  Decimal?: boolean;
  DecimalPlaces?: number;
  Hours?: null | string;
  Minutes?: null | string;
  AmPm?: null | string;
  CustomValidationMessageAmPm?: null | string;
  ValidationMessageInvalidTime?: null | string;
  FileUploadQuestionIds?: string[] | null;
  NoScript?: boolean;
}
export interface Option {
  Text?: null | string;
  Value?: null | string;
  Hint?: null | string;
  HasHint?: boolean;
  ConditionalElementId?: null | string;
  HasConditionalElement?: boolean;
  Checked?: boolean;
  Selected?: boolean;
  Divider?: null | string;
  HasDivider?: boolean;
  Exclusive?: boolean;
}
export interface AppointmentType {
  Environment?: null | string;
  AppointmentId?: string;
  AppointmentIdKey?: null | string;
  OptionalResources?: BookingResource[] | null;
  NeedsAppointmentIdMapping?: boolean;
}
export interface BookingResource {
  ResourceId: string;
  Quantity: number;
}
export interface LookupSource {
  EnvironmentName?: null | string;
  Provider?: null | string;
  URL?: null | string;
  AuthToken?: null | string;
}
export interface Condition {
  conditions?: Condition[] | null;
  conditionType?: ECondition;
  isNullOrEmpty?: boolean | null;
  equalTo?: null | string;
  checkboxContains?: null | string;
  questionId?: null | string;
  IsBefore?: number | null;
  IsAfter?: number | null;
  comparisonValue?: null | string;
  comparisonDate?: null | string;
  Unit?: EDateUnit;
}
export interface Section {
  Title?: null | string;
  Pages?: string[] | null;
}
export interface Behaviour {
  conditions?: Condition[] | null;
  BehaviourType?: EBehaviourType;
  PageSlug?: null | string;
  SubmitSlugs?: SubmitSlug[] | null;
}
export interface SubmitSlug {
  Environment?: null | string;
  URL?: null | string;
  Type?: null | string;
  AuthToken?: null | string;
  CallbackUrl?: null | string;
  RedirectUrl?: null | string;
}
export interface IncomingValue {
  QuestionId?: null | string;
  Name?: null | string;
  Optional?: boolean;
  HttpActionType?: EHttpActionType;
  Base64Encoded?: boolean;
}
export interface IAction {
  Type?: EActionType;
  Properties?: null | BaseActionProperty;
}
export interface BaseActionProperty {
  HttpActionType?: EHttpActionType;
  To?: null | string;
  From?: null | string;
  Content?: null | string;
  Subject?: null | string;
  TargetQuestionId?: null | string;
  IncludeInFormSubmission?: boolean;
  PageActionSlugs?: PageActionSlug[] | null;
  TemplateId?: null | string;
  EmailTemplateProvider?: null | string;
  Personalisation?: string[] | null;
  IncludeCaseReference?: boolean;
}
export interface PageActionSlug {
  Environment?: null | string;
  URL?: null | string;
  AuthToken?: null | string;
}
export interface EnvironmentAvailability {
  Environment?: null | string;
  IsAvailable?: boolean;
  EnabledFor?: EnabledForBase[] | null;
}
export interface EnabledForBase {
  Type?: EEnabledFor;
  Properties?: null | EnabledForProperties;
}
export interface EnabledForProperties {
  Start?: string;
  End?: string;
}
