# Configure the DNSimple provider
variable "dnskey" {}

provider "dnsimple" {
    token = "${var.dnskey}"
    email = "vlad@v-lad.org"
}

resource "dnsimple_record" "ebiq-word-cloud" {
    domain = "r2.v-lad.org"
    name = "ebiq-word-cloud"
    value  = "${aws_s3_bucket.ebiqwordcloud.website_endpoint}"
    type = "CNAME"
    ttl = 60
}
