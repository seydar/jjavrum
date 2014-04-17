from __future__ import print_function
import nltk.data
import sys
import nltk
import os
import re
import string
import operator
from nltk import tokenize
from nltk import word_tokenize
#from nltk.parse  import stanford
from nltk.tag import pos_tag
from collections import Counter
#os.environ['STANFORD_PARSER'] = 'C:/stanford-parser-2012-11-12'
#os.environ['STANFORD_MODELS'] = 'C:/stanford-parser-2012-11-12'
#parser = stanford.StanfordParser(model_path="C:/stanford-parser-2012-11-12/edu/stanford/nlp/models/lexparser/englishPCFG.ser.gz")





class FeaturesAnalyzer:
	def __init__(self, filePath):
		self.fileObj = open(fileName, 'r')
		undecodedString = self.fileObj.read()
		self.fileString = undecodedString.decode('utf-8')
		self.fileString = string.replace(self.fileString, '\xe2\x80\x99'.decode('utf-8'), '\'')
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
		self.topUnigrams = self.findTopUnigrams()
		self.topBigrams = self.findTopBigrams()
		self.topTrigrams = self.findTopTrigrams()
	
	def defineTokens(self):
		tokens = []
		for sentence in self.sentences:
			sentenceTokens = nltk.word_tokenize(sentence)
			sentenceTokens = [t for t in sentenceTokens if re.search('\w+', t)]
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

	def findTopUnigrams(self):
		unigramsDict = {}
		for unigram in self.tokens:
			encodedUnigram = unigram.encode('utf-8')
			if encodedUnigram in unigramsDict:
				unigramsDict[encodedUnigram] += 1
			else:
				unigramsDict[encodedUnigram] = 1
		sortedUnigrams = sorted(unigramsDict.iteritems(), key=operator.itemgetter(1), reverse=True)
		return sortedUnigrams[:10]

	def findTopBigrams(self):
		bigramsDict = {}
		bigrams = nltk.bigrams(self.tokens)
		for bigram in bigrams:
			encodedBigram = (bigram[0].encode("utf-8"), bigram[1].encode("utf-8"))
			if encodedBigram in bigramsDict:
				bigramsDict[encodedBigram] += 1
			else:
				bigramsDict[encodedBigram] = 1
		sortedBigrams = sorted(bigramsDict.iteritems(), key=operator.itemgetter(1), reverse=True)
		return sortedBigrams[:10]

	def findTopTrigrams(self):
		trigramsDict = {}
		trigrams = nltk.trigrams(self.tokens)
		for trigram in trigrams:
			encodedTrigram = (trigram[0].encode("utf-8"), trigram[1].encode("utf-8"), trigram[2].encode("utf-8"))
			if encodedTrigram in trigramsDict:
				trigramsDict[encodedTrigram] += 1
			else:
				trigramsDict[encodedTrigram] = 1
		sortedTrigrams = sorted(trigramsDict.iteritems(), key=operator.itemgetter(1), reverse=True)
		return sortedTrigrams[:10]

	def printTopUnigrams(self):
		for gram in self.topUnigrams:
			print(gram[0], gram[1])

	def printTopBigrams(self):
		for gram in self.topBigrams:
			print(gram[0][0], gram[0][1], gram[1])

	def printTopTrigrams(self):
		for gram in self.topTrigrams:
			print(gram[0][0], gram[0][1], gram[0][2], gram[1])

	#don't print out new line character at end
	def printPretty(self):
		print("average sentence length: " + str(self.sentenceLength))
		print("commas per sentence: " + str(self.commaRate))
		print("semicolons per sentence: " + str(self.semicolonRate))
		print("colons per sentence: " + str(self.colonRate))
		print("quotation marks per sentence: " + str(self.quotationRate))
		print("conjunctations per sentence: " + str(self.conjunctionRate))
		print("average word length: " + str(self.wordLength))
		print("most common unigrams: " + str(self.topUnigrams))
		print("most common bigrams: " + str(self.topBigrams))
		print("most common trigrams: " + str(self.topTrigrams))


	def printComputer(self):
		print(str(self.sentenceLength))
		print(str(self.commaRate))
		print(str(self.semicolonRate))
		print(str(self.colonRate))
		print(str(self.quotationRate))
		print(str(self.conjunctionRate))
		print(str(self.wordLength))

		self.printTopUnigrams()
		self.printTopBigrams()
		self.printTopTrigrams()
		#print(str(self.topUnigrams))
		#print(str(self.topBigrams))
		#print(str(self.topTrigrams), end = "")

if __name__ == "__main__":
	fileName = sys.argv[-1]
	#print(parser)
	#methods = [method for method in dir(parser) if callable(getattr(parser, method))]
	#print(methods)
	#sentences = parser.raw_parse("Hello, My name is Melroy.", "What is your name?")
	#print(sentences)


	
	featuresAnalyzer = FeaturesAnalyzer(fileName)
	#featuresAnalyzer.printPretty()
	featuresAnalyzer.printComputer()

#install punkt package to get this to work.
#Uncomment nltk.download()
