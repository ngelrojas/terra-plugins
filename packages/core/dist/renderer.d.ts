import type { PluginMeta, ProjectManifest } from './types';
export declare function renderTerraform(projectDir: string, manifest: ProjectManifest, metas: PluginMeta[], order: string[]): Promise<void>;
