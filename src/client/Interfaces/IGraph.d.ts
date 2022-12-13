declare module 'react-graph-vis' {
  import { Network, Options, Node, Edge, DataSet } from 'vis';
  import { Component } from 'react';

  export interface graphData {
    nodes: Node[];
    edges: Edge[];
  }

  export interface NetworkGraphProps {
    graph: graphData;
    options?: Options;
    events?: graphEvents;
    getNetwork?: (network: Network) => void;
    identifier?: string;
    style?: React.CSSProperties;
    getNodes?: (nodes: DataSet<any>) => void;
    getEdges?: (edges: DataSet<any>) => void;
  }

  export interface NetworkGraphState {
    identifier: string;
  }

  export default class NetworkGraph extends Component<
    NetworkGraphProps,
    NetworkGraphState
  > {
    render();
  }
}
