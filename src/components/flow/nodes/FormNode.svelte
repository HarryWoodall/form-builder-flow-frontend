<script lang="ts">
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  import type { IElement, Page } from "../../../models/FormSchema";
  import { P, Heading, Checkbox, Card, Button } from "flowbite-svelte";
  import PageElement from "../pageElements/PageElement.svelte";
  import type { PageValidation } from "../../../utils/FormParser";
  import { form, formFlowValidation } from "../../../stores/appStore";

  type $$Props = NodeProps;
  export let id: $$Props["id"];
  id;
  export let data: $$Props["data"];
  data;
  export let dragHandle: $$Props["dragHandle"] = undefined;
  dragHandle;
  export let type: $$Props["type"] = undefined;
  type;
  export let selected: $$Props["selected"] = undefined;
  selected;
  export let isConnectable: $$Props["isConnectable"] = undefined;
  isConnectable;
  export let zIndex: $$Props["zIndex"] = undefined;
  zIndex;
  export let width: $$Props["width"] = undefined;
  width;
  export let height: $$Props["height"] = undefined;
  height;
  export let dragging: $$Props["dragging"];
  dragging;
  export let targetPosition: $$Props["targetPosition"] = undefined;
  targetPosition;
  export let sourcePosition: $$Props["sourcePosition"] = undefined;
  sourcePosition;
  export let positionAbsoluteY: $$Props["positionAbsoluteY"];
  positionAbsoluteY;
  export let positionAbsoluteX: $$Props["positionAbsoluteX"];
  positionAbsoluteX;

  let page: Page = $form!.Pages?.find((page) => page.PageSlug == data.pageId)!;
  let validation: PageValidation = data.formValidation;
  const pageButton = page.Elements?.find((element) => element.Type == "Button");
  let cardClass = `p-5 border-solid bg-white ${validation.isPageUnreachable ? "border-orange-400 bg-red-300" : ""} border-2`;

  let refreshCount = 0;

  formFlowValidation.subscribe((validation) => {
    if (!validation) return;

    console.log(validation);
    var pageValidation: PageValidation = {
      isPageUnreachable: validation ? validation?.unreachablePages.some((invalidPage) => invalidPage.PageSlug == page.PageSlug) : false,
    };

    console.log(pageValidation);

    cardClass = `p-5 border-solid bg-white ${pageValidation.isPageUnreachable ? "border-orange-400 bg-red-300" : ""} border-2`;
  });

  form.subscribe((form) => {
    page = form!.Pages?.find((page) => page.PageSlug == data.pageId)!;

    if (!page) return;

    if (page.PageSlug == "task-organiser-name") {
      console.log(page.Title);
    }
    refreshCount++;
  });
</script>

<div class="node-container">
  <Card class={cardClass}>
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
    {#key refreshCount}
      <!-- is this still neede anymore? -->
      <div>
        {#if !page.HideBackButton}
          <P class="mb-1 underline font-semibold decoration-2 text-green-500">{`Back`}</P>
        {/if}

        {#if !page.HideTitle}
          <Heading tag="h2" customSize="text-2xl font-bold">{page.Title}</Heading>
        {/if}

        <P class="mb-3 text-gray-500">{page.PageSlug}</P>
        <ul class="mb-6">
          {#if page.Elements}
            {#each page.Elements as element, index}
              {#if element.Type != "Button"}
                <PageElement {element} {index} pageName={page.PageSlug} />
              {/if}
            {/each}
          {/if}
        </ul>

        {#if pageButton}
          <Button color="green" class="rounded-none">{pageButton.Properties?.Text || "Continue"}</Button>
        {/if}
      </div>
    {/key}
  </Card>
</div>

<style>
  .node-container {
    width: 300px;
  }
</style>
