require 'open-uri'
require 'json'
require 'nokogiri'
require 'pp'

class Array
  def count_hash
    h = Hash.new {|h, k| h[k] = 0 }
    each {|obj| h[obj] += 1 }
    h
  end
end

USER_AGENTS = ["Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en; rv:1.9.2.14pre) Gecko/20101212 Camino/2.1a1pre (like Firefox/3.6.14pre)",
               "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1623.0 Safari/537.36",
               "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:25.0) Gecko/20100101 Firefox/25.0",
               "Mozilla/5.0 (X11) KHTML/4.9.1 (like Gecko) Konqueror/4.9",
               "Lynx/2.8.8dev.3 libwww-FM/2.14 SSL-MM/1.4.1",
               "Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14",
               "Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25"]

LANGUAGES = ["English",
             "French",
             "German",
             "Germanic",
             "Italian",
             "Italic",
             "Spanish",
             "Iberic",
             "Latin",
             "Greek",
             "Irish",
             "Sanskrit",
             "Slavonic",
             "Slavic",
             "Russian",
             "Iberian",
             "Polish",
             "Arabic",
             "Danish",
             "Ukrainian",
             "Serbian",
             "Czech",
             "Slovak",
             "Slovakian",
             "Swedish",
             "Norwegian",
             "Frank",
             "Frankish"]

GERMANIC = ["English",
            "German",
            "Germanic",
            "Danish",
            "Swedish",
            "Norwegian",
            "Frank",
            "Frankish"]

LATIN = ["French",
         "Italian",
         "Italic",
         "Latin",
         "Greek", # I know, I know...
         "Iberian",
         "Spanish",
         "Portuguese"]

SLAVIC = ["Russian",
          "Polish",
          "Slavic",
          "Slavonic",
          "Ukrainian",
          "Serbian",
          "Czech",
          "Slovak",
          "Slovakian"
         ]

def normalize(h)
  ret = {"Germanic" => 0, "Latin" => 0}
  ret.default = 0

  h.each do |lang, v|
    if GERMANIC.include? lang
      ret["Germanic"] += v
    elsif LATIN.include? lang
      ret["Latin"] += v
    elsif SLAVIC.include? lang
      ret["Slavic"] += v
    else
      ret[lang] += v
    end
  end

  ret
end

# http://ajax.googleapis.com/ajax/services/search/web?v=1.0&safe=off&q=etymology%3Afield

def google(word, query="etymology:#{word} site:wiktionary.org/wiki/#{word} OR site:etymonline.com/index.php?term=#{word}", desperate=false)
  query = query.gsub(':', "%3A").gsub(' ', "%20")
  page  = nil
  open "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&safe=off&q=#{query}",
       "User-Agent" => USER_AGENTS.sample do |f|
    page = f.read
  end
  
  json = JSON.parse page
  x = json["responseData"]["results"]
  x = [x.first] unless desperate
  x = x.map {|n| n['content'].split /\W+/ }
  x = x.flatten
  x = x.select {|w, n| w == w.capitalize }
  x = x.count_hash
  x = x.select {|k, v| LANGUAGES.include? k }
  x.default = 0
  x
rescue
  h = {}
  h.default = 0
  h
end

def etym_online(word)
  doc = nil
  open "http://etymonline.com/index.php?term=#{word}" do |f|
    doc = Nokogiri::HTML f.read
  end

  x = doc.xpath('//*[@id="dictionary"]/dl/dd').text
  x = x.split /\W+/
  x = x.select {|w, n| w == w.capitalize }
  x = x.count_hash
  x = x.select {|k, v| LANGUAGES.include? k }
  x.default = 0
  x
rescue
  h = {}
  h.default = 0
  h
end

def wiktionary(word)
  doc = nil
  open "http://en.wiktionary.org/wiki/#{word}#English" do |f|
    doc = Nokogiri::HTML f.read
  end

  x = doc.xpath('//*[@id="mw-content-text"]/h3[3]')[0].next_sibling.next_sibling.text
  x = x.split /\W+/
  x = x.select {|w, n| w == w.capitalize }
  x = x.count_hash
  x = x.select {|k, v| LANGUAGES.include? k }
  x.default = 0
  x
rescue
  h = {}
  h.default = 0
  h
end

ety = etym_online ARGV[0]
wiki = wiktionary ARGV[0]
ety.each {|k, v| wiki[k] += v }
results = normalize wiki

if results.all? {|l, v| v == 0 }
  goog = google ARGV[0], "etymology:#{ARGV[0]}", true
  results = normalize goog
end

puts results.sort_by {|l, n| n }.last[0] rescue puts nil

# if ety.nil?
#   puts "sleeping "
#   i = (15..45).to_a.sample
#   puts "#{i}: "
#   i.times { sleep 1; print '.' }
#   puts
#   puts
#   puts
#   ety = google ARGV[0], "etymology:#{ARGV[0]}", true
#   pp ety
# end

