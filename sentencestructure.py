from __future__ import print_function
import nltk.data
import sys
import nltk
from nltk import tokenize
from nltk import word_tokenize
from nltk.tag import pos_tag
from collections import Counter





class StructureParser:
	def __init__(self, filePath):
		self.fileObj = open(fileName, 'r')
		self.fileString = self.fileObj.read()
		self.fileStringCounter = Counter(self.fileString)
		self.sentences = tokenize.sent_tokenize(self.fileString)
		self.numSentences = len(self.sentences)
		self.tokens = self.defineTokens()
		self.sentenceLength = self.findSentenceLength()
		self.commaRate = self.findCommaRate()
		self.semicolonRate = self.findSemicolonRate()
		self.colonRate = self.findColonRate()
		self.quotationRate = self.findQuotationRate()
		self.conjunctionRate = self.findConjunctionRate()
		self.wordLength = self.findWordLength()
	
	def defineTokens(self):
		tokens = []
		for sentence in self.sentences:
			sentenceTokens = nltk.word_tokenize(sentence)
			tokens.extend(sentenceTokens)
		return tokens

	def findSentenceLength(self):
		totalLength = 0
		for sentence in self.sentences:
			sentenceCounter = Counter(sentence)
			length = sentenceCounter[" "]
			length += 1
			totalLength += length
		avgSentenceLength = float(totalLength)/self.numSentences
		return avgSentenceLength
	
	def findCommaRate(self):
		commas = self.fileStringCounter[',']
		return float(commas)/self.numSentences

	def findSemicolonRate(self):
		semicolons = self.fileStringCounter[";"]
		return float(semicolons)/self.numSentences

	def findColonRate(self):
		colons = self.fileStringCounter[":"]
		return float(colons)/self.numSentences

	def findQuotationRate(self):
		quotations = self.fileStringCounter['"']
		return float(quotations)/self.numSentences

	def findConjunctionRate(self):
		taggedTokens = nltk.pos_tag(self.tokens)
		conjunctionsList = [item for item in taggedTokens if "CC" in item]
		numConjunctions = len(conjunctionsList)
		return float(numConjunctions)/self.numSentences

	def findWordLength(self):
		totalWordLength = 0
		totalWords = 0
		for word in self.tokens:
			if len(word) == 1:
				if word.lower() == "a" or word.lower() == "i":
					totalWords += 1
					totalWordLength += 1
			else:
				totalWords += 1
				totalWordLength += len(word)
		return float(totalWordLength)/totalWords

	#don't print out new line character at end
	def printPretty(self):
		print("average sentence length: " + str(self.sentenceLength))
		print("commas per sentence: " + str(self.commaRate))
		print("semicolons per sentence: " + str(self.semicolonRate))
		print("colons per sentence: " + str(self.colonRate))
		print("quotation marks per sentence: " + str(self.quotationRate))
		print("conjunctations per sentence: " + str(self.conjunctionRate))
		print("average word length: " + str(self.wordLength))

	def printComputer(self):
		print(str(self.sentenceLength))
		print(str(self.commaRate))
		print(str(self.semicolonRate))
		print(str(self.colonRate))
		print(str(self.quotationRate))
		print(str(self.conjunctionRate))
		print(str(self.wordLength), end = "")

if __name__ == "__main__":
	fileName = sys.argv[-1]
	structureParser = StructureParser(fileName)
	structureParser.printPretty()
	structureParser.printComputer()

#install punkt package to get this to work.
#Uncomment nltk.download()
