function ret = read_results()
  tic

  db   = db_setup('.');
  list = dir('./transformed_results/*.txt');

  for i = 1:size(list, 1)
    disp(['Paper: ' list(i).name]);
    paper = db.get_paper(list(i).name);

    f   = fopen(['./transformed_results/' paper.name]);
    [c] = fscanf(f, '[%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f]')

    paper.add_feature('sentence_length', c(1));
    paper.add_feature('word_length', c(7));
    paper.add_feature('punctuation', reshape(c(2:5), 1, 4));
    paper.add_feature('conjunctions', c(6));
    paper.add_feature('avg_subj_pos', c(8));
    paper.add_feature('avg_verb_pos', c(9));
    paper.add_feature('avg_max_depth', c(10));
    paper.add_feature('avg_nodes', c(11));
    paper.save_me();
  end

  toc
end

