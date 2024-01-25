<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { formInputModalOpen } from "../../stores/appStore";
  import getLayoutedElements from "../../utils/FormDisplay";
  import { edges as edgeStore, nodes as nodeStore, form } from "../../stores/appStore";
  import { validateFlow, validateIds } from "../../utils/FormValidator";
  import { useEdges, useNodes } from "@xyflow/svelte";

  const nodes = useNodes();
  const edges = useEdges();

  const uploadJson = () => {
    formInputModalOpen.update(() => true);
  };

  const onLayout = (direction: string) => {
    const layoutedElements = getLayoutedElements($nodes, $edges, direction);

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
  <Button on:click={uploadJson}>Upload Json</Button>
  <Button on:click={() => onLayout("LR")}>Format</Button>
  <Button on:click={() => validateForm()}>Validate</Button>
  <Button>Summary Items</Button>
</div>
