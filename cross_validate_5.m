function [ tfr tsr ] = cross_validate_5(firsts, seconds)
  disp('cross validating average subject position');
  %db = db_setup('.');
  %firsts  = dir(['./papers/' author_1 '.*']);
  %seconds = dir(['./papers/' author_2 '.*']);
  %firsts  = arrayfun(@(x) db.get_paper(x.name), firsts);
  %seconds = arrayfun(@(x) db.get_paper(x.name), seconds);

  % god bless stackoverflow
  % http://stackoverflow.com/questions/3070789/example-of-10-fold-svm-classification-in-matlab/3071938#3071938
  first_feats  = [];
  second_feats = [];

  for j = 1:size(firsts, 1)
    somme = sum(firsts(j).features.ety);
    first_feats = [first_feats; firsts(j).features.avg_subj_pos];
  end

  for j = 1:size(seconds, 1)
    somme = sum(seconds(j).features.ety);
    second_feats = [second_feats; seconds(j).features.avg_subj_pos];
  end

  key = [repmat(0, size(first_feats, 1), 1); repmat(1, size(second_feats, 1), 1)];
  groups = key;         %# create a two-class problem
  meas = [first_feats; second_feats];
  
  %# number of cross-validation folds:
  %# If you have 50 samples, divide them into 10 groups of 5 samples each,
  %# then train with 9 groups (45 samples) and test with 1 group (5 samples).
  %# This is repeated ten times, with each group used exactly once as a test set.
  %# Finally the 10 results from the folds are averaged to produce a single 
  %# performance estimation.
  k=10;
  
  cvFolds = crossvalind('Kfold', groups, k);   %# get indices of 10-fold CV
  cp = classperf(groups);                      %# init performance tracker
  
  for i = 1:k                                  %# for each fold
      testIdx = (cvFolds == i);                %# get indices of test instances
      trainIdx = ~testIdx;                     %# get indices training instances
  
      %# train an SVM model over training instances
      svmModel = svmtrain(meas(trainIdx,:), groups(trainIdx), ...
                   'Autoscale',true, 'Showplot',false, 'Method','QP', ...
                   'BoxConstraint',2e-1, 'Kernel_Function','rbf', 'RBF_Sigma',1);
  
      %# test using test instances
      pred = svmclassify(svmModel, meas(testIdx,:), 'Showplot',false);
  
      %# evaluate and update performance object
      cp = classperf(cp, pred, testIdx);
  end
  
  %# get accuracy
  cp.CorrectRate
  
  %# get confusion matrix
  %# columns:actual, rows:predicted, last-row: unclassified instances
  cp.CountingMatrix
end

