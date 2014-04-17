function ret = ety(paper)
  [status, out] = system(['ruby algos/ety_paper.rb ' paper.path]);

  C        = strsplit(out, sprintf('\n'));
  germanic = str2num(C{1});
  latin    = str2num(C{2});
  unk      = str2num(C{3});

  ret = [germanic latin unk];
end

