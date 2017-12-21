require 'unirest'
require 'pp'

print "Give me a number: "
input_number = gets.chomp.to_i
response = Unirest.post("localhost:3000/v1/books", parameters: {gutenberg_id: input_number})

pp response.body

