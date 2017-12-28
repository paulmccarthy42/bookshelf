require 'unirest'
require 'pp'


def pull_book
  print "Give me a number: "
  input_number = gets.chomp.to_i
  response = Unirest.post("localhost:3000/v1/books", parameters: {gutenberg_id: input_number})

  pp response.body
  print "Add to bookshelf for later? (y/n) "
  input = gets.chomp
  if input.downcase == "y"
    selection = Unirest.post("localhost:3000/v1/book_selections", parameters: {book_id: response.body["id"]})
  elsif input.downcase == "n"
    puts ":("
  end


end

def shelve_book
  response = Unirest.get("localhost:3000/v1/books")
  response.body.each do |book|
    puts "#{book['id']}: #{book['title']}"
  end
  print "Which book do you want to add to your shelf? "
  params = {}
  params["book_id"] = gets.chomp.to_i
  response = Unirest.post("localhost:3000/v1/book_selections", parameters: params)
  pp response.body
  #post request to book selections
end

puts """
[1] pull book from gutenberg
[2] add book to bookshelf
[3] view bookshelf
"""
choice = gets.chomp.to_i
if choice == 1
  pull_book
elsif choice == 2
  shelve_book
elsif choice == 3

end
