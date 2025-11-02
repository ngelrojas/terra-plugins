output "instance_id" {
  value       = google_compute_instance.this.instance_id
  description = "ID of the compute instance"
}

output "internal_ip" {
  value       = google_compute_instance.this.network_interface[0].network_ip
  description = "Internal IP address"
}

output "external_ip" {
  value       = google_compute_instance.this.network_interface[0].access_config[0].nat_ip
  description = "External IP address"
}

output "self_link" {
  value       = google_compute_instance.this.self_link
  description = "Self link of the instance"
}
variable "instance_name" {
  type        = string
  description = "Name of the compute instance"
}

variable "machine_type" {
  type        = string
  description = "Machine type (e.g., n1-standard-1)"
}

variable "zone" {
  type        = string
  description = "GCP zone for the instance"
}

variable "image" {
  type        = string
  description = "Boot disk image (e.g., debian-cloud/debian-11)"
}

variable "network" {
  type        = string
  description = "VPC network name"
  default     = "default"
}

variable "subnetwork" {
  type        = string
  description = "Subnetwork name"
  default     = null
}
name: gcp/compute-instance
version: 0.1.0
provider: gcp
description: Provision Google Cloud Compute Engine instances

inputs:
  - name: instance_name
    type: string
  - name: machine_type
    type: string
  - name: zone
    type: string
  - name: image
    type: string
  - name: network
    type: string
    optional: true
  - name: subnetwork
    type: string
    optional: true

outputs:
  - name: instance_id
  - name: internal_ip
  - name: external_ip
  - name: self_link

capabilities:
  - actor: service-account
    needs:
      - action: compute.instances.create
        resource: "*"
      - action: compute.instances.get
        resource: "*"

