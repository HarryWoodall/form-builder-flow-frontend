<script lang="ts">
  import { writable } from "svelte/store";
  import { SvelteFlow, Controls, Background, BackgroundVariant, MiniMap, Panel, type Node, type Edge, SvelteFlowProvider } from "@xyflow/svelte";
  import FormInputModal from "../modals/FormInputModal.svelte";
  import { nodes as nodeStore, edges as edgeStore, form, formFlowValidation } from "../../stores/appStore";

  // 👇 this is important! You need to import the styles for Svelte Flow to work
  import "@xyflow/svelte/dist/style.css";
  import FlowMenu from "./FlowMenu.svelte";
  import FormNode from "./nodes/FormNode.svelte";
  import FormDetails from "./sidebars/FormDetails.svelte";
  import FlowValidationAlert from "./sidebars/FlowValidationAlert.svelte";
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
      <Panel position="top-left">
        <FlowMenu />
      </Panel>
      {#if $form != undefined}
        <Panel position="top-right">
          <div class="flex justify-center items-center">
            {#if $formFlowValidation && ($formFlowValidation?.invalidPageSlugs.length > 0 || $formFlowValidation?.unreachablePages.length > 0)}
              <FlowValidationAlert />
            {/if}
            <FormDetails form={$form} />
          </div>
        </Panel>
      {/if}

      <Controls />
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap style="background-color: #aaa; z-index: 4" maskColor="#f00" width={300} height={200} />
    </SvelteFlow>
  </SvelteFlowProvider>
</div>
