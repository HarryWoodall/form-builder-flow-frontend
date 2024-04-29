import type { Behaviour, FormSchema, Page } from "../models/FormSchema";
import type { PageTitleValidationResult, SpellCheckPageElement, SpellCheckPageRequest } from "../models/Validation";
import { pageTitleValidation, spellingValidation, backButtonValidation } from "../stores/appStore";

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

export async function ValidatePageSpelling(page: Page, index: number) {
  const data: SpellCheckPageRequest = {};

  if (page.Title != undefined) data.Title = page.Title;
  if (page.BannerTitle != undefined) data.BannerTitle = page.BannerTitle;
  if (page.LeadingParagraph != undefined) data.LeadingParagraph = page.LeadingParagraph;

  if (page.Elements != undefined && page.Elements.length > 0) {
    data.Elements = [];

    for (let element of page.Elements) {
      if (element.Type == "Button") break;
      let elementData: SpellCheckPageElement = {};

      if (element.Properties?.QuestionId != undefined) elementData.QuestionId = element.Properties?.QuestionId;
      if (element.Properties?.Label != undefined) elementData.Label = element.Properties?.Label;
      if (element.Properties?.Text != undefined) elementData.Text = element.Properties?.Text;
      if (element.Properties?.Hint != undefined) elementData.Hint = element.Properties?.Hint;
      if (element.Properties?.IAG != undefined) elementData.IAG = element.Properties?.IAG;
      if (element.Properties?.CustomValidationMessage != undefined) elementData.CustomValidationMessage = element.Properties?.CustomValidationMessage;
      if (element.Properties?.SummaryLabel != undefined) elementData.SummaryLabel = element.Properties?.SummaryLabel;

      if (element.Properties?.Options != undefined && element.Properties.Options.length > 0) {
        elementData.Options = [];

        for (let option of element.Properties?.Options) {
          let optionData: { Text?: string } = {};
          if (option.Text != undefined) optionData.Text = option.Text;
          elementData.Options.push(optionData);
        }
      }

      data.Elements.push(elementData);
    }
  }

  try {
    const rawResponse = await fetch("http://localhost:3100/spellcheckPage", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (rawResponse.ok) {
      const result = await rawResponse.json();

      if (result.length > 0) {
        spellingValidation.update((data) => {
          return [...data, { page: page.Title!, pageIndex: index, result: result }].sort((a, b) => a.pageIndex - b.pageIndex);
        });
      }
    }
  } catch (e) {
    console.log(e);
  }

  return data;
}

export function ValidatePageTitle(page: Page, pageIndex: number) {
  if (page.Elements!.filter((e) => e.Type !== "Button").length > 1) {
    pageTitleValidation.update((data) => {
      return [
        ...data,
        {
          isValid: true,
          pageIndex: pageIndex,
        },
      ];
    });
    return;
  }

  const element = page.Elements!.filter((e) => e.Type !== "Button")[0];
  if (element == undefined) return;

  if (!element.Properties?.Label) {
    pageTitleValidation.update((data) => {
      return [
        ...data,
        {
          isValid: true,
          pageIndex: pageIndex,
        },
      ];
    });
    return;
  }

  if (element.Properties?.Label.trim() != page.Title?.trim() && (element.Properties?.LabelAsH1 || element.Properties?.LegendAsH1)) {
    pageTitleValidation.update((data) => {
      return [
        ...data,
        {
          isValid: false,
          pageIndex: pageIndex,
          missmatchData: {
            elementLabel: element.Properties?.Label!,
            pageTitle: page.Title!,
          },
        },
      ];
    });
    return;
  }

  pageTitleValidation.update((data) => {
    return [
      ...data,
      {
        isValid: true,
        pageIndex: pageIndex,
      },
    ];
  });
}

export function validateBackButtons(form: FormSchema) {
  if (form.Pages == undefined) return;

  form.Pages.forEach((page, index) => {
    if (index == 0 || page.PageSlug?.toLowerCase() == "success" || page.Behaviours == undefined || page.Behaviours.length == 0) {
      if (!page.HideBackButton) {
        backButtonValidation.update((data) => {
          return [
            ...data,
            {
              pageIndex: index,
              isValid: false,
              errorType: "Added",
            },
          ];
        });
      } else {
        backButtonValidation.update((data) => {
          return [
            ...data,
            {
              pageIndex: index,
              isValid: true,
            },
          ];
        });
      }

      return;
    } else if (page.HideBackButton) {
      backButtonValidation.update((data) => {
        return [
          ...data,
          {
            pageIndex: index,
            isValid: false,
            errorType: "Missing",
          },
        ];
      });
      return;
    }

    backButtonValidation.update((data) => {
      return [
        ...data,
        {
          pageIndex: index,
          isValid: true,
        },
      ];
    });
  });
}
