# modules/ecr/variables.tf

resource "aws_ecr_repository" "server" {
  name                 = "${var.project_name}-repo/server"
  image_tag_mutability = var.image_tag_mutability

  image_scanning_configuration {
    scan_on_push = true
  }



  tags = {
    Name = "${var.project_name}-repo/server"
  }
}

resource "aws_ecr_repository" "client" {
  name                 = "${var.project_name}-repo/client"
  image_tag_mutability = var.image_tag_mutability

  image_scanning_configuration {
    scan_on_push = true
  }



  tags = {
    Name = "${var.project_name}-repo/server"
  }
}