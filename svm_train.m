function [firsts_rate seconds_rate] = svm_train(author_1, author_2, feat, n)
  firsts  = dir(['./papers/' author_1 '*']);
  seconds = dir(['./papers/' author_2 '*']);

  ensimst = []; % finnish for 'first'
  toiset  = []; % finnish for 'second'
  for i = 1:n
    pa = db.get_paper(firsts(i).name);
    ensimst = [ensimst; pa.features.(feat)];

    pa = db.get_paper(seconds(i).name);
    toiset  = [toiset;  pa.features.(feat)];
  end

  key = [repmat(0,n, 1)
         repmat(1,n, 1)];

  trained_svm = svmtrain([ensimst; toiset], key);

  %looking at training rate for firsts
  firsts_rate = 0;
  for i = (n+1):length(firsts)
    pa = db.get_paper(firsts(i).name);
    if (svmclassify(trained_svm, pa.features.(feat)) == 0)
      firsts_rate = firsts_rate + 1;
    end
  end
  firsts_rate = (firsts_rate) / (length(firsts) - n);

  seconds_rate = 0;
  for i = (n+1):length(seconds)
    pa = db.get_paper(seconds(i).name);
    if (svmclassify(trained_svm, pa.features.(feat)) == 1)
      seconds_rate = seconds_rate + 1;
    end
  end
  seconds_rate = (seconds_rate) / (length(seconds) - n);
end

