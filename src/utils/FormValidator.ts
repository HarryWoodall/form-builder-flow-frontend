import type { Behaviour, FormSchema, Page } from "../models/FormSchema";

export type InvalidQuestionId = {
  id: string | undefined;
  type: "Missing" | "Duplicate";
  pageSlug: string;
};

export type InvalidFlow = {
  unreachablePages: Page[];
  invalidPageSlugs: string[];
};

export function validateIds(form: FormSchema) {
  const questionIds: string[] = [];
  const invalidIds: InvalidQuestionId[] = [];

  form.Pages?.forEach((page) => {
    if (!page.PageSlug) return;
    page.Elements?.forEach((element) => {
      const currentId = element.Properties?.QuestionId;

      if (currentId == null || currentId == undefined) return;

      if (currentId == "") {
        invalidIds.push({
          id: undefined,
          type: "Missing",
          pageSlug: page.PageSlug as string,
        });
      } else if (questionIds.includes(currentId)) {
        invalidIds.push({
          id: currentId,
          type: "Duplicate",
          pageSlug: page.PageSlug as string,
        });
      }
    });
  });

  return invalidIds;
}

export function validateFlow(form: FormSchema) {
  const result: InvalidFlow = {
    unreachablePages: [],
    invalidPageSlugs: [],
  };

  const reachableSlugMap: string[] = [];
  const startPage = form.Pages?.find((page) => page.PageSlug == form.FirstPageSlug)!;

  if (!startPage) {
    result.unreachablePages = form.Pages!;
    return result;
  }

  reachableSlugMap.push(form.FirstPageSlug!);

  addToReachableMap(form.Pages!, startPage, reachableSlugMap, result.invalidPageSlugs);
  result.unreachablePages = form.Pages!.filter((page) => !reachableSlugMap.includes(page.PageSlug!));

  return result;
}

function addToReachableMap(pages: Page[], page: Page, map: string[], invalidPages: string[]) {
  const pageBehaviour = page.Behaviours;
  if (!pageBehaviour) return;

  pageBehaviour.forEach((behaviour) => {
    const pageSlug = behaviour[Object.keys(behaviour).find((key) => key.toLowerCase() === "pageslug") as keyof Behaviour] as string;
    const behaviourType = behaviour[Object.keys(behaviour).find((key) => key.toLowerCase() === "behaviourtype") as keyof Behaviour] as string;

    if (behaviourType.toLowerCase().includes("submit")) map.push("success");

    if (!pageSlug) return;

    if (pages.map((page) => page.PageSlug).includes(pageSlug)) {
      map.push(pageSlug);
      addToReachableMap(pages, pages.find((page) => page.PageSlug == pageSlug)!, map, invalidPages);
    } else {
      invalidPages.push(pageSlug);
    }
  });
}
