import type { PluginMeta, ProjectManifest } from './types';
export declare function readManifest(projectDir: string): Promise<ProjectManifest>;
export declare function writeManifest(projectDir: string, manifest: ProjectManifest): Promise<void>;
export interface RegistryEntry {
    name: string;
    description?: string;
    source: string;
}
export declare function loadRegistry(registryPath: string): Promise<RegistryEntry[]>;
export declare function loadPluginMeta(pluginDir: string): Promise<PluginMeta>;
export declare function resolveAndCopyPlugin({ projectDir, pluginName, registry, registryPath }: {
    projectDir: string;
    pluginName: string;
    registry: RegistryEntry[];
    registryPath?: string;
}): Promise<void>;
