import { build } from '@terra/core';


export async function buildStack(projectDir: string) {
    await build(projectDir);
    console.log('🏗 Build complete. Terraform files generated.');
}