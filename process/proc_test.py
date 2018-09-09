import pytest

from proc import DirProcessor


@pytest.fixture
def data_dir():
    import os
    d = os.path.dirname(os.path.realpath(__file__))
    data = os.path.join(d, 'fixture')
    return data

@pytest.fixture
def dir_processor(data_dir):
    p = DirProcessor(data_dir)
    return p

def test_it_works():
    assert 1 == 1


def test_can_get_dir_processor(data_dir):
    p = DirProcessor(data_dir)
    assert p is not None


def test_can_get_all_datasets(data_dir):
    p = DirProcessor(data_dir)
    ds = p.get_ds()
    assert len(ds) == 4


def test_ds1_starts_right(dir_processor):

    m = [(i, w) for (i, w) in enumerate(dir_processor.get_data(0)) if i < 3]

    assert len(m) == 3

    assert m[0] == (0, "reproduce\t16.615802741")
    assert m[1] == (1, "user\t13.982430703")
    assert m[2] == (2, "parse\t8.621891321")


def test_ds1_correct_cut_off(dir_processor):

    m = [(i, w) for (i, w) in enumerate(dir_processor.get_data(0))]

    assert len(m) == 120
    assert m[-1][1] == "refering\t1.052952505"


def test_ds1_correct_cut_off_ds3(dir_processor):

    m = [(i, w) for (i, w) in enumerate(dir_processor.get_data(3))]

    assert m[-1][1] == "linguistics	1.297152635"


def test_correct_html_from_ds0(dir_processor):

    m = [l for l in dir_processor.get_html(0)]

    assert m[0] == '<textarea class="multiarea" id="multi1">'
    assert m[1] == "reproduce\t16.615802741"
    assert m[-2] == "refering\t1.052952505"
    assert m[-1] == '</textarea>'


def test_correct_html_from_ds3(dir_processor):
    m = [l for l in dir_processor.get_html(3)]

    assert m[0] == '<textarea class="multiarea" id="multi4">'
    assert m[1] == "ontology\t44.894454381"
    assert m[-2] == "linguistics\t1.297152635"
    assert m[-1] == '</textarea>'


def test_get_html_for_all_ds(dir_processor):

    m = [l for l in dir_processor.get_all_html()]

    assert m[0] == '<!-- multi1 1990-1999.txt -->'
    assert m[1] == '<textarea class="multiarea" id="multi1">'
    assert m[2] == "reproduce\t16.615802741"
    assert m[-2] == "linguistics\t1.297152635"
    assert m[-1] == '</textarea>'

