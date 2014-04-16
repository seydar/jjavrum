from nltk.book import *
from nltk.corpus import wordnet as wn

f = open('amy1.txt')
raw = f.read()
tokens = nltk.word_tokenize(raw)

foreign_words = []
for word in sorted(set(text3)):
  if wn.synsets(word) == []:
    foreign_words.append(word)
  else:
    None

# for some reason skips pronouns
foreign_words = []
for word in hellos:
  if wn.synsets(word) == []:
    foreign_words.append(word)
  else:
    None

# hello = 'Hi mi nombre es Jen and I like to ir a la casa playa y escuela'

# nltk.word_tokenize(hello)

# hellos = ['Hi', 'mi', 'nombre', 'es', 'Jen', 'and', 'I', 'like', 'to', 'ir', 'a', 'la', 'casa', 'playa', 'y', 'escuela']

# foreign_words
# ['nombre', 'Jen', 'and', 'to', 'casa', 'playa', 'escuela']

# this is so much worse than the other missing legit english words
# from nltk.corpus import words
# foreign_words = []
# for word in hellos:
#   if word in words.words():
#     None
#   else:
#     foreign_words.append(word)

# # this is SO SLOW yikes
# foreign_words = []
# for word in sorted(set(text2)):
#   if word.strip().lower() in words.words():
#     None
#   else:
#     foreign_words.append(word)
