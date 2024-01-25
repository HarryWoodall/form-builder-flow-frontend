import Dagre from "@dagrejs/dagre";
import { Position, type Edge, type Node } from "@xyflow/svelte";

// const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const dagreGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const border = 50;
const nodeWidth = 400;
const nodeHeight = 150;

export function getLayoutedElements(nodes: Node[], edges: Edge[], direction = "TB") {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: node.computed?.width || nodeWidth, height: node.computed?.height || nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  Dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
}

export default getLayoutedElements;
