output "vm_id" {
  value       = azurerm_virtual_machine.this.id
  description = "ID of the virtual machine"
}

output "private_ip_address" {
  value       = azurerm_virtual_machine.this.private_ip_address
  description = "Private IP address of the VM"
}

output "public_ip_address" {
  value       = azurerm_virtual_machine.this.public_ip_address
  description = "Public IP address of the VM"
}
variable "vm_name" {
  type        = string
  description = "Name of the virtual machine"
}

variable "resource_group_name" {
  type        = string
  description = "Name of the resource group"
}

variable "location" {
  type        = string
  description = "Azure region for the VM"
}

variable "vm_size" {
  type        = string
  description = "Size of the VM (e.g., Standard_B2s)"
}

variable "admin_username" {
  type        = string
  description = "Administrator username"
}

variable "admin_password" {
  type        = string
  description = "Administrator password"
  default     = null
  sensitive   = true
}

variable "ssh_public_key" {
  type        = string
  description = "SSH public key for authentication"
  default     = null
}
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.0"
    }
  }
}

resource "azurerm_virtual_machine" "this" {
  name                  = var.vm_name
  location              = var.location
  resource_group_name   = var.resource_group_name
  vm_size              = var.vm_size

  storage_os_disk {
    name              = "${var.vm_name}-osdisk"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }

  storage_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }

  os_profile {
    computer_name  = var.vm_name
    admin_username = var.admin_username
    admin_password = var.admin_password
  }

  os_profile_linux_config {
    disable_password_authentication = var.ssh_public_key != null ? true : false

    dynamic "ssh_keys" {
      for_each = var.ssh_public_key != null ? [1] : []
      content {
        path     = "/home/${var.admin_username}/.ssh/authorized_keys"
        key_data = var.ssh_public_key
      }
    }
  }

  tags = {
    Name      = var.vm_name
    ManagedBy = "terra-plugins"
  }
}
name: azure/vm
version: 0.1.0
provider: azure
description: Provision Azure Virtual Machines

inputs:
  - name: vm_name
    type: string
  - name: resource_group_name
    type: string
  - name: location
    type: string
  - name: vm_size
    type: string
  - name: admin_username
    type: string
  - name: admin_password
    type: string
    optional: true
  - name: ssh_public_key
    type: string
    optional: true

outputs:
  - name: vm_id
  - name: private_ip_address
  - name: public_ip_address

capabilities:
  - actor: managed-identity
    needs:
      - action: Microsoft.Compute/virtualMachines/write
        resource: "*"
      - action: Microsoft.Compute/virtualMachines/read
        resource: "*"

