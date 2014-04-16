#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import glob
import os
os.chdir("papers")

for file in glob.glob("*.txt"):
	if file.endswith(".txt"):
		f = open(file, 'r')
		fileString = f.read()
		fileString = fileString.replace("“",'"')
		fileString = fileString.replace("”", '"')
		w = open(file, 'w')
		w.write(fileString)
		w.close()
		f.close()



fileString = re.sub('(\()(.*?)\)','', fileString)

fileString = fileString.replace(' .','.')
fileString = fileString.replace('".', '."')
fileString = fileString.replace(' ,', ',')
fileString = fileString.replace('",',',"')


