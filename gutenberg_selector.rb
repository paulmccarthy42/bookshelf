require 'unirest'

def download_book(gutenberg_id)
  response = Unirest.get("https://gutenbergapi.org/texts/#{gutenberg_id}/body")

  lines = []
  response.body["body"].each_line {|line| lines << line}
  page_number = 1
  page_start = 0
  page_end = 40
  for x in 0..(lines.length / 40 + 1)
    params = {
      book_id: 1,
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

download_book(1321)