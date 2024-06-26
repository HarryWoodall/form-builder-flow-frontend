import { writable } from "svelte/store";
import type { FormSchema, IElement, Page } from "../models/FormSchema";
import type { Edge, Node } from "@xyflow/svelte";
import type { InvalidFlow } from "../validators/FormValidators";
import type { Note } from "../models/Notes";
import type { BackButtonValidationResult, PageTitleValidationResult } from "../models/Validation";

export const propertyArrayModalOpen = writable<boolean>(false);
export const summaryArrayModalOpen = writable<boolean>(false);
export const currentPropertyArrayItems = writable<unknown[]>([]);
export const currentPropertyKey = writable<string>("");
export const propertyType = writable<"Page" | "Element" | undefined>();
export const currentPropertyItem = writable<IElement | Page | undefined>();
export const newForm = writable<boolean>();

export const currentModalOpen = writable<string | null>();
export const detailsPanelVisible = writable<boolean>(false);

export const nodes = writable<Node[]>([]);
export const edges = writable<Edge[]>([]);
export const form = writable<FormSchema | undefined>();
export const formFlowValidation = writable<InvalidFlow | undefined>();
export const formNotes = writable<Note[] | undefined>();
export const activeNote = writable<string | undefined>();

export const orientation = writable<"LR" | "TB">();

export const areTransformsAvailable = writable<boolean>(false);

export const pageTitleValidation = writable<PageTitleValidationResult[]>([]);
export const backButtonValidation = writable<BackButtonValidationResult[]>([]);

export const notesFeature = writable<boolean>(true);
