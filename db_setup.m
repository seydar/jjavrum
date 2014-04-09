function db = db_setup(path)

  function paper = get_paper(paper_name)
    full_path = [path '/papers/' paper_name];
    paper     = importdata(full_path);
  end


end

