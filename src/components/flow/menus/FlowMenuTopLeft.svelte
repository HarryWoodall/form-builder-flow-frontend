<script lang="ts">
  import { Button } from "flowbite-svelte";
  import getLayoutedElements from "../../../utils/FormDisplay";
  import { edges as edgeStore, nodes as nodeStore, form, formFlowValidation, currentModalOpen, orientation } from "../../../stores/appStore";
  import { validateFlow, validateIds } from "../../../utils/FormValidator";
  import { useEdges, useNodes } from "@xyflow/svelte";
  import FormSummaryItems from "../../modals/FormSummaryItems.svelte";
  import TransformsAlert from "../alerts/TransformsAlert.svelte";
  import { EFormInputModal } from "../../../constants/modalConstants";
  import { slide } from "svelte/transition";

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

  const openModal = (name: string) => {
    console.log("opening", name);
    currentModalOpen.update(() => name);
  };
</script>

<div class="m-2">
  <Button
    on:click={() => openModal(EFormInputModal)}
    class="font-bold bg-transparent hover:bg-transparent border-2 border-transparent hover:border-orange-400  text-orange-400">Upload Json</Button
  >
  {#if $form != undefined}
    <Button
      on:click={() => onLayout($orientation || "LR")}
      class="font-bold bg-transparent hover:bg-transparent border-2 border-transparent hover:border-orange-400  text-orange-400">Format</Button
    >
    <FormSummaryItems />
  {/if}
  <TransformsAlert />
</div>
