import json 
import random 

f = open('full_question_elicitation_study.json')
 
pilot_exp = json.load(f)

f = open('/Users/nanditanaik/Downloads/ig-vqa-default-rtdb-question-elicitation-study-dataset-expansion-export (40).json')
study_info = json.load(f)
new_pilot_exp = {}
new_pilot_exp['images'] = []

questions_per_image_context_pair = {}

for participant in study_info:
    for trial in study_info[participant]:
        if ((trial['picture'], trial['category']) not in questions_per_image_context_pair):
            questions_per_image_context_pair[(trial['picture'], trial['category'], trial['description'])] = []
        questions_per_image_context_pair[(trial['picture'], trial['category'], trial['description'])].append(trial['q1'])
        questions_per_image_context_pair[(trial['picture'], trial['category'], trial['description'])].append(trial['q2'])

        if (trial['comments'] != ''):
            print(trial['comments'])
        if (trial['glb_comments'] != ''):
            print(trial['glb_comments'])

images_left = []

answer_elicitation_study = {}
answer_elicitation_study['images'] = []

total_images = []

for i in pilot_exp['images']:
    if ((i['filename'], i['category'], i['description']) in questions_per_image_context_pair and len(questions_per_image_context_pair[(i['filename'], i['category'], i['description'])]) >= 2):
        total_images.append(i['filename'])

        # Let me only add two questions per image-context pair!! That's already 3,400 questions!

        questions = random.sample(questions_per_image_context_pair[(i['filename'], i['category'], i['description'])], 2)

        print("Two randomly sampled questions: ", questions)
        
        for question in questions:
            answer_elicitation_study['images'].append({
                'filename': i['filename'],
                'category': i['category'],
                'description': i['description'],
                'question': question,
            })
    else:
        images_left.append((i['filename'], i['category']))
        new_pilot_exp['images'].append(i)

print("Total images in answer elicitation study: ", len(list(set(total_images))))

images_left = list(set(images_left))
print("Number of image-context pairs left ", len(images_left))

json_object = json.dumps(new_pilot_exp, indent=4)
 
with open("new_pilot_exp.json", "w") as outfile:
    outfile.write(json_object)

with open("answer_elicitation_study.json", "w") as outfile:
    outfile.write(json.dumps(answer_elicitation_study, indent = 4))