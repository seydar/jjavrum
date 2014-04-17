function ret = read_results()
  tic

  db   = db_setup('.');
  list = dir('./results/*.txt');

  for i = 1:size(list, 1)
    paper = db.get_paper(list(i).name);
    disp(['Paper: ' paper.name]);

    f   = fopen(['./results/' paper.name]);
    [c] = fscanf(f, '%f\n%f\n%f\n%f\n%f\n%f\n%f');

    paper.add_feature('sentence_length', c(1));
    paper.add_feature('word_length', c(7));
    paper.add_feature('punctuation', c(2:5));
    paper.add_feature('conjunctions', c(6));
    paper.save_me();
  end

  toc
end

