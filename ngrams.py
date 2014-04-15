import nltk
import sys
import operator

print sys.argv
fileName = sys.argv[-1]
fileObj = open(fileName, 'r')
fileString = fileObj.read()

words = nltk.word_tokenize(fileString)
bigrams = nltk.bigrams(words)
trigrams = nltk.trigrams(words)

unigramsDict = {}

for unigram in words:
	if unigram in unigramsDict:
		unigramsDict[unigram] += 1
	else:
		unigramsDict[unigram] = 1

bigramsDict = {}

for bigram in bigrams:
	if bigram in bigramsDict:
		bigramsDict[bigram] += 1
	else:
		bigramsDict[bigram] = 1

trigramsDict = {}

for trigram in trigrams:
	if trigram in trigramsDict:
		trigramsDict[trigram] += 1
	else:
		trigramsDict[trigram] = 1

	
sortedUnigrams = sorted(unigramsDict.iteritems(), key=operator.itemgetter(1))
sortedBigrams = sorted(bigramsDict.iteritems(), key=operator.itemgetter(1))
sortedTrigrams = sorted(trigramsDict.iteritems(), key=operator.itemgetter(1))
print(sortedUnigrams)

