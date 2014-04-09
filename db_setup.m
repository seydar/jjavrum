function db = db_setup(path)

  function paper = get_paper(paper_name)
    full_path = [path '/papers/' paper_name];
    data      = importdata(full_path);

    listing   = dir([path '/features/' paper_name '.*']);
    listing   = arrayfun(@(x) x.name, listing, 'uni', false);

    features  = struct();
    if size(listing, 1) ~= 0
      for i = 1:size(listing, 1)
        feature = listing{i};
        feature = feature((length(paper_name) + 2):(end - 4));
        load([path '/features/' listing{i}], 'data');
        features.(feature) = data;
      end
    end

    function add_feature(name, info)
      features.(name) = info;
    end

    function save_me
      fields = fieldnames(features);
      for i = 1:length(fields)
        save_path = [path '/features/' paper_name '.' fields{i} '.mat'];
        data = features.(fields{i});
        save(save_path, 'data');
      end
    end

    paper = struct();
    paper.name        = paper_name;
    paper.path        = full_path;
    paper.features    = features;
    paper.add_feature = @add_feature;
    paper.save_me     = @save_me;
  end

  function artist = get_artist(artist_name)
    listing   = dir([path '/papers/' artist_name '.*']);
    listing   = arrayfun(@(x) x.name, listing, 'uni', false);

    features  = struct();
    if size(listing, 1) ~= 0
      for i = 1:size(listing, 1)
        feature = listing{i};
        feature = feature((length(paper_name) + 2):(end - 4));
        load([path '/features/' listing{i}], 'data');
        features.(feature) = data;
      end
    end
  end

  db = struct();
  db.get_paper  = @get_paper;
  db.get_author = @get_author;
end

