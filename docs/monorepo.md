excellent — you’re now moving from *framework design* to *ecosystem design*.
this next evolution will let `terra-plugins` scale like npm, homebrew, or terraform registry: lightweight core + infinite community plugins.

---

# 🧩 goal

turn your current monorepo (where plugins live locally under `packages/plugins/`) into a **registry-driven architecture**.

that means:

* each plugin can live anywhere (npm, github, s3, etc.),
* `terra add` downloads it on demand,
* your cli stays small,
* community contributors can publish their own plugins without touching your repo.

---

## 1️⃣ current state (dev-phase)

```
registry.json
└── [
      { "name": "aws-s3", "source": "workspace:packages/plugins/aws-s3" },
      { "name": "aws-sqs", "source": "workspace:packages/plugins/aws-sqs" }
    ]
```

the cli copies the folder from the local workspace.

---

## 2️⃣ next state (registry-based)

```
registry.json
└── [
      {
        "name": "aws-s3",
        "description": "S3 bucket",
        "source": "https://github.com/terra-plugins/aws-s3/archive/refs/tags/v0.1.0.zip",
        "checksum": "sha256-3c4d..."
      },
      {
        "name": "aws-sqs",
        "description": "SQS queue",
        "source": "npm:@terra/aws-sqs@0.1.0"
      }
    ]
```

### source formats supported:

| prefix       | meaning                             |
| ------------ | ----------------------------------- |
| `workspace:` | local dev copy (what you have now)  |
| `npm:`       | fetch via npm registry              |
| `https://`   | download zip/tarball from github/s3 |
| `file:`      | local path (useful for offline)     |

---

## 3️⃣ new workflow for maintainers

### 🧱 build & publish plugin

each plugin package already has its own `package.json`.
add a script:

```json
{
  "scripts": {
    "build": "echo 'no build yet'",
    "publish:plugin": "pnpm pack"
  }
}
```

run:

```bash
cd packages/plugins/aws-s3
pnpm publish --access public
```

or if you prefer zipped source distribution:

```bash
zip -r aws-s3-v0.1.0.zip packages/plugins/aws-s3
aws s3 cp aws-s3-v0.1.0.zip s3://terra-registry/plugins/
```

then update `registry.json` with the public URL.

---

## 4️⃣ modify cli `add` command (auto-download)

### pseudo-code

```ts
import { spawnSync } from "child_process";
import { createWriteStream } from "fs";
import https from "https";
import { pipeline } from "stream/promises";
import { tmpdir } from "os";
import { extract } from "tar"; // if you choose .tar.gz

export async function resolveAndCopyPlugin({ projectDir, pluginName, registry }) {
  const entry = registry.find(r => r.name === pluginName);
  if (!entry) throw new Error(`plugin not found: ${pluginName}`);

  const dest = path.join(projectDir, "plugins", pluginName);
  await fs.mkdir(dest, { recursive: true });

  if (entry.source.startsWith("workspace:")) {
    return copyDir(entry.source.replace("workspace:", path.resolve(process.cwd())), dest);
  }

  if (entry.source.startsWith("npm:")) {
    const pkgSpec = entry.source.replace("npm:", "");
    spawnSync("pnpm", ["add", pkgSpec, "--prefix", dest], { stdio: "inherit" });
    return;
  }

  if (entry.source.startsWith("http")) {
    const tmpFile = path.join(tmpdir(), `${pluginName}.zip`);
    await download(entry.source, tmpFile);
    await extractZip(tmpFile, dest);
    return;
  }

  throw new Error(`unsupported source type: ${entry.source}`);
}

async function download(url: string, file: string) {
  await new Promise<void>((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const ws = createWriteStream(file);
      res.pipe(ws);
      ws.on("finish", resolve);
    }).on("error", reject);
  });
}
```

this allows the cli to **resolve from url or npm**, not just workspace.

---

## 5️⃣ registry hosting options

| option                            | pros                 | setup                                                                                  |
| --------------------------------- | -------------------- | -------------------------------------------------------------------------------------- |
| **GitHub registry (static JSON)** | free, simple         | store `registry.json` in a repo; plugins in sub-repos; update version numbers manually |
| **AWS S3 static site**            | scalable, versioned  | host `registry.json` and zipped plugins on S3 + CloudFront                             |
| **npm registry**                  | integrates with pnpm | publish plugins as npm packages under `@terra` scope                                   |
| **custom service (later)**        | dynamic search, auth | express/fastapi endpoint serving plugin metadata from DB                               |

---

## 6️⃣ local cache

future optimization (v1.1):

```bash
~/.terra/plugins/
  aws-s3/v0.1.0/
  aws-sqs/v0.1.0/
```

on `terra add`, check cache first; only download if missing.
reduces network and speeds up builds.

---

## 7️⃣ publishing workflow

### for you (core maintainer)

```bash
pnpm --filter @terra/aws-s3 publish
pnpm --filter @terra/aws-sqs publish
pnpm changeset version
pnpm changeset publish
```

### for community contributors

```bash
terra create plugin my-company/vpc
# generates skeleton
terra publish --github
```

(you’ll add that later — uses GitHub API to create repo + upload zip.)

---

## 8️⃣ binary footprint stays tiny

the CLI itself only carries:

* TypeScript logic (~5–10 MB compiled),
* `core` library (~1 MB),
* no `.tf` or plugin data.

users pull plugins on demand → your binary size never balloons.

---

## 9️⃣ roadmap milestone: plugin registry architecture (v1.1 → v1.3)

| version  | feature                                      | impact                           |
| -------- | -------------------------------------------- | -------------------------------- |
| **v1.1** | `terra add` supports http + npm sources      | enable remote plugins            |
| **v1.2** | caching (`~/.terra/plugins/`)                | speed, offline installs          |
| **v1.3** | hosted registry site (search, tags, ratings) | community ecosystem              |
| **v1.4** | `terra publish` CLI command                  | 1-click community plugin publish |
| **v1.5** | signed plugins + checksum verify             | security & trust                 |

---

## 🧠 summary

* the monorepo stays your **dev workspace** (source of truth).
* the **published registry** (npm or static JSON) is what users interact with.
* the **CLI** fetches plugins on demand → no GB growth.
* you get the best of both worlds: fast local dev + global ecosystem scalability.

---

if you want, i can now:

* update your current scaffold to support `https` and `npm:` sources in `terra add`,
* and add a minimal **registry.json example** with a downloadable plugin zip (mocked).

would you like me to extend the scaffold with that next?
