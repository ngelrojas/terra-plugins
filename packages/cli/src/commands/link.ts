import { readManifest, writeManifest } from '@terra/core';


export async function linkPlugins(projectDir: string, from: string, to: string) {
    const manifest = await readManifest(projectDir);
    manifest.links = manifest.links || [];
    manifest.links.push([from, to]);
    await writeManifest(projectDir, manifest);
    console.log(`🔗 Linked ${from} -> ${to}`);
}