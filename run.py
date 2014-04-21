import glob
import os


pythonProg = ""

for file in glob.glob("algos/*.py"):
	if file.find("features") >=  0:
		pythonProg = file
print pythonProg
number = 0

for file in glob.glob("papers/lindsey.2*.txt"):
	print file
	number += 1

	if number <= 2:
		continue

	
	command = "python " + pythonProg + " " + file + " > new_results/" + file[7:]
	print command
	os.system(command)
