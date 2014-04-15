jjavrum
=======

\#yoloswagginsandthefellowshipofthebling

# Base setup

* MATLAB
* SVM
* similar to DAM good classifier

# Features

All #s will have to be normalized according to text size

* word etymology
* avg sentence length - Jordan, DONE
* avg word length - Jordan, DONE
* # of passive vs # of active
* # of punctuation - Jordan, DONE
* # of conjunctions - Jordan, DONE
* sentence structure (when viewed as dependency graph)
  -> max depth
  -> avg depth
  -> # of nodes
  -> # of subtrees
  -> breadth
* avg percentile position of subject
* avg percentile position of verb
* # of words not in dictionary (foreign words, degrammaticization)
* frequency list of n-grams (1, 2, 3 word phrases) - Jordan, DONE
  -> take top 5, cut down if results are better
* "writing down the word" vs "writing the word down"

# Text

Collect features for individual papers (that is the smallest unit) as well
as a writer's cumulative anthology

