<script lang="ts">
  import { writable } from "svelte/store";
  import { SvelteFlow, Controls, Background, BackgroundVariant, MiniMap, Panel, type Node, type Edge, SvelteFlowProvider } from "@xyflow/svelte";
  import FormInputModal from "../modals/FormInputModal.svelte";
  import { nodes as nodeStore, edges as edgeStore, form } from "../../stores/appStore";

  // 👇 this is important! You need to import the styles for Svelte Flow to work
  import "@xyflow/svelte/dist/style.css";
  import FlowMenu from "./FlowMenu.svelte";
  import FormNode from "./nodes/FormNode.svelte";
  import FormDetails from "./FormDetails.svelte";
  import { onMount } from "svelte";
  import type { FormSchema } from "../../models/FormSchema";
  import { generateFlowFromSchema } from "../../utils/FormParser";
  import getLayoutedElements from "../../utils/FormDisplay";

  type SocketMessage = {
    type: string;
    value: unknown;
  };

  let nodes = writable<Node[]>([]);

  let edges = writable<Edge[]>([]);

  nodeStore.subscribe((value) => {
    nodes.update(() => value);
  });

  edgeStore.subscribe((value) => {
    edges.update(() => value);
  });

  const snapGrid: [number, number] = [25, 25];
  const nodeTypes = {
    form: FormNode,
  };

  //ws stuff
  let socket: WebSocket | undefined;
  onMount(() => {
    socket = new WebSocket("ws://localhost:3000/");
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

        const layoutedElements = getLayoutedElements($nodes, $edges, "LR");

        nodeStore.update(() => $nodes);
        edgeStore.update(() => $edges);

        $nodes = layoutedElements.nodes;
        $edges = layoutedElements.edges;
        nodes.update(() => layoutedElements.nodes);
        edges.update(() => layoutedElements.edges);
      }
    });
  });
</script>

<div style:height="100vh">
  <SvelteFlowProvider>
    <SvelteFlow {nodeTypes} {nodes} {edges} {snapGrid} fitView on:nodeclick={(event) => console.log("on node click", event.detail.node)}>
      <Panel position="top-left">
        <FlowMenu />
      </Panel>
      {#if $form != undefined}
        <Panel position="top-right">
          <FormDetails form={$form} />
        </Panel>
      {/if}
      <Controls />
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
    </SvelteFlow>
    <FormInputModal />
  </SvelteFlowProvider>
</div>
