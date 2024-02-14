import Dagre from "@dagrejs/dagre";
import { Position, type Edge, type Node } from "@xyflow/svelte";
import type { InvalidFlow } from "./FormValidator";

const nodeWidth = 400;
const nodeHeight = 150;

export function getLayoutedElements(nodes: Node[], edges: Edge[], direction = "TB", formFlowValidation?: InvalidFlow) {
  const dagreGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: node.computed?.width || nodeWidth, height: node.computed?.height || nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  Dagre.layout(dagreGraph);

  const maxHeightNode = Math.max(...nodes.map((node) => (node.computed && node.computed.height ? node.computed?.height : 1000)));

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    let xPos = nodeWithPosition.x - nodeWidth / 2;
    let yPos = nodeWithPosition.y - nodeHeight / 2;

    if (formFlowValidation && formFlowValidation?.unreachablePages.some((page) => page.PageSlug == node.id)) {
      yPos = -maxHeightNode - 50;
    }
    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: xPos,
      y: yPos,
    };
  });

  return { nodes, edges };
}

export default getLayoutedElements;
