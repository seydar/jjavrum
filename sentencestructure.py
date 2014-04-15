import nltk.data
import sys
import nltk
from nltk import tokenize
from nltk import word_tokenize
from nltk.tag import pos_tag
from collections import Counter


fileName = sys.argv[-1]
fileObj = open(fileName, 'r')
fileString = fileObj.read()


#install punkt package to get this to work.
#Uncomment nltk.download()
sentences =  tokenize.sent_tokenize(fileString)

counter = Counter(fileString)
commas = counter[',']
semicolons = counter[';']
colons = counter[':']
quotations = counter['"']


commaRate = float(commas)/len(sentences)
semicolonRate = float(semicolons)/len(sentences)
colonRate = float(colons)/len(sentences)
quotationRate = float(quotations)/len(sentences)

print "commas per sentence: " + str(commaRate)
print "semicolons per sentence: " + str(semicolonRate)
print "colons per sentence: " + str(colonRate)
print "quotation marks per sentence: " + str(quotationRate)

totalLength = 0
for sentence in sentences:
	sentenceCounter = Counter(sentence)
	length = sentenceCounter[" "]
	length += 1
	totalLength += length
avgSentenceLength = float(totalLength)/len(sentences)
print "average sentence length: " + str(avgSentenceLength)
	
conjunctions = 0
words = 0
totalWordLength = 0	
for sentence in sentences: 
	tokens = nltk.word_tokenize(sentence)
	taggedTokens = nltk.pos_tag(tokens)
	conjunctionsList = [item for item in taggedTokens if "CC" in item]
	conjunctions += len(conjunctionsList)
	for word in tokens:
		if len(word) == 1:
			if word.lower() == "a" or word.lower() == "i":
				words += 1
				totalWordLength += 1
		else:
			words += 1
			totalWordLength += len(word)

conjunctionRate = float(conjunctions)/len(sentences)
avgWordLength = float(totalWordLength)/words
print "conjunctations per sentence: " + str(conjunctionRate)
print "average word length: " + str(avgWordLength)