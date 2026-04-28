import MpcMxeDemo from "./MpcMxeDemo";
import NetworkTopologyDemo from "./NetworkTopologyDemo";

// Add future interactive visualizations here
const VISUALIZATIONS: Record<string, React.FC> = {
  "mpc-mxe-demo": MpcMxeDemo,
  "network-topology-demo": NetworkTopologyDemo,
};

interface VisualizationRegistryProps {
  id: string;
}

export default function VisualizationRegistry({ id }: VisualizationRegistryProps) {
  const Component = VISUALIZATIONS[id];

  if (!Component) {
    // Graceful fallback if a visualization ID isn't found
    return null;
  }

  return (
    <div className="my-8 w-full">
      <Component />
    </div>
  );
}
