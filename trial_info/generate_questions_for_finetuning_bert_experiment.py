import json
import random
import pandas as pd 

f = open('ig-vqa-default-rtdb-question-elicitation-study-gpt4-export (1).json')
data = json.load(f)

# Generate val_finetune_bert.csv, train_finetune_bert.csv, test_finetune_bert.csv

# Do an 80-10-10 split here and finetune BERT?

category_map = {
    'shopping': 0,
    'science_journals': 1,
    'travel': 2,
    'health': 3,
    'news': 4,
    'social_media': 5
}

questions = []

for participant in data:
    for trial in data[participant]: 
        questions.append((trial['q1'], trial['category']))
        questions.append((trial['q2'], trial['category']))

num_train_samples = int(0.8 * len(questions))
num_test_samples = int(0.1 * len(questions))

train_questions = random.sample(questions, num_train_samples)

train_df = []
test_df = []
val_df = []

for i in range(0, len(train_questions)):
    train_df.append({
        'text': train_questions[i][0],
        'label': category_map[train_questions[i][1]]
    })

df = pd.DataFrame(train_df, columns=['text', 'label'])
df.to_csv('full_train_questions_finetune_bert.csv')

print("Total questions: ", len(questions))
print("Train questions: ", len(train_questions))
rest_of_questions = list(set(questions) - set(train_questions))

print("Rest of questions length: ", len(rest_of_questions))

test_questions = random.sample(rest_of_questions, int(0.5 * len(rest_of_questions)))
val_questions = list(set(rest_of_questions) - set(test_questions))

for i in range(0, len(test_questions)):
    test_df.append({
        'text': test_questions[i][0],
        'label': category_map[test_questions[i][1]]
    })

df = pd.DataFrame(test_df, columns=['text', 'label'])
df.to_csv('full_test_questions_finetune_bert.csv')

for i in range(0, len(val_questions)):
    val_df.append({
        'text': val_questions[i][0],
        'label': category_map[val_questions[i][1]]
    })

df = pd.DataFrame(val_df, columns=['text', 'label'])
df.to_csv('full_val_questions_finetune_bert.csv')