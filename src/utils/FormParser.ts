import type { Edge, Node } from "@xyflow/svelte";
import type { Behaviour, Condition, FormSchema } from "../models/FormSchema";
import { nodes as nodeStore, edges as edgeStore, formFlowValidation } from "../stores/appStore";
import { validateFlow } from "./FormValidator";

export type PageValidation = {
  isPageUnreachable: boolean;
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
      if (!behaviour.PageSlug) {
        const beahaviourType = behaviour[Object.keys(behaviour).find((key) => key.toLowerCase() === "behaviourtype") as keyof Behaviour];
        if (beahaviourType?.includes("Submit")) behaviour.PageSlug = "success";
        else return;
      }

      const newEdge: Edge = {
        id: `${currentPage.PageSlug}-${behaviour.PageSlug}-${index}`,
        source: currentPage.PageSlug as string,
        sourceHandle: "start",
        target: (behaviour.PageSlug as string) || "unknown",
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

  nodeStore.update(() => nodes);
  edgeStore.update(() => edges);
}
