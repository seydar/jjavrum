function [db] = produce_features(base)

  if matlabpool('size') == 0
    %matlabpool open;
  end

  db = db_setup(base);  
  
  path = [base '/papers/*.txt'];
  list = dir(path);

  new = {};
  for i = 1:size(list, 1)
    new{i} = list(i).name;
  end

  size(new,2)
  tic


  for i = 1:size(new, 2)
    paper = db.get_paper(new{i});
    disp(['Paper: ' paper.name]);

    % paper.add_feature('fsa', fsa(paper));
    paper.add_feature('ety', ety(paper));
    paper.save_me();
  end
  toc;

  %matlabpool close;
end

