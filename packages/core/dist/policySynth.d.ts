import type { PluginMeta } from './types';
export interface SynthResult {
    principal: string;
    statements: Array<{
        action: string;
        resource: string;
    }>;
}
export declare function synthPolicies(metas: PluginMeta[]): SynthResult[];
