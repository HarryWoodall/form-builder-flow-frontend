import type { Edge, Node } from "@xyflow/svelte";
import type { BaseProperty, Behaviour, Condition, FormSchema, IElement, Option, Reusable } from "../models/FormSchema";
import { nodes as nodeStore, edges as edgeStore, formFlowValidation } from "../stores/appStore";
import { validateFlow } from "./FormValidator";
import { capitalizeFirstLetter, splitByCapital } from "../helpers/stringHelpers";
import { baseServerUrl } from "../constants/serverConstants";

export type PageValidation = {
  isPageUnreachable: boolean;
};

export type SummaryItem = {
  label?: string;
  value?: string;
  isOptional: boolean;
  isConditionalElement: boolean;
  isAddAnotherElement: boolean;
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
      id: pageId,
      type: "form",
      position: {
        x: 0,
        y: 0,
      },
      data: { pageId, formValidation },
    };

    const connections: Edge[] = [];

    currentPage.Behaviours?.forEach((behaviour, index) => {
      let behaviourPageSlug = behaviour[Object.keys(behaviour).find((key) => key.toLowerCase() === "pageslug") as keyof Behaviour];

      if (!behaviourPageSlug) {
        const beahaviourType = behaviour[Object.keys(behaviour).find((key) => key.toLowerCase() === "behaviourtype") as keyof Behaviour];
        if (beahaviourType?.includes("Submit")) behaviourPageSlug = "success";
        else return;
      }

      const newEdge: Edge = {
        id: `${currentPage.PageSlug}-${behaviourPageSlug}-${index}`,
        source: currentPage.PageSlug as string,
        sourceHandle: "start",
        target: (behaviourPageSlug as string) || "unknown",
        targetHandle: "end",
        style: "stroke: orange; stroke-width: 2",
        labelStyle: "z-index: 9999; border: 1px solid orange; max-width: 100px; font-weight: bold; background-color: white; border-radius: 10px; padding:",
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

      connections.push(newEdge);
    });

    edges.push(...connections);
    nodes.push(newNode);
  }

  console.log(edges);

  nodeStore.update(() => nodes);
  edgeStore.update(() => edges);
}

export function getSummaryData(form: FormSchema) {
  const pages = form.Pages;
  const summaryItems: SummaryItem[] = [];

  pages?.forEach((page) => {
    page.Elements?.forEach((element) => {
      if (!element.Properties?.QuestionId) return;

      let label = element.Properties.SummaryLabel || element.Properties.Label;

      switch (element.Type) {
        case "Address":
          label = page.Title;
          break;
        case "Reusable":
          label = label || capitalizeFirstLetter(splitByCapital((element as Reusable).ElementRef!));
          break;
        case "AddAnother":
          summaryItems.push(...getSummaryDataAddAnother(element));
          return;
        default:
          label = label || element.Type!;
      }

      summaryItems.push({
        label: label?.toString(),
        value: "string",
        isOptional: element.Properties.Optional || false,
        isConditionalElement: element.Properties.IsConditionalElement || false,
        isAddAnotherElement: false,
      });
    });
  });

  return summaryItems;
}

function getSummaryDataAddAnother(element: IElement) {
  let summaryItems: SummaryItem[] = [];
  element.Properties?.Elements?.forEach((element) => {
    if (!element.Properties?.QuestionId) return;

    let label = element.Properties.SummaryLabel || element.Properties.Label;

    switch (element.Type) {
      case "Reusable":
        label = label || capitalizeFirstLetter(splitByCapital((element as Reusable).ElementRef!));
        break;
      default:
        label = label || element.Type!;
    }

    summaryItems.push({
      label: label?.toString(),
      value: "string",
      isOptional: element.Properties.Optional || false,
      isConditionalElement: element.Properties.IsConditionalElement || false,
      isAddAnotherElement: true,
    });
  });

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
