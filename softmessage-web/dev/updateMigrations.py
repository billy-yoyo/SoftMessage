import os
import shutil
from distutils.dir_util import copy_tree

SOURCE_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "softmessage-digest", "src")
OUT_DIR = "./"
try:
    os.mkdir(os.path.join(OUT_DIR, "sql"))
except:
    pass

shutil.copy(os.path.join(SOURCE_DIR, "migrate.js"), os.path.join(OUT_DIR, "migrate.js"))
copy_tree(os.path.join(SOURCE_DIR, "sql"), os.path.join(OUT_DIR, "sql"));
