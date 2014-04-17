function ret = details(paper)
  [status, out] = system('python details.py', paper.path);

  C        = strsplit(out, sprintf('\n'));

  ret = [];
end

