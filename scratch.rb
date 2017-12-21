require 'unirest'


def generate_pages(gutenberg_id, book_id) #move to books controller, change to call pages methods rather than pages API
  response = Unirest.get("https://gutenbergapi.org/texts/#{gutenberg_id}/body")

  lines = []
  response.body["body"].each_line {|line| lines << line}
  page_number = 1
  page_start = 0
  page_end = 40
  for x in 0..(lines.length / 40 + 1)
    params = {
      book_id: book_id,
      page_number: page_number,
      text: lines[page_start..page_end].join()
    }
    puts params[:page_number], params[:text]

    response = Unirest.post("localhost:3000/v1/pages", parameters: params)
    page_number += 1
    page_start += 40
    page_end + 40 < lines.length - 1 ? page_end += 40 : page_end = lines.length - 1 #last line is crashing need to debug
  end
end

print "Give me a number: "
input_number = gets.chomp.to_i
response = Unirest.post("localhost:3000/v1/books", parameters: {gutenberg_id: input_number})
generate_pages(number, response.body["id"])

