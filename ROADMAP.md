---

# 🏗️ **Project: `terra-plugins`**

> “Composable Terraform framework — build infrastructure like React components.”

---

## 🌍 **Vision**

Enable developers to **compose Terraform infrastructure** using *modular plugins* with a smart **DAG engine**, instead of manually wiring `.tf` files.

Think:

```bash
npx terra-plugins create my-stack
```

Then:

```
? Provider: AWS
? Add plugins: S3, SQS
? Auto-link dependencies? Yes
```

And it generates a complete Terraform project instantly.

---

## ⚙️ **1. Folder Architecture**

```
terra-plugins/
├─ cli/                    # Core CLI source (Node.js / TypeScript)
│   ├─ commands/
│   │   ├─ init.ts
│   │   ├─ add.ts
│   │   ├─ build.ts
│   │   └─ list.ts
│   ├─ core/
│   │   ├─ dag-engine.ts       # Handles linking between plugins
│   │   ├─ plugin-loader.ts    # Loads and validates plugin metadata
│   │   ├─ renderer.ts         # Generates Terraform files
│   │   └─ prompts.ts          # Interactive questions
│   ├─ utils/
│   │   ├─ fs-utils.ts
│   │   └─ logger.ts
│   └─ index.ts                # CLI entrypoint (uses Commander.js)
│
├─ plugins/                # Built-in plugin library
│   ├─ aws-s3/
│   │   ├─ main.tf
│   │   ├─ variables.tf
│   │   ├─ outputs.tf
│   │   └─ plugin.yml
│   ├─ aws-sqs/
│   │   ├─ main.tf
│   │   ├─ variables.tf
│   │   ├─ outputs.tf
│   │   └─ plugin.yml
│   └─ ...more
│
├─ registry.json           # List of available plugins (name, description, source)
├─ package.json
├─ README.md
└─ LICENSE
```

---

## 💻 **2. CLI Commands**

| Command                | Description                                    | Example                           |
| ---------------------- | ---------------------------------------------- | --------------------------------- |
| `terra init <project>` | Create new project folder with provider setup  | `terra init my-stack`             |
| `terra add <plugin>`   | Add plugin (downloads or copies from registry) | `terra add aws-s3`                |
| `terra link <a> <b>`   | Link plugin A to plugin B (creates DAG edge)   | `terra link aws-s3 aws-sqs`       |
| `terra build`          | Generate final `.tf` files from plugins + DAG  | `terra build`                     |
| `terra list`           | List available plugins from registry           | `terra list`                      |
| `terra info <plugin>`  | Show plugin inputs/outputs                     | `terra info aws-s3`               |
| `terra publish`        | Publish your plugin to registry                | `terra publish ./plugins/aws-ecs` |

CLI will use **Commander.js** (or **oclif**) for command structure and **Inquirer.js** for prompts.

---

## 🧩 **3. Plugin Format**

Each plugin is self-contained:

```yaml
# plugins/aws-s3/plugin.yml
name: aws-s3
provider: aws
description: Creates an S3 bucket.
inputs:
  - name: bucket_name
    type: string
outputs:
  - name: bucket_arn
  - name: bucket_name
example_usage:
  bucket_name: my-bucket
```

Terraform files inside that folder:

```
main.tf
variables.tf
outputs.tf
```

---

## 🧠 **4. DAG Engine Logic**

A simple topological graph resolver will:

1. Load all plugin metadata.
2. Identify dependencies (e.g., `aws-sqs` depends on `aws-s3`).
3. Inject references into Terraform automatically.

### Example:

`sqs.plugin.yml` defines:

```yaml
depends_on:
  - aws-s3
```

The generated Terraform:

```hcl
module "aws_sqs" {
  source = "terra-plugins/aws-sqs"
  bucket_name = module.aws_s3.bucket_name
  depends_on  = [module.aws_s3]
}
```

---

## 🧰 **5. Registry System**

`registry.json` (public index hosted on GitHub):

```json
[
  {
    "name": "aws-s3",
    "description": "Create an S3 bucket",
    "source": "https://github.com/terra-plugins/aws-s3"
  },
  {
    "name": "aws-sqs",
    "description": "Create an SQS queue",
    "source": "https://github.com/terra-plugins/aws-sqs"
  }
]
```

`terra list` reads this and shows:

```
Available plugins:
- aws-s3  → Create an S3 bucket
- aws-sqs → Create an SQS queue
```

---

## 🧠 **6. Tech Stack**

| Component     | Choice                        | Why                        |
| ------------- | ----------------------------- | -------------------------- |
| CLI Framework | **oclif** or **commander.js** | Production-grade CLIs      |
| Prompts       | **Inquirer.js**               | Interactive questions      |
| Templates     | **Handlebars.js**             | Dynamic `.tf` generation   |
| DAG Solver    | **toposort npm package**      | Simple + robust DAG        |
| Config        | **YAML / JSON Schema**        | Plugin metadata definition |
| Versioning    | **semver**                    | Plugin versioning          |
| Publishing    | **npm / GitHub**              | Easy distribution          |
| Testing       | **Jest**                      | For CLI + logic testing    |

---

## 🧱 **7. First Plugins to Include**

| Plugin              | Description                                |
| ------------------- | ------------------------------------------ |
| **aws-s3**          | S3 bucket creation (versioning, tags, ACL) |
| **aws-sqs**         | SQS queue with DLQ optional                |
| **aws-lambda**      | Lambda function (ZIP upload, IAM role)     |
| **aws-iam-role**    | Base role used by Lambda or ECS            |
| **aws-ecs-service** | ECS Fargate service (container + ALB)      |
| **aws-rds**         | PostgreSQL RDS instance                    |
| **aws-vpc**         | Base networking stack                      |
| **aws-cloudfront**  | CDN distribution                           |

---

## 💡 **8. Naming Convention**

* Plugin names: `aws-s3`, `aws-sqs`, `gcp-storage`, etc.
* Output modules: `module.aws_s3.bucket_name`.
* Terraform folder name = plugin name.
* Project metadata file: `terra.json`

  ```json
  {
    "provider": "aws",
    "plugins": ["aws-s3", "aws-sqs"],
    "links": [["aws-s3", "aws-sqs"]]
  }
  ```

---

## 🔮 **9. Future Enhancements**

| Phase    | Feature                                             |
| -------- | --------------------------------------------------- |
| **v1.1** | Support multiple providers (Azure, GCP)             |
| **v1.2** | Plugin templates: `terra create plugin aws-lambda`  |
| **v1.3** | Visual web composer                                 |
| **v2.0** | AI assistant: “Generate a serverless web app stack” |
| **v2.1** | Cloud sync: read Terraform state back into DAG      |
| **v3.0** | Plugin marketplace (GitHub registry integration)    |

---

## 🚀 **Next Step: Bootstrap Plan**

If you want, I can generate next:

1. The **project scaffolding** (TypeScript + CLI boilerplate).
2. The **first plugin templates (`aws-s3` and `aws-sqs`)**.
3. The **first working `terra init` and `terra add` commands.**
