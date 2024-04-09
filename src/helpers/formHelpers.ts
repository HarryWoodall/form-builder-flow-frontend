import type { FormSchema, Page } from "../models/FormSchema";

export function getNodeId(form: FormSchema, page: Page) {
  return page.PageSlug + "-" + form.Pages!.indexOf(page);
}

export function getPageFromSlug(form: FormSchema, pageSlug: string) {
  return form.Pages?.find((page) => page.PageSlug == pageSlug);
}

export function getPageIndex(form: FormSchema, page: Page) {
  return form.Pages?.indexOf(page);
}
