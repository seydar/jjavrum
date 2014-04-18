Dir['papers/*.txt'].each do |file|
	puts "#{file}"
	system "python algos/featureAnalyzer.py #{file} > new_results/#{File.basename file}"
end