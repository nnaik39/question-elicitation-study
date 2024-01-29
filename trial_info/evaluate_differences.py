import json 

f = open('full_question_elicitation_study.json')
bad_data = json.load(f)

f = open('actual_question_elicitation_study_descriptions.json')
good_description_data = json.load(f)

wrong_description_image_map = {}
correct_description_image_map = {}

for i in bad_data['images']:
    if (i['filename'] not in wrong_description_image_map):
        wrong_description_image_map[i['filename']] = i['description']

for i in good_description_data['images']:
    if (i['filename'] not in correct_description_image_map):
        correct_description_image_map[i['filename']] = i['description']

list_wrong_images = []

for image in correct_description_image_map:
    if (correct_description_image_map[image] != wrong_description_image_map[image]):
        print(image)
        print("Correct description: ", correct_description_image_map[image])
        print("Wrong description: ", wrong_description_image_map[image])

        list_wrong_images.append(image)

# Save the correct description image map to a JSON file?
        
print("Total number of images with wrong descriptions: ", len(list(set(list_wrong_images))))

f = open('../../answer-elicitation-study/trial_info/dataset_annotations_cleaned.json')
dataset_annotations = json.load(f)

count_annotations_wrong_description = 0

dataset_annotations_okay = []

for i in dataset_annotations:
    if (i['image'] in list_wrong_images):
        print("Image given wrong description: ", i['image'])
        count_annotations_wrong_description += 1
    else:
        dataset_annotations_okay.append(i)

with open("correct_descriptions_each_image.json", "w") as outfile:
    outfile.write(json.dumps(correct_description_image_map))

print("Wrong description ", count_annotations_wrong_description)

f = open('../../answer-elicitation-study/trial_info/all_questions_collected.json')
answer_elicitation_pilot_exp = json.load(f)

fixed_pilot_exp = {}
fixed_pilot_exp['images'] = []

for i in answer_elicitation_pilot_exp['images']:
    if (i['filename'] in list_wrong_images):
        fixed_pilot_exp['images'].append({
            'filename': i['filename'],
            'description': correct_description_image_map[i['filename']],
            'category': i['category'],
            'question': i['question']
        })
    else:
        fixed_pilot_exp['images'].append(i)

with open("fixed_pilot_exp.json", "w") as outfile:
    outfile.write(json.dumps(fixed_pilot_exp))