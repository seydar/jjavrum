function [author1_rate author2_rate] = weight_all_feats(author_1, author_2, w, f_test, f_train, s_test, s_train, T)

  % here, w is a vector of length L. ||w|| = 1
  % length(feat_names) = L, too
  % T is our "sureness" threshold - 

  feat_names = {'ety'};

  db = db_setup('.');

  firsts = dir(['./papers/' author_1 '*']);
  seconds = dir(['./papers/' author_2 '*']);

  first_feats = {};
  second_feats = {};

  for i = f_train(1:end) % for all of the training papers
    pa1 = db.get_paper(firsts(i).name); % get the ith paper
    pa1_feats = {};
    for j = 1:(length(w)-1)
      % make a ROW of the features for each
      pa1_feats = [pa1_feats pa1.features.(feat_names{j})];
    end
    first_feats = [first_feats; pa1_feats];
  end

  for i = s_train(1:end) % for all of the training papers
    pa2 = db.get_paper(seconds(i).name);
    pa2_feats = {};
    for j = 1:(length(w)-1)
      pa2_feats = [pa2_feats pa2.features.(feat_names{j})];
    end
    second_feats = [second_feats; pa2_feats];
  end


  key = [repmat(0,length(f_train),1); repmat(1,length(s_train),1)];

  svms = {};

  for i = 1:(length(w)-1)
    ff = [];
    sf = [];

    for j = 1:length(f_train)
      ff = [ff; first_feats{j,i}];
    end

    for j = 1:length(s_train)
      sf = [sf; second_feats{j,i}];
    end

    svms = [svms svmtrain([ff; sf], key)];
  end

  author1_rate = [];
  author2_rate = [];

  for i=f_test(1:end)
    pa = db.get_paper(firsts(i).name);
    wsum = 0;
    for j=1:length(w)
      if (svmclassify(svms{j}, pa.features.(feat_names{j})) == 0)
        wsum = wsum + w(j);
      end
    end
    if wsum >= T
      author1_rate = [author1_rate 1];
    else
      author1_rate = [author1_rate 0];
    end
  end
  
  for i=s_test(1:end)
    pa = db.get_paper(seconds(i).name);
    wsum = 0;
    for j=1:length(w)
      if (svmclassify(svms{j}, pa.features.(feat_names{j})) == 1)
        wsum = wsum + w(j);
      end
    end
    if wsum >= T
      author2_rate = [author2_rate 1];
    else
      author2_rate = [author2_rate 0];
    end
  end
  
  author1_rate = sum(author1_rate) / size(f_test, 2);
  author2_rate = sum(author2_rate) / size(s_test, 2);
end

