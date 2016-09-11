
variable "bucket" {
    default = "ebiq-word-cloud.r2.v-lad.org"
    description = "S3 bucket to use as static website"
}


resource "aws_s3_bucket" "ebiqwordcloud" {
    bucket = "${var.bucket}"
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

    policy = "${template_file.policy.rendered}"

}

resource "template_file" "policy" {
    template = "${file("files/s3-site-policy.json")}"

    vars {
        bucket = "${var.bucket}"
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


resource "aws_s3_bucket_object" "object" {
    bucket = "${aws_s3_bucket.ebiqwordcloud.id}"
    key = "index.html"
    source = "files/index.html"
    content_type = "html"
    content_encoding = "UTF-8"
    etag = "${md5(file("files/index.html"))}"
}


