import glob
import os


pythonProg = ""

for file in glob.glob("algos/*.py"):
	if file.find("features") >=  0:
		pythonProg = file
print pythonProg
for file in glob.glob("papers/*.txt"):
	#print(file)

	
	command = "python " + pythonProg + " " + file + " > new_results/" + file[7:]
	print command
	os.system(command)
