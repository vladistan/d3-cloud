provider "aws" {
  region     = "us-east-1"
}

data "terraform_remote_state" "v-lad-anim-words" {
    backend = "s3"
    config {
        bucket = "v-lad-anim-words-tf-infra"
        key = "v-lad-anim-words-tf-infra/v1"
        region = "us-east-1"
    }
}
