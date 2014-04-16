
import nltk
import sys
import os
from itertools import dropwhile
# import postagger
from nltk.tag import stanford
from nltk.tag.stanford import POSTagger 

def tag_sentence(sent):
  assert isinstance(sent, basestring)
  tokens = nltk.word_tokenize(sent)
  return nltk.pos_tag(tokens)

all_tags = []
def collect_tags(tagged_sent):
  for tup in tagged_sent:
    all_tags.append(tup[1])
  return all_tags 

def passivep(tags): #in this case pass it all_tags
  postToBe = list(dropwhile(lambda(pos_tag): not pos_tag.startswith("VBG") and not pos_tag.startswith("VBN"), tags))
  nongerund = lambda(pos_tag): pos_tag.startswith("V") and not pos_tag.startswith("VBG")
  filtered = filter(nongerund, postToBe)
  out = any(filtered)
  return out

# i.e. sentence2 = 'the book was given to her' returns True
# sentence1 = 'I gave her a book' returns false

def oneline(sent):
    return sent.replace("\n", " ").replace("\r", " ")

def print_if_passive(sent):
    tagged = tag_sentence(sent)
    tags = map( lambda(tup): tup[1], tagged)
    if passivep(tags):
        print "passive:", oneline(sent)

punkt = nltk.tokenize.punkt.PunktSentenceTokenizer()

def findpassives(fn):
    with open(fn) as f:
        text = f.read()
        sentences = punkt.tokenize(text)
        for sent in sentences:
          print_if_passive(sent)

