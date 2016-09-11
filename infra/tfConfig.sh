#!/usr/bin/env bash
terraform remote config \
    -backend=s3 \
    -backend-config="bucket=v-lad-anim-words-tf-infra" \
    -backend-config="key=v-lad-anim-words-tf-infra/v1" \
    -backend-config="region=us-east-1"
