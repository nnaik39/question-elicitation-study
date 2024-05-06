import json

f = open('pilot_exp.json')

# See what descriptions are obviously bad or in Spanish :(

pilot_exp = json.load(f)

for i in pilot_exp['images']:
    print(i['description'])

# Let me just find the person who answered in Spanish
# and replace all of their entries in here!