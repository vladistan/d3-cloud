import os
from glob import glob


class DirProcessor(object):
    def __init__(self, data_dir):
        self.files = glob(os.path.join(data_dir, '*.txt'))

    def get_ds(self):
        return self.files

    def get_data(self, n):
        with open(self.files[n]) as stream:
            for l in stream:
                (word, weight) = l.strip().split('\t')

                if float(weight) < 0.6:
                    return

                yield ("\t".join((word, weight)))

    def get_html(self, n):
        yield '<textarea class="multiarea" id="multi{}">'.format(n + 1)
        yield from self.get_data(n)
        yield '</textarea>'

    def get_all_html(self):

        for (n, d) in enumerate(self.files):
            yield '<!-- multi{} {} -->'.format(n+1, os.path.basename(d))
            yield from self.get_html(n)
