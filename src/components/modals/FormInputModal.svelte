<script lang="ts">
  import { Button, Modal, Textarea } from "flowbite-svelte";
  import { currentModalOpen, form } from "../../stores/appStore";
  import { parseForm, generateFlowFromSchema } from "../../utils/FormParser";
  import exampleForm from "../../models/examples/exampleForm.json";
  import getLayoutedElements from "../../utils/FormDisplay";
  import { useEdges, useNodes } from "@xyflow/svelte";
  import { edges as edgeStore, nodes as nodeStore, formFlowValidation, orientation } from "../../stores/appStore";
  import { EFormInputModal } from "../../constants/modalConstants";

  const nodes = useNodes();
  const edges = useEdges();

  let isOpen = false;
  let inputValue = "";

  currentModalOpen.subscribe((value: null | string) => {
    isOpen = value == EFormInputModal;
  });

  const getForm = () => {
    const schema = parseForm(inputValue);

    if (!schema) return;

    form.update(() => schema);

    generateFlowFromSchema(schema);

    const layoutedElements = getLayoutedElements($nodes, $edges, $orientation || "LR", $formFlowValidation);

    nodeStore.update(() => $nodes);
    edgeStore.update(() => $edges);

    $nodes = layoutedElements.nodes;
    $edges = layoutedElements.edges;
    nodes.update(() => layoutedElements.nodes);
    edges.update(() => layoutedElements.edges);

    isOpen = false;
    updateCurrentModal();
  };

  const updateCurrentModal = () => {
    currentModalOpen.update(() => null);
  };

  const dummyData = () => {
    inputValue = JSON.stringify(exampleForm, null, 2);
  };
</script>

<Modal title="Upload Json" bind:open={isOpen} on:close={() => updateCurrentModal()} outsideclose autoclose>
  <Textarea rows="20" bind:value={inputValue} />
  <svelte:fragment slot="footer">
    <Button on:click={getForm}>Create Form</Button>
    <Button on:click={dummyData} color="alternative">Dummy Data</Button>
  </svelte:fragment>
</Modal>
