import { IClusterMetrics } from '../Interfaces/IAction';

export interface ClusterTypes {
  _id: string;
  url?: string;
  k8_port?: number;
  faas_port?: number;
  name?: string;
  description?: string;
  favorite?: string[];
  __v?: number;
  favoriteStatus?: boolean;
  isDark?: boolean; //*adding for darkmode
  clusterMetrics?: IClusterMetrics;
  faas_username?: string;
  faas_password?: string;
  faas_url?: string;
  grafana_url?: string;
  kubeview_url?: string;
  refetch?: any;
}

export interface AddClusterType {
  url: string;
  k8_port: string | number;
  faas_port: string | number;
  faas_username: string;
  faas_password: string;
  name: string;
  description: string;
  faas_url: string;
  grafana_url: string;
  kubeview_url: string;
}

export interface Modules {
  _id?: string;
  id?: string;
  nested?: boolean;
  name?: string;
  url?: string;
  k8_port?: number | undefined;
  faas_port?: number | undefined;
  description?: string;
  isDark?: boolean; //*adding for darkmode
  faas_url?: string;
  grafana_url?: string;
  kubeview_url?: string;
  refetch?: any;
  handleModal?: any;
}

export interface useFetchMetricsProps {
  clusterId: string;
  k8Str: string;
}
