# AWS Compute Modules - Created Plugins

This document lists all the AWS compute-related plugins that have been created in the `packages/plugins/aws` folder.

## Created Plugins

### 1. **aws/ec2**
- **Description**: Provision EC2 instances
- **Dependencies**: VPC, Subnet, Security Group
- **Key Features**:
  - Configurable instance type and AMI
  - VPC and subnet integration
  - Security group assignment
  - Optional IAM instance profile
  - Configurable root volume
  - User data support
  - SSH key pair support
  - Public IP association

### 2. **aws/launch-template**
- **Description**: Define EC2 launch templates
- **Dependencies**: Optional dependency for AutoScaling
- **Key Features**:
  - Template-based instance configuration
  - AMI and instance type specification
  - Network interface configuration
  - Block device mappings
  - IAM instance profile support
  - User data with base64 encoding
  - Tag specifications

### 3. **aws/autoscaling-group**
- **Description**: Manage EC2 scaling groups
- **Dependencies**: Launch Template
- **Key Features**:
  - Min/max/desired capacity configuration
  - Multi-subnet deployment
  - Target group integration for load balancing
  - Health check configuration (EC2 or ELB)
  - Cooldown period configuration
  - Termination policies
  - Automatic tag propagation

### 4. **aws/lambda**
- **Description**: Deploy Lambda functions
- **Dependencies**: IAM Role
- **Key Features**:
  - Multiple deployment methods (zip file or S3)
  - Runtime configuration (Python, Node.js, etc.)
  - Environment variables
  - VPC integration
  - Lambda layers support
  - Memory and timeout configuration
  - IAM role integration

### 5. **aws/ecs-cluster**
- **Description**: Create ECS cluster
- **Dependencies**: VPC (for network mode)
- **Key Features**:
  - Capacity provider support (FARGATE, FARGATE_SPOT, EC2)
  - Container Insights integration
  - Default capacity provider strategy
  - CloudWatch integration

### 6. **aws/ecs-service**
- **Description**: Manage ECS services
- **Dependencies**: ECS Cluster, Task Definition
- **Key Features**:
  - Fargate and EC2 launch types
  - Network configuration (awsvpc mode)
  - Load balancer integration
  - Health check grace period
  - ECS Exec support for debugging
  - Desired count management

### 7. **aws/eks-cluster**
- **Description**: Create EKS (Kubernetes) cluster
- **Dependencies**: VPC, IAM Role, Security Groups, Subnets
- **Key Features**:
  - Kubernetes version selection
  - VPC and subnet configuration
  - Public and private endpoint access
  - Control plane logging
  - Envelope encryption with KMS
  - Security group configuration
  - CIDR-based access control

## Plugin Structure

Each plugin follows the standard structure:
```
plugin-name/
├── plugin.yml        # Plugin metadata, inputs, outputs, and IAM capabilities
├── main.tf          # Terraform resource definitions
├── variables.tf     # Input variable definitions
└── outputs.tf       # Output value definitions
```

## Usage Pattern

These plugins can be used together to create complete compute infrastructures:

1. **Basic EC2 Setup**:
   - VPC → Subnet → Security Group → EC2

2. **Auto-Scaling Setup**:
   - VPC → Subnet → Security Group → Launch Template → Auto Scaling Group

3. **Lambda Setup**:
   - IAM Role → Lambda Function

4. **ECS Setup**:
   - VPC → Subnet → Security Group → ECS Cluster → ECS Service

5. **EKS Setup**:
   - VPC → Subnet → Security Group → IAM Role → EKS Cluster

## IAM Capabilities

All plugins include IAM capability definitions that specify the required AWS permissions for the resources they create. This helps with:
- Security auditing
- Least-privilege IAM policy creation
- Automated permission management

## Next Steps

To use these plugins:
1. Run `terra add aws/ec2` (or any other plugin)
2. The plugin will be added to your `terra.json`
3. Configure the plugin parameters
4. Run `terra build` to generate Terraform code

## Notes

- All resources are tagged with `ManagedBy: terra-plugins` for easy identification
- Plugins support both required and optional parameters
- Dependencies between plugins can be managed through the `terra link` command
- All plugins use AWS provider version >= 5.0

