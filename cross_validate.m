function [ tfr tsr ] = cross_validate( author_1, author_2, w, T )

    % 10-fold cross validation

    firsts = dir(['./papers/' author_1 '.*']);
    seconds = dir(['./papers/' author_2 '.*']);

    f_size = size(firsts);
    s_size = size(seconds);

    all_f_indices = 1:f_size;
    all_s_indices = 1:s_size;

    total_first_rate = zeros(10,1);
    total_second_rate = zeros(10,1);

    parfor i=1:10

       disp(['testing i = ' num2str(i)])
       f_test = all_f_indices(mod(all_f_indices, 10) == (i-1));
       f_train = all_f_indices(mod(all_f_indices, 10) ~= (i-1));

       s_test = all_s_indices(mod(all_s_indices, 10) == (i-1));
       s_train = all_s_indices(mod(all_s_indices, 10) ~= (i-1));

       [aut_1_rate aut_2_rate] = weight_all_feats(author_1, author_2, w, f_test, f_train, s_test, s_train, T);

       total_first_rate(i) = aut_1_rate*(size(f_test,2)/f_size(1));
       total_second_rate(i) = aut_2_rate*(size(s_test,2)/s_size(1));
    end

    tfr = sum(total_first_rate);
    tsr = sum(total_second_rate);
end

