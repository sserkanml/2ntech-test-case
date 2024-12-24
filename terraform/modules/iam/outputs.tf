output "cluster_role_arn" {
  description = "ARN of EKS cluster IAM role"
  value       = aws_iam_role.cluster.arn
}

output "node_role_arn" {
  description = "ARN of EKS node group IAM role"
  value       = aws_iam_role.node_group.arn
}

output "cluster_role_name" {
  description = "Name of EKS cluster IAM role"
  value       = aws_iam_role.cluster.name
}

output "node_role_name" {
  description = "Name of EKS node group IAM role"
  value       = aws_iam_role.node_group.name
}

output "ebs_csi_role_arn" {
  description = "ARN of the EBS CSI IAM Role"
  value       = aws_iam_role.ebs_csi.arn
}