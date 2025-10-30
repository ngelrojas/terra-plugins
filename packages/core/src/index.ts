import path from 'path';
import { promises as fs } from 'fs';
import { loadPluginMeta, loadRegistry, readManifest } from './pluginLoader';
import { buildDag, topoSort } from './dagEngine';
import { renderTerraform } from './renderer';
export * from './pluginLoader';
export * from './types';


export async function build(projectDir: string) {
    const manifest = await readManifest(projectDir);
    const metas = await Promise.all(
        manifest.plugins.map(async (name) => loadPluginMeta(path.join(projectDir, 'plugins', name)))
    );
    const nodes = metas.map(m => ({ name: m.name, meta: m }));
    const edges = buildDag(nodes, manifest.links || []);
    const order = topoSort(nodes, edges);
    await renderTerraform(projectDir, manifest, metas, order);
// policies (alpha): write a placeholder for now
    await fs.mkdir(path.join(projectDir, 'policies'), { recursive: true });
    await fs.writeFile(path.join(projectDir, 'policies', 'README.md'), '# Policies will be synthesized in a next step');
}