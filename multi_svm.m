function [f_final s_final] = multi_svm(author_1, author_2, weights, T, firsts, seconds)
  % author_1 and author_2 are the authors whose works we're comparing
  % weights is an array of the weights for each feature (must add up to 1.0)
  % T is the sureness threshold (this is used to make sure we have a low
  %   false-positive rate)

  tic
  db = db_setup('.');

  if nargin < 6
    firsts  = dir(['./papers/' author_1 '.*']);
    seconds = dir(['./papers/' author_2 '.*']);
    firsts  = arrayfun(@(p) db.get_paper(p.name), firsts);
    seconds = arrayfun(@(p) db.get_paper(p.name), seconds);
  end

  % extract the one we want to test (the anthology, for now)
  f_test  = firsts(5);
  s_test  = seconds(5);
  firsts(5)  = [];
  seconds(5) = [];

  feat_names = {'ety',
                'sentence_length',
                'word_length',
                %'punctuation',
                'conjunctions'};
  svms = containers.Map;

  % collect the training data
  % everything is in a single "column" so uneven amounts of data doesn't matter
  for i = 1:size(feat_names, 1)
    first_feats  = [];
    second_feats = [];

    for j = 1:size(firsts, 1)
      if strncmp(feat_names{i}, 'ety', 3)
        somme = sum(firsts(j).features.ety);
        first_feats = [first_feats; firsts(j).features.(feat_names{i})./somme];
      else
        first_feats = [first_feats; firsts(j).features.(feat_names{i})];
      end
    end

    for j = 1:size(seconds, 1)
      if strncmp(feat_names{i}, 'ety', 3)
        somme = sum(seconds(j).features.ety);
        second_feats = [second_feats; seconds(j).features.(feat_names{i})./somme];
      else
        second_feats = [second_feats; seconds(j).features.(feat_names{i})];
      end
    end

    % build the SVMs
    key = [repmat(0, size(first_feats, 1), 1); repmat(1, size(second_feats, 1), 1)];
    svms(feat_names{i}) = svmtrain([first_feats; second_feats], key);
  end

  % tally the scores
  f_decisions = [];
  s_decisions = [];
  for i = 1:size(feat_names, 1)
    f_res = svmclassify(svms(feat_names{i}), f_test.features.(feat_names{i}));
    s_res = svmclassify(svms(feat_names{i}), s_test.features.(feat_names{i}));
    f_decisions = [f_decisions f_res];
    s_decisions = [s_decisions s_res];
  end

  f_decisions
  s_decisions
  f_final = sum(f_decisions .* weights)
  s_final = sum(s_decisions .* weights)
  toc
end

