import path from 'path';
import { promises as fs } from 'fs';
import { parse } from 'yaml';
import type { PluginMeta, ProjectManifest } from './types';


export async function readManifest(projectDir: string): Promise<ProjectManifest> {
  const raw = await fs.readFile(path.join(projectDir, 'terra.json'), 'utf8');
  return JSON.parse(raw);
}


export async function writeManifest(projectDir: string, manifest: ProjectManifest) {
  await fs.writeFile(path.join(projectDir, 'terra.json'), JSON.stringify(manifest, null, 2));
}


export interface RegistryEntry { name: string; description?: string; source: string; }


export async function loadRegistry(registryPath: string): Promise<RegistryEntry[]> {
  const raw = await fs.readFile(registryPath, 'utf8');
  return JSON.parse(raw);
}


export async function loadPluginMeta(pluginDir: string): Promise<PluginMeta> {
  const raw = await fs.readFile(path.join(pluginDir, 'plugin.yml'), 'utf8');
  const meta = parse(raw) as PluginMeta;
  return meta;
}


export async function resolveAndCopyPlugin({
  projectDir,
  pluginName,
  registry,
  registryPath
}: {
  projectDir: string;
  pluginName: string;
  registry: RegistryEntry[];
  registryPath?: string;
}) {
  const entry = registry.find(r => r.name === pluginName);
  if (!entry) throw new Error(`Plugin not found in registry: ${pluginName}`);
  let sourceDir = entry.source;
  if (sourceDir.startsWith('workspace:')) {
    // Use registry directory as base for workspace paths
    const workspacePath = sourceDir.replace('workspace:', '');
    if (registryPath) {
      // If registry path is provided, resolve relative to it
      const registryDir = path.dirname(registryPath);
      sourceDir = path.resolve(registryDir, workspacePath);
    } else {
      // Fallback to current working directory
      sourceDir = path.resolve(process.cwd(), workspacePath);
    }
  }
  // Create flattened directory name (e.g., "aws/s3" -> "aws-s3")
  const flattenedName = pluginName.replace(/\//g, '-');
  const dest = path.join(projectDir, flattenedName);
  await copyDir(sourceDir, dest);
}


async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const items = await fs.readdir(src, { withFileTypes: true });
  for (const it of items) {
    const s = path.join(src, it.name);
    const d = path.join(dest, it.name);
    if (it.isDirectory()) await copyDir(s, d); else await fs.copyFile(s, d);
  }
}