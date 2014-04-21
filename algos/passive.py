import nltk
import sys
import os
from itertools import dropwhile
from nltk.tag import stanford
from nltk.tag.stanford import POSTagger

def tag_sentence(sent):
  assert isinstance(sent, basestring)
  tokens = nltk.word_tokenize(sent)
  return nltk.pos_tag(tokens)
        

def collect_tags(tagged_sent):
  all_tags = []
  for tup in tagged_sent:
    all_tags.append(tup[1])
  return all_tags
        
def passivephrase(tags):
  postger = list(dropwhile(lambda(pos_tag): not pos_tag.startswith("VBG") and not pos_tag.startswith("VBN"), tags))
  nongerund = lambda(pos_tag): pos_tag.startswith("V") and not pos_tag.startswith("VBG")
  separate = filter(nongerund, postger)
  true_passive = any(separate)
  return true_passive
    
def one_liner(sent):
    return sent.replace("\n", " ").replace("\r", " ")
        

def print_the_passives(sent):
    tagged = tag_sentence(sent)
    tags = map( lambda(tup): tup[1], tagged)
    if passivephrase(tags):
        print "passive: ", one_liner(sent)


def collect_passive(sent):
    tagged = tag_sentence(sent)
    tags = map( lambda(tup): tup[1], tagged)
    if passivephrase(tags) == True:
        return one_liner(sent)
    

punkt = nltk.tokenize.punkt.PunktSentenceTokenizer() 
                     
def find_and_print_passives(fn):
    collect_passive_sents = []
    with open(fn) as f:
        text = f.read()
        textDecoded = text.decode('utf-8')

        sentences = punkt.tokenize(textDecoded)
        for sent in sentences:
            tagged = tag_sentence(sent)
            tags = map( lambda(tup): tup[1], tagged)
            if passivephrase(tags) == True:
                collect_passive_sents.append(sent)
    return collect_passive_sents
                                                
# find_and_print_passives('amy1.txt')
# find_and_print_passives('sample.txt')
# avg_num_passives('sample.txt')

def avg_percentage_passives(fn):
    with open(fn) as f:
        text = f.read()
        textDecoded = text.decode('utf-8')

        sentences = punkt.tokenize(textDecoded)
        total_sent_num = len(sentences)
        passive_num = float(len(find_and_print_passives(fn)))/total_sent_num
        percentage_passive = (passive_num * 100)
        print percentage_passive

def avg_percentage_active(fn):
    with open(fn) as f:
        text = f.read()
        textDecoded = text.decode('utf-8')
        sentences = punkt.tokenize(textDecoded)
        total_sent_num = len(sentences)
        active_num = total_sent_num - float(len(find_and_print_passives(fn)))
        percentage_active = (((active_num/total_sent_num)) * 100)
        print percentage_active    


def main():

    # if len(sys.argv) > 1:
    #     for fn in sys.argv[1:]:
    #         avg_num_passives(fn)
    # else:
    #     repl()
    fileName = sys.argv[-1]

    avg_percentage_passives(fileName)
    avg_percentage_active(fileName)

if __name__ == "__main__":
    main()
 
