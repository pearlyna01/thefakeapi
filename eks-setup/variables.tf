variable "region" {
    description = "AWS region"
    type = string
    default = "ap-southeast-2"
}

variable "availability_zones" {
    description = "AWS Availability Zones"
    type = list(string)
    default = ["apse2-az1", "apse2-az2"]
}