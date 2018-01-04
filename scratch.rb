require 'unirest'

response = Unirest.get("https://gutenbergapi.org/texts/6/body")
puts response.body["body"]

