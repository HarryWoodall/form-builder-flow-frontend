<script lang="ts">
  import { Button } from "flowbite-svelte";
  import FormInputModal from "../modals/FormInputModal.svelte";
  import getLayoutedElements from "../../utils/FormDisplay";
  import { edges as edgeStore, nodes as nodeStore, form, formFlowValidation } from "../../stores/appStore";
  import { validateFlow, validateIds } from "../../utils/FormValidator";
  import { useEdges, useNodes } from "@xyflow/svelte";
  import FormSummaryItems from "../modals/FormSummaryItems.svelte";
  import TransformsAlert from "./alerts/TransformsAlert.svelte";

  const nodes = useNodes();
  const edges = useEdges();

  const onLayout = (direction: string) => {
    const layoutedElements = getLayoutedElements($nodes, $edges, direction, $formFlowValidation);

    nodeStore.update(() => $nodes);
    edgeStore.update(() => $edges);

    $nodes = layoutedElements.nodes;
    $edges = layoutedElements.edges;
    nodes.update(() => layoutedElements.nodes);
    edges.update(() => layoutedElements.edges);
  };

  const validateForm = () => {
    if (!$form) return;

    const idValidationResult = validateIds($form);
    const flowValidationResult = validateFlow($form);

    console.log(idValidationResult);
    console.log(flowValidationResult);
  };
</script>

<div>
  <FormInputModal />
  {#if $form != undefined}
    <Button on:click={() => onLayout("LR")} class="font-bold">Format</Button>
    <Button on:click={() => validateForm()} class="font-bold">Validate</Button>
    <FormSummaryItems />
  {/if}
  <TransformsAlert />
</div>
