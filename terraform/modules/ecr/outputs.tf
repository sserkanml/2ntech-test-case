output "repository_url_server" {
  description = "The URL of server repository"
  value       = aws_ecr_repository.server.repository_url
}

output "repository_name_server" {
  description = "The name of server repository"
  value       = aws_ecr_repository.server.name
}

output "repository_url_client" {
  description = "The URL of client repository"
  value       = aws_ecr_repository.client.repository_url
}

output "repository_name_client" {
  description = "The name of client repository"
  value       = aws_ecr_repository.client.name
}