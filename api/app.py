from crypt import methods
from operator import itemgetter
from flask import Flask, session, request
from flask_session import Session
import requests
import concurrent.futures
import itertools

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
app.secret_key = '1111'


@app.route('/user/<username>')
def getUser(username):
    user = requests.get(
        'https://api.sleeper.app/v1/user/' + str(username)
    ).json()
    if (user == None):
        user = 'Invalid'
    return user


@app.route('/leagues/<username>', methods=['POST', 'GET'])
def getLeagues(username):
    user = requests.get(
        'https://api.sleeper.app/v1/user/' + str(username)
    ).json()
    if (user == None):
        return 'Invalid'
    else:
        leagues = requests.get(
            'https://api.sleeper.app/v1/user/' + user['user_id'] + '/leagues/nfl/2022').json()

        def getLeagueInfo(league):
            users = requests.get(
                'https://api.sleeper.app/v1/league/' + league['league_id'] + '/users').json()
            rosters = requests.get(
                'https://api.sleeper.app/v1/league/' + league['league_id'] + '/rosters').json()
            league['users'] = users
            league['rosters'] = rosters
            roster = next(
                x for x in rosters if x['owner_id'] == user['user_id'])
            league['wins'] = roster['settings']['wins']
            league['losses'] = roster['settings']['losses']
            league['ties'] = roster['settings']['ties']
            league['fpts'] = float(
                str(roster['settings']['fpts']) + "." + str(roster['settings']['fpts_decimal']))
            league['fpts_against'] = float(str(
                roster['settings']['fpts_against']) + "." + str(roster['settings']['fpts_against_decimal']))
            league['dynasty'] = 'Dynasty' if league['settings']['type'] == 2 else 'Redraft'
            league['bestball'] = 'Bestball' if ('best_ball' in league['settings'].keys(
            ) and league['settings']['best_ball'] == 1) else 'Standard'

            return league

        with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
            leagues = list(executor.map(getLeagueInfo, leagues))
            session['leagues'] = leagues
            session['user'] = user
        return {
            'leagues': leagues,
            'user': user
        }


@app.route('/leaguemates', methods=['GET', 'POST'])
def getLeaguemates():
    leagues = request.get_json()
    user = session.get('user')
    leaguemates = list(map(lambda x: list(map(lambda y: {
        **y,
        'league': {
            'name': x['name'],
            'lmroster': next(iter([z for z in x['rosters'] if z['owner_id'] == y['user_id'] or
                                   (z['co_owners'] != None and y['user_id'] in z['co_owners'])]), None),
            'roster': next(iter([z for z in x['rosters'] if z['owner_id'] == user['user_id'] or
                                 (z['co_owners'] != None and user['user_id'] in z['co_owners'])]), None)
        }
    }, x['users'])), leagues))

    leaguemates = list(filter(lambda x: x['league']['lmroster'] != None, list(
        itertools.chain(*leaguemates))))

    leaguemates_dict = []
    list(map(lambda x: {
        leaguemates_dict.append({
            **x,
            'leagues': [y['league'] for i, y in enumerate(leaguemates) if y['user_id'] == x['user_id']]
        })
    }, leaguemates))

    leaguemates_dict = list({
        x['user_id']: x for x in leaguemates_dict
    }.values())
    return leaguemates_dict


@app.route('/playershares', methods=['POST', 'GET'])
def getPlayerShares():
    leagues = request.get_json()
    allplayers = requests.get(
        'https://api.sleeper.app/v1/players/nfl'
    ).json()

    players = list(map(lambda x:
                       list(map(lambda y:
                                [] if y['players'] == None else list(map(lambda z:
                                                                         {
                                                                             'id': z,
                                                                             'name': allplayers[z] if z in allplayers.keys() else z,
                                                                             'league_id': x['league_id'],
                                                                             'league_name': x['name'],
                                                                             'manager': [m['display_name'] for m in x['users'] if m['user_id'] == y['owner_id'] or (y['co_owners'] != None and m['user_id'] in y['co_owners'])],
                                                                             'manager_id': [m['user_id'] for m in x['users'] if m['user_id'] == y['owner_id'] or (y['co_owners'] != None and m['user_id'] in y['co_owners'])],
                                                                             'wins': y['settings']['wins'],
                                                                             'losses': y['settings']['losses'],
                                                                             'ties': y['settings']['ties'],
                                                                             'fpts': float(str(y['settings']['fpts']) + "." + str(y['settings']['fpts_decimal'])),
                                                                             'fpts_against': float(str(y['settings']['fpts_against']) + "." + str(y['settings']['fpts_against_decimal']))
                                                                         }, y['players'])), x['rosters'])), leagues))

    players = list(itertools.chain(*list(itertools.chain(*players))))

    players_unique = list({
        player['id']: {
            'id': player['id'],
            'name': allplayers[player['id']] if player['id'] in allplayers.keys() else player['id']
        } for player in players
    }.values())
    user = session.get('user')

    def addLeagues(player):
        player['leagues_owned'] = [{
            'league_name': x['league_name'],
            'manager': x['manager'],
            'wins': x['wins'],
            'losses': x['losses'],
            'ties': x['ties'],
            'fpts': x['fpts'],
            'fpts_against': x['fpts_against']
        } for x in players if x['id'] == player['id'] and (x['manager_id'] != [] and x['manager_id'][0] == user['user_id'])]
        player['leagues_taken'] = [{
            'league_name': x['league_name'],
            'manager': x['manager']
        } for x in players if x['id'] == player['id'] and (x['manager_id'] == [] or x['manager_id'][0] != user['user_id'])]
        return player

    with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
        players_count = list(executor.map(addLeagues, players_unique))

    return players_count
