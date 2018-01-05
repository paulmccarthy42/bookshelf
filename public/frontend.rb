require 'unirest'

response = Unirest.get("https://gutenbergapi.org/texts/6/body")
response.body["body"]
