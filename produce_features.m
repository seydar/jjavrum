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


  parfor i = 1:size(new, 2)
	disp(['Paper #: ' num2str(i)]);
    paper = db.get_paper(new{i});

    % paper.add_feature('fsa', fsa(paper.paper));
    % paper.add_feature('edge_hist', edge_hist(paper.paper));
	  % paper.add_feature('lbp', lbp_features(paper.paper));
    % paper.add_feature('corners', corners(paper.paper, 0.45));
    % paper.add_feature('blobs', blobs(paper.paper, 1600));
    % paper.add_feature('color_palette', color_palette(paper.paper);
    % paper.add_feature('color_hist', color_hist(paper.paper, 10));
    paper.save_me();
  end
  toc;

  %matlabpool close;
end

