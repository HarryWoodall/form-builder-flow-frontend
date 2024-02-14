<script lang="ts">
  import { writable } from "svelte/store";
  import { SvelteFlow, Controls, Background, BackgroundVariant, MiniMap, Panel, type Node, type Edge, SvelteFlowProvider } from "@xyflow/svelte";
  import { nodes as nodeStore, edges as edgeStore, form, formFlowValidation, detailsPanelVisible } from "../../stores/appStore";
  import FlowMenuTopLeft from "./menus/FlowMenuTopLeft.svelte";
  import FlowMenuTopCenter from "./menus/FlowMenuTopCenter.svelte";
  import FormNode from "./nodes/FormNode.svelte";
  import FormList from "../modals/FormList.svelte";
  import { onMount } from "svelte";
  import type { FormSchema } from "../../models/FormSchema";
  import { generateFlowFromSchema } from "../../utils/FormParser";
  import getLayoutedElements from "../../utils/FormDisplay";
  import { baseServerUrl } from "../../constants/serverConstants";
  import TopMenu from "../containers/TopMenu.svelte";

  // 👇 this is important! You need to import the styles for Svelte Flow to work
  import "@xyflow/svelte/dist/style.css";
  import FormInputModal from "../modals/FormInputModal.svelte";
  import FlowMenuTopRight from "./menus/FlowMenuTopRight.svelte";
  import FlowDetailsDraw from "./menus/FlowDetailsDraw.svelte";

  type SocketMessage = {
    type: string;
    value: unknown;
  };

  let nodes = writable<Node[]>([]);
  let edges = writable<Edge[]>([]);
  let socket: WebSocket | undefined;
  const snapGrid: [number, number] = [25, 25];
  const nodeTypes = {
    form: FormNode,
  };

  nodeStore.subscribe((value) => {
    nodes.update(() => value);
  });

  edgeStore.subscribe((value) => {
    edges.update(() => value);
  });

  onMount(() => {
    socket = new WebSocket(`ws://${baseServerUrl}/`);
    socket.addEventListener("open", () => {
      socket?.send("Client connected");
    });

    socket.addEventListener("message", (message) => {
      const messageData = JSON.parse(message.data as string);

      if (messageData.type == "form") {
        const schema: FormSchema = messageData.value;

        if (!schema) return;
        generateFlowFromSchema(schema);
        form.update(() => schema);

        const layoutedElements = getLayoutedElements($nodes, $edges, "LR", $formFlowValidation);

        nodeStore.update(() => $nodes);
        edgeStore.update(() => $edges);

        $nodes = layoutedElements.nodes;
        $edges = layoutedElements.edges;
        nodes.update(() => layoutedElements.nodes);
        edges.update(() => layoutedElements.edges);
      }
    });
  });

  console.log($formFlowValidation);
</script>

<div style:height="100vh">
  <SvelteFlowProvider>
    <SvelteFlow {nodeTypes} {nodes} {edges} {snapGrid} fitView minZoom={0.1} on:nodeclick={(event) => console.log("on node click", event.detail.node)}>
      <TopMenu />
      <Panel position="top-left">
        <FlowMenuTopLeft />
      </Panel>
      <Panel position="top-center">
        <FlowMenuTopCenter />
      </Panel>
      {#if $form != undefined && !$detailsPanelVisible}
        <Panel position="top-right">
          <FlowMenuTopRight />
        </Panel>
      {/if}

      <Controls />
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap style="background-color: #aaa; z-index: 4" maskColor="#f00" width={300} height={200} />
    </SvelteFlow>
    {#if $form}
      <FlowDetailsDraw form={$form} />
    {/if}

    <FormInputModal />
    <FormList />
  </SvelteFlowProvider>
</div>
