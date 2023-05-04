import json

with open('pilot_exp_health.json') as user_file:
  file_contents = user_file.read()
  
parsed_json = json.loads(file_contents)

data = []

for img in parsed_json:
    print("img ", img)
    print("Parsed JSON ", parsed_json[img])

    x = {
      "filename": img[len('images/'):],
      "category": parsed_json[img]['ground_truth_category'],
      "mult_categories": parsed_json[img]['ratings_categories']
    }
    data.append(x)

data_sample = {'images': data}

with open('pilot_exp.json', 'w') as outfile:
    json.dump(data_sample, outfile, indent=4)