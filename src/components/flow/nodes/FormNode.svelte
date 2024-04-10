<script lang="ts">
  import { Handle, Position, type NodeProps, useSvelteFlow } from "@xyflow/svelte";
  import type { Page } from "../../../models/FormSchema";
  import { P, Heading, Card, Button } from "flowbite-svelte";
  import PageElement from "../pageElements/PageElement.svelte";
  import type { PageValidation } from "../../../utils/FormParser";
  import { form, formFlowValidation, nodes, orientation, formNotes } from "../../../stores/appStore";
  import PageBanner from "../pageElements/PageBanner.svelte";
  import PageNotes from "../../notes/PageNotes.svelte";
  import PageNoteForm from "../../notes/PageNoteForm.svelte";
  import type { Note } from "../../../models/Notes";
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
  let pageIndex: number | undefined;
  let validation: PageValidation = data.formValidation;
  let pageButton = page.Elements?.find((element) => element.Type == "Button");
  let cardClass = `p-5 border-solid bg-white ${validation.isPageUnreachable ? "border-orange-400 bg-red-300" : ""} border-2`;
  let pageNotes: Note[] = [];

  formFlowValidation.subscribe((validation) => {
    if (!validation) return;
    if (!page) return;

    var pageValidation: PageValidation = {
      isPageUnreachable: validation ? validation?.unreachablePages.some((invalidPage) => invalidPage.PageSlug == page.PageSlug) : false,
    };

    cardClass = `p-5 border-solid bg-white ${pageValidation.isPageUnreachable ? "border-orange-400 bg-red-300" : ""} border-2`;
  });

  form.subscribe((form) => {
    page = form!.Pages?.find((page) => page.PageSlug == data.pageId)!;
    pageIndex = form!.Pages?.findIndex((page) => page.PageSlug == data.pageId)!;
    if (!page) return;

    if (pageIndex == 0) {
      console.log("page index 0");
    }

    pageButton = page.Elements?.find((element) => element.Type == "Button");
  });

  formNotes.subscribe((notes) => {
    if (pageIndex == undefined) return;

    pageNotes = notes?.filter((note) => note.formPageIndex == pageIndex) || [];
  });

  const { fitView } = useSvelteFlow();

  const onDoubleClick = () => {
    // fitView({ nodes: $nodes.filter((node) => node.id == page.PageSlug) });
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="node-container" on:dblclick={onDoubleClick}>
  <div>
    <P class="bg-gray-200 rounded-t-lg w-5/6 -mb-2 p-1 pb-3 px-4 border-solid border-grey border-2 text-sm text-gray-500 font-semibold">{page.Title}</P>
    <Card class={cardClass}>
      <Handle type="target" position={$orientation == "TB" ? Position.Top : Position.Left} />
      <Handle type="source" position={$orientation == "TB" ? Position.Bottom : Position.Right} />
      <div>
        {#if !page.HideBackButton}
          <P class="mb-1 underline font-semibold decoration-2 text-green-500">{`Back`}</P>
        {/if}

        {#if !page.HideTitle}
          <Heading tag="h2" customSize="text-2xl font-bold">
            {page.Title}
            {#if page.DisplayOptionalInTitle}
              <span class="text-gray-500 italic">(Optional)</span>
            {/if}
          </Heading>
        {/if}

        <P class="mb-3 text-gray-500">{page.PageSlug}</P>
        <PageBanner {page} />

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
    </Card>
  </div>
  <div class="flex justify-center"><PageNoteForm formPageIndex={pageIndex} /></div>

  <PageNotes notes={pageNotes} />
</div>

<style>
  .node-container {
    width: 300px;
  }
</style>
