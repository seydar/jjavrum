import glob
import os

for file in glob.glob("new_results/*.txt"):
	#print(file)
	outputArray = []
	openFile = open(file, 'r')
	lines = [line.rstrip('\n') for line in openFile]
	newFile = file.replace("new_results\\", "")
	writeFile = open("transformed_results/" + newFile, 'w')
	writeFile.write("[")
	first = True
	for line in lines:
		if first != True:
			writeFile.write(",")
		first = False
		writeFile.write(line)
	writeFile.write("]")

	print lines
	openFile.close()