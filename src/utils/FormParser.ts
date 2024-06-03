import type { Edge, Node } from "@xyflow/svelte";
import type { BaseProperty, Behaviour, Condition, FormSchema, IElement, Option, Reusable } from "../models/FormSchema";
import {
  nodes as nodeStore,
  edges as edgeStore,
  formFlowValidation,
  areTransformsAvailable,
  formNotes,
  pageTitleValidation,
  backButtonValidation,
} from "../stores/appStore";
import { validateBackButtons, validateFlow } from "../validators/FormValidators";
import { capitalizeFirstLetter, splitByCapital } from "../helpers/stringHelpers";
import { baseServerUrl } from "../constants/serverConstants";
import { getNodeId, getPageFromSlug, getPageIndex } from "../helpers/formHelpers";

export type PageValidation = {
  isPageUnreachable: boolean;
};

export type SummaryItem = {
  label?: string;
  value?: string;
  questionId?: string;
  isOptional: boolean;
  isConditionalElement: boolean;
  isAddAnotherElement: boolean;
  index: number; //TODO: remove this and references
};

export function parseForm(form: string) {
  try {
    const json = JSON.parse(form) as FormSchema;
    return json;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function generateFlowFromSchema(form: FormSchema) {
  if (!form) return;
  const pageAmmount = form.Pages!.length;

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const flowValidation = validateFlow(form);
  formFlowValidation.update(() => flowValidation);

  for (let i = 0; i < pageAmmount; i++) {
    if (!(form.Pages && form.Pages[i])) return;

    const currentPage = form.Pages[i];
    const pageId = currentPage.PageSlug as string;

    const formValidation: PageValidation = {
      isPageUnreachable: flowValidation ? flowValidation?.unreachablePages.includes(form.Pages[i]) : false,
    };

    const newNode: Node = {
      id: getNodeId(form, form.Pages[i]),
      type: "form",
      position: {
        x: 0,
        y: 0,
      },
      data: { pageId, formValidation },
    };

    // console.log(newNode);

    const connections: Edge[] = [];

    currentPage.Behaviours?.forEach((behaviour, index) => {
      let behaviourPageSlug = behaviour[Object.keys(behaviour).find((key) => key.toLowerCase() === "pageslug") as keyof Behaviour];

      if (!behaviourPageSlug) {
        const beahaviourType = behaviour[Object.keys(behaviour).find((key) => key.toLowerCase() === "behaviourtype") as keyof Behaviour];
        if (beahaviourType?.includes("Submit")) behaviourPageSlug = "success";
        else return;
      }

      let newEdge: Edge | undefined;

      const targetPages = form.Pages?.filter((page) => page.PageSlug?.toLowerCase() == (behaviourPageSlug as string).toLowerCase())!;

      targetPages.forEach((page, targetIndex) => {
        let labelStyle =
          "z-index: 9999; border: 1px solid orange; max-width: 100px; font-weight: bold; background-color: white; border-radius: 10px; padding: 5px";
        let style = "stroke: orange; stroke-width: 2";

        if (page.RenderConditions && page.RenderConditions.length > 0) {
          labelStyle =
            "z-index: 9999; border: 1px solid green; max-width: 100px; font-weight: bold; background-color: white; border-radius: 10px; padding: 5px";
          style = "stroke: green; stroke-width: 2";
        }

        if (targetIndex > 0) {
          console.log(targetPages);
          console.log("PageIndex: ", getPageIndex(form, currentPage));
        }

        newEdge = {
          id: `${currentPage!.PageSlug!.toLowerCase()}-${(behaviourPageSlug as string).toLowerCase()}-${getPageIndex(
            form,
            currentPage
          )}-${index}-${targetIndex}`,
          source: getNodeId(form, currentPage),
          sourceHandle: "start",
          target: getNodeId(form, page) || "unknown",
          targetHandle: "end",
          style: style,
          labelStyle: labelStyle,
          type: "smoothstep",
        };

        if (behaviour.conditions && behaviour.conditions?.length > 0) {
          let conditionText = "";

          behaviour.conditions.forEach((condition) => {
            const conditionKey = Object.keys(condition).find((key) => key.toLowerCase() === "questionid") as keyof Condition;
            const conditionQuestionId = condition[conditionKey];
            conditionText += `${conditionQuestionId}: ${condition.comparisonValue}`;
          });
          newEdge.label = conditionText;
        }

        if (page.RenderConditions && page.RenderConditions.length > 0) {
          let conditionText = "";

          page.RenderConditions.forEach((condition) => {
            const conditionKey = Object.keys(condition).find((key) => key.toLowerCase() === "questionid") as keyof Condition;
            const conditionQuestionId = condition[conditionKey];
            conditionText += `${conditionQuestionId}: ${condition.comparisonValue}`;
          });
          newEdge.label = conditionText;
        }

        connections.push(newEdge);
      });
    });

    edges.push(...connections);
    nodes.push(newNode);
  }
  nodeStore.update(() => nodes);
  edgeStore.update(() => edges);

  getFormNotes(form.BaseURL!);
  pageTitleValidation.update(() => []);
  backButtonValidation.update(() => []);

  validateBackButtons(form);
}

async function getFormNotes(formName: string) {
  let transformsAvailable = false;
  console.log(formName);
  areTransformsAvailable.subscribe((value) => {
    transformsAvailable = value;
  });

  if (!transformsAvailable) return;

  const res = await fetch(`http://localhost:3100/getFormNotes?formName=${formName}`);
  const notes = await res.json();

  console.log("notes: ", notes);

  formNotes.update(() => notes);
}

export async function getSummaryData(form: FormSchema) {
  const pages = form.Pages;
  const summaryItems: SummaryItem[] = [];
  let transformsAvailable = false;
  areTransformsAvailable.subscribe((value) => {
    transformsAvailable = value;
  });

  for (let [pageIndex, page] of pages!.entries()) {
    for (let [elementIndex, element] of page.Elements!.entries()) {
      if (!element.Properties?.QuestionId) break;
      if (element.Type == "Summary") break;

      let label = element.Properties.SummaryLabel || element.Properties.Label;

      switch (element.Type) {
        case "Address":
          label = page.Title;
          break;
        case "Reusable":
          if (transformsAvailable) {
            const resuableElement = await getReusableElement(element);
            label = resuableElement.Properties?.Label;
          } else {
            label = label || capitalizeFirstLetter(splitByCapital((element as Reusable).ElementRef!));
          }

          break;
        case "AddAnother":
          summaryItems.push(...(await getSummaryDataAddAnother(element, transformsAvailable, pageIndex, elementIndex)));
          break;
        default:
          label = label || element.Type!;
      }

      summaryItems.push({
        label: label?.toString(),
        value: "string",
        questionId: element.Properties.QuestionId,
        isOptional: element.Properties.Optional || false,
        isConditionalElement: element.Properties.IsConditionalElement || false,
        isAddAnotherElement: false,
        index: parseInt(`${pageIndex}${elementIndex}`),
      });
    }
  }

  return summaryItems;
}

async function getSummaryDataAddAnother(element: IElement, transformsAvailable: boolean, pageIndex: number, elementIndex: number): Promise<SummaryItem[]> {
  let summaryItems: SummaryItem[] = [];
  for (let [index, innerElement] of element.Properties!.Elements!.entries()) {
    if (!innerElement.Properties?.QuestionId) break;

    let label = innerElement.Properties.SummaryLabel || innerElement.Properties.Label;

    switch (innerElement.Type) {
      case "Reusable":
        if (transformsAvailable) {
          const resuableElement = await getReusableElement(innerElement);
          label = resuableElement.Properties?.Label;
        } else {
          label = label || capitalizeFirstLetter(splitByCapital((innerElement as Reusable).ElementRef!));
        }
        break;
      default:
        label = label || innerElement.Type!;
    }

    summaryItems.push({
      label: label?.toString(),
      value: "string",
      questionId: innerElement.Properties.QuestionId,
      isOptional: innerElement.Properties.Optional || false,
      isConditionalElement: innerElement.Properties.IsConditionalElement || false,
      isAddAnotherElement: true,
      index: parseInt(`${pageIndex}${elementIndex}`),
    });
  }

  return summaryItems;
}

export async function getReusableElement(element: IElement) {
  const elementRef = (element as Reusable).ElementRef;
  const data = await fetch(`http://${baseServerUrl}/reusableElement?element=${elementRef}`);
  const reusableElement = (await data.json()) as IElement;
  reusableElement.Properties = { ...reusableElement.Properties, ...element.Properties };

  return reusableElement;
}

export async function transformLookup(element: IElement) {
  const lookup = element.Lookup;
  const data = await fetch(`http://${baseServerUrl}/lookup?lookup=${lookup}`);
  const options = (await data.json()) as Option[];
  element.Properties!.Options = options;

  return element;
}
