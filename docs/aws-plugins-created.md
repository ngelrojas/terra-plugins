# AWS Plugins Created

## Summary
Successfully created 9 new AWS plugins as Terraform modules in `packages/plugins/`:

### IAM Plugins
1. **aws-iam-role** - Create IAM Roles with assume role policy
   - Required for most AWS services
   - Outputs: role_arn, role_name, role_id

2. **aws-iam-policy** - Create and attach IAM Policies
   - Used by other services (lambda, ec2, etc.)
   - Can optionally attach to a role
   - Outputs: policy_arn, policy_id, policy_name

3. **aws-iam-user** - Create IAM users and access keys
   - Optional access key creation
   - Good for demos/testing
   - Outputs: user_arn, user_name, access_key_id (sensitive), secret_access_key (sensitive)

### VPC Networking Plugins
4. **aws-vpc** - Create VPC network
   - Base dependency for EC2, RDS, EKS
   - Configurable DNS support and hostnames
   - Outputs: vpc_id, vpc_arn, vpc_cidr_block, default_security_group_id

5. **aws-subnet** - Create public/private subnets
   - Depends on VPC
   - Configurable public IP mapping
   - Outputs: subnet_id, subnet_arn, subnet_cidr_block

6. **aws-security-group** - Create and manage security groups
   - Depends on VPC
   - Includes default egress rule (allow all outbound)
   - Outputs: security_group_id, security_group_arn, security_group_name

7. **aws-internet-gateway** - Attach internet gateway to VPC
   - Depends on VPC
   - Required for internet access
   - Outputs: igw_id, igw_arn

8. **aws-route-table** - Manage VPC routing
   - Depends on VPC and Internet Gateway
   - Optional route to internet gateway
   - Outputs: route_table_id, route_table_arn

9. **aws-elastic-ip** - Allocate Elastic IP
   - Can associate with EC2 instance or network interface
   - Used by NAT Gateway
   - Outputs: eip_id, public_ip, allocation_id

## Plugin Structure
Each plugin follows the standard Terraform module structure:
- `plugin.yml` - Plugin metadata, inputs, outputs, dependencies, and capabilities
- `main.tf` - Terraform resource definitions
- `variables.tf` - Input variable definitions
- `outputs.tf` - Output value definitions

## Registry Update
All plugins have been added to `registry.json` at the root of the project.

## Dependencies
The plugins follow this dependency hierarchy:
```
aws-iam-role (base)
  └── aws-iam-policy (depends on role for attachment)

aws-vpc (base)
  ├── aws-subnet (depends on VPC)
  ├── aws-security-group (depends on VPC)
  ├── aws-internet-gateway (depends on VPC)
  └── aws-route-table (depends on VPC + IGW)

aws-elastic-ip (standalone, can associate with instances)
aws-iam-user (standalone)
```

## Usage Example
Users can now add these plugins to their projects using:
```bash
terra add aws-vpc
terra add aws-subnet
terra add aws-security-group
terra add aws-iam-role
# etc...
```

