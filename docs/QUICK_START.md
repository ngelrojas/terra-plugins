# Terra CLI - Quick Reference

## Installation
```bash
cd /path/to/terra-plugins
pnpm install
pnpm -r build
pnpm link --global
```

## Commands

### Create Project
```bash
terra create <project-name>
```

**Interactive prompts:**
- Choose provider: `aws`, `gcp`, or `azure`
- Enter environment prefix: e.g., `dev`, `prod`, `staging`

### Add Plugins
```bash
terra add <provider> <plugin>

# Examples:
terra add aws s3
terra add aws vpc
terra add aws iam-role
```

### Link Plugins (Define Dependencies)
```bash
terra link <plugin-from> <plugin-to>

# Examples:
terra link aws/vpc aws/subnet
terra link aws/iam-role aws/iam-policy
```

### Build Terraform
```bash
terra build
```

### Help
```bash
terra --help
terra <command> --help
```

## Available AWS Plugins

### IAM
- `aws/iam-role` - IAM Roles
- `aws/iam-policy` - IAM Policies
- `aws/iam-user` - IAM Users

### Networking
- `aws/vpc` - VPC
- `aws/subnet` - Subnets
- `aws/security-group` - Security Groups
- `aws/internet-gateway` - Internet Gateway
- `aws/route-table` - Route Tables
- `aws/elastic-ip` - Elastic IPs

### Storage & Messaging
- `aws/s3` - S3 Buckets
- `aws/sqs` - SQS Queues

## Example Workflow

```bash
# 1. Create a new project
terra create my-aws-infra
cd my-aws-infra

# 2. Add networking plugins
terra add aws vpc
terra add aws subnet
terra add aws internet-gateway
terra add aws security-group

# 3. Add IAM plugins
terra add aws iam-role
terra add aws iam-policy

# 4. Add storage
terra add aws s3

# 5. Link dependencies
terra link aws/vpc aws/subnet
terra link aws/vpc aws/security-group
terra link aws/vpc aws/internet-gateway

# 6. Build Terraform configuration
terra build

# 7. Run Terraform
terraform init
terraform plan
terraform apply
```

## Project Structure

```
my-project/
├── terra.json          # Project manifest (tracks plugins)
├── main.tf            # Generated Terraform (after build)
├── variables.tf       # Generated variables (after build)
├── outputs.tf         # Generated outputs (after build)
├── aws-s3/            # Plugin: S3 bucket
├── aws-vpc/           # Plugin: VPC
├── aws-sqs/           # Plugin: SQS queue
└── policies/          # Policy synthesis (future)
```

**Note:** 
- Plugins are installed with flattened names (e.g., `aws-s3`, `aws-vpc`) directly in the project root
- `registry.json` is NOT copied to projects - it lives in the Terra CLI workspace
- `terra add` reads from the workspace registry, not from the project

## Tips

- Plugin names in terra.json use format: `provider/plugin`
- Plugins are installed as flattened directories: `provider-plugin/`
- Terraform module names convert slashes and dashes to underscores: `provider_plugin`
- Source paths point to flattened directories: `./provider-plugin`
- Use `terra link` to establish plugin dependencies
- Run `terra build` before `terraform` commands

## Troubleshooting

### Plugin not found
```bash
$ terra add aws fly
❌ Error: Plugin "aws/fly" does not exist
💡 Available plugins will be listed
```
**Solution:** Choose from the list of available plugins shown in the error.

### Not in a project directory
```bash
$ terra add aws s3
❌ Error: Not a terra project directory
```
**Solution:** Run `terra create <name>` first, or `cd` into a terra project.

### Plugin already added
```bash
$ terra add aws s3
⚠️  Plugin "aws/s3" is already added to this project
```
**Solution:** No action needed. The plugin is already available.

### Can't link plugins
```bash
$ terra link aws/vpc aws/subnet
❌ Error: Plugin "aws/vpc" is not added to this project
```
**Solution:** Add both plugins before linking: `terra add aws vpc`

See [docs/error-messages-guide.md](error-messages-guide.md) for complete error documentation.

