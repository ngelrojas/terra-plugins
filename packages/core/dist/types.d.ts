export type Link = [string, string];
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
    inputs?: {
        name: string;
        type: string;
        optional?: boolean;
    }[];
    outputs?: {
        name: string;
    }[];
    depends_on?: string[];
    capabilities?: Array<{
        actor?: string;
        needs: Array<{
            action: string;
            resource: string;
        }>;
    }>;
}
