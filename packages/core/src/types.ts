export type Link = [string, string]; // from -> to


export interface ProjectManifest {
  provider: 'aws';
  envPrefix: string;
  plugins: string[];
  links: Link[];
}


export interface PluginMeta {
  name: string;
  version?: string;
  provider: 'aws';
  description?: string;
  inputs?: { name: string; type: string; optional?: boolean }[];
  outputs?: { name: string }[];
  depends_on?: string[];
  capabilities?: Array<{
    actor?: string; // e.g., 'lambda', 'ecs-task', 'instance-profile'
    needs: Array<{ action: string; resource: string }>;
  }>;
}