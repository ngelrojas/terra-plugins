import type { PluginMeta } from './types';
export interface Node {
    name: string;
    meta: PluginMeta;
}
export interface Edge {
    from: string;
    to: string;
}
export declare function buildDag(nodes: Node[], manualLinks: [string, string][]): Edge[];
export declare function topoSort(nodes: Node[], edges: Edge[]): string[];
