from os import listdir
import json
from os.path import isfile, join
import random

#os.chdir('/tmp')

# Note: Run from the directory this file is stored in

health_files = [f for f in listdir('../images/health') if isfile(join('../images/health', f))]
health_files.remove('.DS_Store')
print("Health files ", health_files)

lst = []

for file in health_files:
    x = {
      "filename": "health/" + file,
      "category": "health",
    }
    lst.append(x)

files = [f for f in listdir('../images/news_journals') if isfile(join('../images/news_journals', f))]
files.remove('.DS_Store')
print("News files ", files)

for file in files:
    x = {
      "filename": "news_journals/" + file,
      "category": "news_journals",
    }
    lst.append(x)

files = [f for f in listdir('../images/science_journals') if isfile(join('../images/science_journals', f))]
files.remove('.DS_Store')
print("Science journals ", files)

for file in files:
    x = {
      "filename": "science_journals/" + file,
      "category": "science_journals",
    }
    lst.append(x)

files = [f for f in listdir('../images/travel') if isfile(join('../images/travel', f))]
files.remove('.DS_Store')
print("Travel ", files)

for file in files:
    x = {
      "filename": "travel/" + file,
      "category": "travel",
    }
    lst.append(x)

files = [f for f in listdir('../images/shopping') if isfile(join('../images/shopping', f))]
files.remove('.DS_Store')
print("Shopping ", files)

for file in files:
    x = {
      "filename": "shopping/" + file,
      "category": "shopping",
    }
    lst.append(x)

files = [f for f in listdir('../images/social_media') if isfile(join('../images/social_media', f))]
files.remove('.DS_Store')
print("Social media ", files)

for file in files:
    x = {
      "filename": "social_media/" + file,
      "category": "social_media",
    }
    lst.append(x)

# Shuffle the list!
random.shuffle(lst)

data_sample = {'images': lst}

with open('pilot_exp.json', 'w') as outfile:
    json.dump(data_sample, outfile, indent=4)