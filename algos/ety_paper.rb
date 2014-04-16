def relative(file=nil, &block)
  if block_given?
    File.expand_path(File.join(File.dirname(eval("__FILE__", block.binding)),block.call)) # 1.9 hack
  elsif file
    File.expand_path(File.join(File.dirname(__FILE__),file))
  end
end

require 'yaml'

def etymologia(word)
  str = "ruby #{relative{ "ety_word.rb" }} '#{word}'"
  `#{str}`.strip
end

database = YAML::load_file(relative{ 'etymologies.yaml' }) rescue database = {}

file_name   = ARGV[0]
derivations = Hash.new {|h, k| h[k] = 0 }
words       = File.read(file_name).split(/\W+/).map(&:downcase)

words.each_with_index do |word, i|
  database[word] ||= etymologia(word)
  #print "#{i}/#{words.size}\r"
end
words.each {|word| derivations[database[word]] += 1 }

#puts
#puts derivations
puts derivations['Germanic']
puts derivations['Latin']
puts (words.size - derivations['Germanic'] - derivations['Latin'])
puts words.size

open relative{ 'etymologies.yaml' }, 'w' do |f|
  YAML::dump database, f
end

