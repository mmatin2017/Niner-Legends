from flask import Flask, request
from riotwatcher import LolWatcher
import pandas as pd
import requests
from flask_cors import CORS


app = Flask(__name__)
api_key = 'RGAPI-77d2ced1-cee5-4fd2-a2c9-90b7d0acf439'  # must get new riot api key every 24 hours
watcher = LolWatcher(api_key)
my_region = 'na1'
pd.set_option('display.max_columns', 16)
pd.set_option('display.width', 2000)
match_data = []
CORS(app, supports_credentials=True)


@app.route('/summoners', methods=['POST'])
def get_summoner():
    summoner = request.get_json()
    name = summoner['name']

    me = watcher.summoner.by_name(my_region, name)
    my_matches = watcher.match.matchlist_by_account(my_region, me['accountId'])

    # check league's latest version
    latest = watcher.data_dragon.versions_for_region(my_region)['n']['champion']

    # Lets get some champions static information
    static_champ_list = watcher.data_dragon.champions(latest, False, 'en_US')
    static_item_list = watcher.data_dragon.items(latest, 'en_US')

    # fetch last match detail
    last_match = my_matches['matches'][0]

    match_detail = watcher.match.by_id(my_region, last_match['gameId'])

    match_data.clear()

    match_data.append(match_detail)
    match_data.append(static_champ_list)
    match_data.append(static_item_list)
    rune_data(name)
    return match_data[0], 201


@app.route('/participants')
def participant_data():
    participants = []
    for row in match_data[0]['participants']:
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
        participants.append(participants_row)

    # champ static list data to dict for looking up
    champ_dict = {}
    for key in match_data[1]['data']:
        row = match_data[1]['data'][key]
        champ_dict[row['key']] = row['id']
    for row in participants:
        row['champion'] = champ_dict[str(row['champion'])]

    item_dict = {}
    for key in match_data[2]['data']:
        row = match_data[2]['data'][key]
        item_dict[key] = row['name']
    for row in participants:
        for i in range(1, 8):
            if row[f'Item{i}'] == 0:
                row[f'Item{i}'] = 'Empty'
            else:
                row[f'Item{i}'] = item_dict[str(row[f'Item{i}'])]

    participant_df = pd.DataFrame(participants)

    return pd.DataFrame.to_json(participant_df)


@app.route('/teams')
def team_data():
    # team data
    team_number = 1
    teams = []
    for row in match_data[0]['teams']:
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

    teams_df = pd.DataFrame(teams)

    return pd.DataFrame.to_json(teams_df)


@app.route('/runes/<name>')
def rune_data(name):
    participantsID = 0

    for row in match_data[0]['participantIdentities']:
        if row['player']['summonerName'] == str(name):
            participantsID = row['participantId']
            break

    runes = []
    for row in match_data[0]['participants']:
        if participantsID == row['participantId']:
            runes_row = {}
            runes_row['KeyStone'] = row['stats']['perk0']
            runes_row['Primary1'] = row['stats']['perk1']
            runes_row['Primary2'] = row['stats']['perk2']
            runes_row['Primary3'] = row['stats']['perk3']
            runes_row['Secondary1'] = row['stats']['perk4']
            runes_row['Secondary2'] = row['stats']['perk5']
            runes.append(runes_row)
            break

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

    for row in runes:
        row['KeyStone'] = runes_dict[row['KeyStone']]
        row['Primary1'] = runes_dict[row['Primary1']]
        row['Primary2'] = runes_dict[row['Primary2']]
        row['Primary3'] = runes_dict[row['Primary3']]
        row['Secondary1'] = runes_dict[row['Secondary1']]
        row['Secondary2'] = runes_dict[row['Secondary2']]

    runes_df = pd.DataFrame(runes)

    return pd.DataFrame.to_json(runes_df)