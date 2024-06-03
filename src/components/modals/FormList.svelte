<script lang="ts">
  import { Button, Modal, Search, Spinner, List, Li, P } from "flowbite-svelte";
  import { useEdges, useNodes } from "@xyflow/svelte";
  import { edges as edgeStore, nodes as nodeStore, formFlowValidation, form, currentModalOpen, orientation } from "../../stores/appStore";
  import { onMount } from "svelte";
  import { baseServerUrl } from "../../constants/serverConstants";
  import { generateFlowFromSchema, parseForm } from "../../utils/FormParser";
  import getLayoutedElements from "../../utils/FormDisplay";
  import { EFormListModal } from "../../constants/modalConstants";

  const nodes = useNodes();
  const edges = useEdges();

  let isOpen = false;
  let isSearching = false;
  let searchValue = "";
  let result: string[] = [];

  currentModalOpen.subscribe((value: null | string) => {
    isOpen = value == EFormListModal;
  });

  onMount(async () => {
    getList();
  });

  const getList = async () => {
    isSearching = true;
    try {
      const res = await fetch(`http://${baseServerUrl}/formList${searchValue == "" ? "" : "?search=" + searchValue}`);
      const data = await res.json();
      if (data.message) {
        result = data.message
      } else {
        result = data;
      }
      
    } catch (err) {
      result = ["Something went wrong"];
    }
    isSearching = false;
  };

  const getForm = (formData: string) => {
    const schema = parseForm(JSON.stringify(formData));

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

  const onSearch = (event: Event) => {
    const { value } = event.target as HTMLInputElement;
    searchValue = value;
    getList();
  };

  const onFormClick = async (event: MouseEvent) => {
    event;
    const { innerText } = event.target as HTMLInputElement;
    console.log(innerText);
    try {
      const res = await fetch(`http://${baseServerUrl}/form?name=${innerText}`);
      const data = await res.json();
      getForm(data);
    } catch (err) {
      result = ["Something went wrong"];
    }
  };

  const updateCurrentModal = () => {
    currentModalOpen.update(() => null);
  };
</script>

<Modal title="Existing Forms" bind:open={isOpen} on:close={() => updateCurrentModal()} outsideclose>
  <svelte:fragment slot="header">
    <Search bind:value={searchValue} on:input={onSearch} />
  </svelte:fragment>

  {#if isSearching}
    <div class="flex justify-center">
      <Spinner size={"8"} />
    </div>
  {:else if typeof result == "string"}
    <P>{result}</P>
  {:else if result.length > 0}
    <List list="none">
      {#each result as item}
        <Li><Button class="font-bold m-0 bg-transparent text-gray-700 hover:underline hover:bg-transparent" on:click={onFormClick}>{item}</Button></Li>
      {/each}
    </List>
  
  {:else}
    <P>Something went wrong</P>
  {/if}
</Modal>
