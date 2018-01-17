require 'unirest'

url = "https://api.ocr.space/parse/imageurl?apikey=helloworld&url="
image = "https://cdn.guidingtech.com/media/assets/WordPress-Import/2016/03/Ulysses-for-iOS-Themes-3.png"



response = Unirest.get(url + image)

text = response.body["ParsedResults"][0]["ParsedText"]