jjavrum
=======

\#yoloswagginsandthefellowshipofthebling

# Base setup

* MATLAB
* SVM
* similar to DAM good classifier

# Features

All #s will have to be normalized according to text size

x word etymology
x avg sentence length
x avg word length
x # of passive vs # of active
x # of punctuation
x # of conjunctions
* sentence structure (when viewed as dependency graph)
  -> max depth
  -> avg depth
  -> # of nodes
  -> # of subtrees
  -> breadth
* avg percentile position of subject
* avg percentile position of verb
x # of words not in dictionary (foreign words, degrammaticization)
x frequency list of n-grams (1, 2, 3 word phrases)
  -> take top 5, cut down if results are better
* "writing down the word" vs "writing the word down"

# Text

Collect features for individual papers (that is the smallest unit) as well
as a writer's cumulative anthology

# Questions

* How can we represent the nature of trees (sentence structure)?
* How can we identify which author uses what subset of the English language?
  -> How can we represent a subset of a set without identifying the elements?

