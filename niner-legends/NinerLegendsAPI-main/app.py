from flask import Flask, request, jsonify, render_template
from riotwatcher import LolWatcher
import requests
from flask_cors import CORS
import json
import pandas as pd
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import pathlib
import seaborn as sns
import time
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score
from sklearn.tree import DecisionTreeClassifier
import random
from distutils.util import strtobool
matplotlib.use('Agg')

app = Flask(__name__)
api_key = 'RGAPI-7654508f-2153-4df2-9f2d-91edfd632409'  # must get new riot api key every 24 hours
watcher = LolWatcher(api_key)
my_region = 'na1'
match_collection = []
latest = watcher.data_dragon.versions_for_region(my_region)['n']['champion']
offset = random.uniform(2.5, 19.7)
static_champ_list = watcher.data_dragon.champions(latest, False, 'en_US')
static_item_list = watcher.data_dragon.items(latest, 'en_US')
CORS(app, supports_credentials=True)
num_games = 35

# champ static list data to dict for looking up
champ_dict = {}
for key in static_champ_list['data']:
    row = static_champ_list['data'][key]
    champ_dict[row['key']] = row['id']

# item static list data to dict for looking up
item_dict = {}
for key in static_item_list['data']:
    row = static_item_list['data'][key]
    item_dict[key] = row['name']

# getting rune names from rune id
static_runes_list = requests.get(
    'http://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/runesReforged.json').json()

# runes static list data to dict for looking up
runes_dict = {}
for key in static_runes_list:
    slots = key['slots']
    for slot_list in slots:
        rune_list = slot_list['runes']
        for rune_names in rune_list:
            runes_dict[rune_names['id']] = rune_names['key']


@app.route('/id', methods=['POST'])
def get_id():
    match = request.get_json()
    gameID = match['GameID']

    gameIDs = {}
    gameIDs['GameID'] = gameID
    gameIDs['Details'] = {}

    match_detail = watcher.match.by_id(my_region, gameID)

    participants = []
    for row in match_detail['participants']:
        participants_row = {}
        participants_row['champion'] = row['championId']
        participants_row['win'] = row['stats']['win']
        participants_row['kills'] = row['stats']['kills']
        participants_row['deaths'] = row['stats']['deaths']
        participants_row['assists'] = row['stats']['assists']
        participants_row['totalDamageDealt'] = row['stats']['totalDamageDealt']
        participants_row['goldEarned'] = row['stats']['goldEarned']
        participants_row['champLevel'] = row['stats']['champLevel']
        participants_row['totalMinionsKilled'] = row['stats']['totalMinionsKilled']
        participants_row['Item1'] = row['stats']['item0']
        participants_row['Item2'] = row['stats']['item1']
        participants_row['Item3'] = row['stats']['item2']
        participants_row['Item4'] = row['stats']['item3']
        participants_row['Item5'] = row['stats']['item4']
        participants_row['Item6'] = row['stats']['item5']
        participants_row['Item7'] = row['stats']['item6']
        participants_row['KeyStone'] = row['stats']['perk0']
        participants_row['Primary1'] = row['stats']['perk1']
        participants_row['Primary2'] = row['stats']['perk2']
        participants_row['Primary3'] = row['stats']['perk3']
        participants_row['Secondary1'] = row['stats']['perk4']
        participants_row['Secondary2'] = row['stats']['perk5']
        participants.append(participants_row)

    for row in participants:
        row['champion'] = champ_dict[str(row['champion'])]

    for row in participants:
        for i in range(1, 8):
            if row[f'Item{i}'] == 0:
                row[f'Item{i}'] = 'Empty'
            else:
                row[f'Item{i}'] = item_dict[str(row[f'Item{i}'])]

    for row in participants:
        row['KeyStone'] = runes_dict[row['KeyStone']]
        row['Primary1'] = runes_dict[row['Primary1']]
        row['Primary2'] = runes_dict[row['Primary2']]
        row['Primary3'] = runes_dict[row['Primary3']]
        row['Secondary1'] = runes_dict[row['Secondary1']]
        row['Secondary2'] = runes_dict[row['Secondary2']]

    gameIDs['Details']['participants'] = participants

    # team data
    team_number = 1
    teams = []
    for row in match_detail['teams']:
        teams_row = {}
        teams_row['Team'] = team_number
        teams_row['TowerKills'] = row['towerKills']
        teams_row['FirstBlood'] = row['firstBlood']
        teams_row['InhibitorKills'] = row['inhibitorKills']
        teams_row['BaronKills'] = row['baronKills']
        teams_row['DragonKills'] = row['dragonKills']
        teams_row['Win'] = row['win']
        teams.append(teams_row)
        team_number = team_number + 1

    gameIDs['Details']['teams'] = teams

    for i in range(len(match_collection)):
        if gameID == match_collection[i]['GameID']:
            return jsonify({'Matches': match_collection})

    match_collection.insert(0, gameIDs)

    #gameIDs.clear()

    return jsonify({'Matches': match_collection})


@app.route('/matches')
def matches():
    return jsonify({'Matches': match_collection})


@app.route('/delete/<gameID>', methods=['DELETE'])
def delete_id(gameID):
    if not match_collection:
        return jsonify({'Matches': match_collection})

    for i in range(len(match_collection)):
        if gameID == match_collection[i]['GameID']:
            del match_collection[i]

    return jsonify({'Matches': match_collection})


def team_data(username):
    player = watcher.summoner.by_name(my_region, username)
    matches = watcher.match.matchlist_by_account(my_region, player['accountId'])
    # team data
    team_number = 0
    teams_df = []
    teams = []
    i = 1
    while i < num_games:
        last_match = matches['matches'][i]
        match_detail = watcher.match.by_id(my_region, last_match['gameId']) 
        for row in match_detail['teams']:
            teams_row = {}
            teams_row['TowerKills'] = row['towerKills']
            teams_row['FirstBlood'] = row['firstBlood']
            teams_row['InhibitorKills'] = row['inhibitorKills']
            teams_row['BaronKills'] = row['baronKills']
            teams_row['DragonKills'] = row['dragonKills']
            teams_row['Result'] = row['win']
            teams.append(teams_row)
            team_number = team_number
            i = i + 1

    teams_df = pd.DataFrame(teams)
    return teams_df

    
@app.route('/prediction', methods=['POST'])
def predict_outcome():
    data = team_data(request.json['player_name'])
    data = pd.DataFrame(data)

    #creates and saves correlation graph
    #corr_graph(data)
    y = data["Result"]
    x = data.drop(["Result"],axis=1)
    moe = offset
    x_train, x_test, y_train, y_test = train_test_split(x,y,test_size = 0.5,random_state=0)
    tree_model=DecisionTreeClassifier(criterion="entropy",max_depth=7, splitter="best")
    tree_model.fit(x_train,y_train)
    firstblood = strtobool(request.json['firstblood'])
    user_results=[[int(request.json['tower_kills']),bool(firstblood),int(request.json['inhibitor_kills']),int(request.json['baron_kills']),int(request.json['dragon_kills'])]]
    predict_model=tree_model.predict_proba(user_results).reshape(-1,1)
    
    predicted = {"blue_prob":"", "red_prob":"", "accuracy":"","pred_outcome":""}
    predicted["blue_prob"] = str(abs(predict_model[0]*100-moe))
    predicted["red_prob"] = str(abs(predict_model[1]*100-moe))
    predicted["accuracy"] = str(tree_model.score(x_test,y_test))
    predicted["pred_outcome"] = str(tree_model.predict(user_results))
    return json.dumps(predicted)

