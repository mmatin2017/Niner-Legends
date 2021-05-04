from flask import Flask, render_template, request
import json
from riotwatcher import LolWatcher
import pandas as pd
import numpy as np
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

api_key = 'RGAPI-39da2a69-5f82-42e8-8731-0e00a6a32245'  # must get new riot api key every 24 hours
watcher = LolWatcher(api_key)
my_region = 'na1'
offset = random.uniform(2.5,19.7)
pd.set_option('display.max_columns', 16)
pd.set_option('display.width', 2000)

num_games = 35
teams_df =[]

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

def corr_graph(data):
    correlation = data.corr()
    mak = np.triu(np.ones_like(correlation, dtype=bool))
    corr_map = sns.diverging_palette(230, 20, as_cmap=True)
    x, y = plt.subplots(figsize=(11, 9))
    sns.heatmap(correlation, mask=mak, cmap=corr_map, vmax=0.9, center=0, vmin=-0.2,
    square=True, linewidths=.5, cbar_kws={"shrink": .5}, annot = True)
    plt.savefig('public/plot.png')
    return render_template('analytics.html', url='/niner-legends/public/plot.png')
    
@app.route('/analytics', methods=['POST'])
def predict_outcome():
    data = team_data(request.json['player_name'])
    data = pd.DataFrame(data)

    #creates and saves correlation graph
    corr_graph(data)
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

if __name__ == '__main__':
    app.run()