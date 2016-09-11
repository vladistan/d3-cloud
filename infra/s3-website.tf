resource "aws_s3_bucket" "ebiqwordcloud" {
    bucket = "ebiq-word-cloud.r2.v-lad.org"
    acl = "public-read"

    tags {
        Name = "Ebiquity word cloud public site"
        Environment = "Dev"
    }

    website {
        index_document = "index.html"
        error_document = "error.html"
    }

    logging {
        target_bucket = "${aws_s3_bucket.ebiqwordcloudlog.id}"
        target_prefix = "log/"
    }

}


resource "aws_s3_bucket" "ebiqwordcloudlog" {
    bucket = "ebiq-word-cloud.r2.v-lad.org.logs"
    acl = "log-delivery-write"

    lifecycle_rule {
        id = "log"
        prefix = "log/"
        enabled = true

        expiration {
            days = 30
        }

    }
}


