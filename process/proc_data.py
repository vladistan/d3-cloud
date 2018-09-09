#!/usr/bin/env python

import sys
from proc import DirProcessor


if __name__ == "__main__":

    data_dir = sys.argv[1]
    print("Processing from :", data_dir)
    p = DirProcessor(data_dir)

    for l in p.get_all_html():
        print(l)
