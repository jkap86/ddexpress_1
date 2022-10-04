import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import Leagues from './leagues';
import PlayerShares from './playerShares';
import Leaguemates from './leaguemates';
import Trades from './trades';
import user_avatar from '../images/user_avatar.jpeg';
import league_avatar from '../images/league_avatar.png';
import player_avatar from '../images/headshot.png';


const View = () => {
    const params = useParams();
    const [isLoading_Leagues, setIsLoading_Leagues] = useState(false);
    const [isLoading_Leaguemates, setIsLoading_Leaguemates] = useState(false);
    const [isLoading_PlayerShares, setIsLoading_PlayerShares] = useState(false);
    const [userExists, setUserExists] = useState(true)
    const [stateLeagues, setStateLeagues] = useState({
        original: [],
        display: []
    });
    const [stateUser, setStateUser] = useState({});
    const [stateLeaguemates, setStateLeaguemates] = useState([]);
    const [statePlayerShares, setStatePlayerShares] = useState([]);
    const [trades, setTrades] = useState([])
    const [tab, setTab] = useState('Leagues')
    const [type1, setType1] = useState('All')
    const [type2, setType2] = useState('All')

    useEffect(() => {
        const fetchData = async () => {
            const getLeagues = async () => {
                setIsLoading_Leagues(true)
                const l = await axios.get(`/leagues/${params.username}`)
                if (l.data === 'Invalid') {
                    setUserExists(false)
                } else {
                    setStateLeagues({
                        original: l.data.leagues,
                        display: l.data.leagues
                    })
                    setStateUser(l.data.user)
                    setIsLoading_Leagues(false)
                }
            }
            await getLeagues()
        }
        fetchData()
    }, [params.username])

    useEffect(() => {
        const getData = async (leagues) => {
            const getLeaguemates = async () => {
                setIsLoading_Leaguemates(true)
                const lms = await axios.post('/leaguemates', leagues)
                setStateLeaguemates(lms.data.sort((a, b) => b.leagues.length - a.leagues.length))
                setIsLoading_Leaguemates(false)
            }
            const getPlayerShares = async () => {
                setIsLoading_PlayerShares(true)
                const ps = await axios.post('/playershares', leagues)
                setStatePlayerShares(ps.data.sort((a, b) => b.leagues_owned.length - a.leagues_owned.length))
                setIsLoading_PlayerShares(false)
            }
            await Promise.all([
                getLeaguemates(),
                getPlayerShares()
            ])
        }
        getData(stateLeagues.display)
    }, [stateLeagues.display])

    useEffect(() => {
        const filterLeagues = () => {
            const leagues = stateLeagues.original
            let filtered;
            switch (type1) {
                case ('Redraft'):
                    filtered = leagues.filter(x => x.dynasty === 'Redraft')
                    break;
                case ('All'):
                    filtered = leagues
                    break;
                case ('Dynasty'):
                    filtered = leagues.filter(x => x.dynasty === 'Dynasty')
                    break;
                default:
                    filtered = leagues
                    break;
            }
            switch (type2) {
                case ('Bestball'):
                    filtered = filtered.filter(x => x.bestball === 'Bestball')
                    break;
                case ('All'):
                    filtered = filtered
                    break;
                case ('Standard'):
                    filtered = filtered.filter(x => x.bestball === 'Standard')
                    break;
                default:
                    filtered = filtered
                    break;
            }

            setStateLeagues({
                original: leagues,
                display: filtered
            })
        }
        filterLeagues()
    }, [type1, type2])

    const avatar = (avatar_id, alt, type) => {
        let source;
        let onError = null
        switch (type) {
            case 'league':
                source = avatar_id ? `https://sleepercdn.com/avatars/${avatar_id}` : league_avatar
                break;
            case 'user':
                source = avatar_id ? `https://sleepercdn.com/avatars/${avatar_id}` : user_avatar
                break;
            case 'player':
                source = `https://sleepercdn.com/content/nfl/players/thumb/${avatar_id}.jpg`
                onError = (e) => { return e.target.src = player_avatar }
                break;
            default:
                source = avatar_id ? `https://sleepercdn.com/avatars/${avatar_id}` : league_avatar
                break;
        }
        const image = isLoading_Leagues ? null : <img
            alt={alt}
            src={source}
            onError={onError}
            className="thumbnail"
        />
        return image
    }

    let display;
    switch (tab) {
        case 'Leagues':
            display = (isLoading_Leagues ? <h1>Loading...</h1> :
                <Leagues
                    leagues={stateLeagues.display}
                    user_id={stateUser.user_id}
                    avatar={avatar}
                />
            )
            break;
        case 'Player Shares':
            display = (isLoading_PlayerShares ? <h1>Loading...</h1> :
                <PlayerShares
                    player_shares={statePlayerShares}
                    avatar={avatar}
                />
            )
            break;
        case 'Leaguemates':
            display = (isLoading_Leaguemates ? <h1>Loading...</h1> :
                <Leaguemates
                    leaguemates={stateLeaguemates}
                    user_id={stateUser.user_id}
                    avatar={avatar}
                />
            )
            break;
        case 'Trades':
            display = (
                <Trades
                    leagues={[]}
                    leaguemates={[]}
                />
            )
            break;
        default:
            break;
    }


    return !userExists ?
        <>
            <Link to="/">
                <a className="home">
                    Home
                </a>
            </Link>
            <h1>
                Username Not Found
            </h1>
        </>
        :
        <>
            <Link to="/">
                <a className="home">
                    Home
                </a>
            </Link>
            <h2>
                {
                    avatar(stateUser.avatar, stateUser.username, 'user')
                }
                {
                    params.username
                }
            </h2>
            <div className="navbar">
                <button
                    className={tab === 'Leagues' ? 'active switch clickable' : 'switch clickable'}
                    onClick={() => setTab('Leagues')}>
                    Leagues
                </button>
                <button
                    className={tab === 'Leaguemates' ? 'active switch clickable' : 'switch clickable'}
                    onClick={() => setTab('Leaguemates')}>
                    Leaguemates
                </button>
                <button
                    className={tab === 'Player Shares' ? 'active switch clickable' : 'switch clickable'}
                    onClick={() => setTab('Player Shares')}>
                    Player Shares
                </button>
                <button
                    className={tab === 'Trades' ? 'active switch clickable' : 'switch clickable'}
                    onClick={() => setTab('Trades')}>
                    Trades
                </button>
            </div>
            <div className="switch_wrapper">
                <button className={type1 === 'Redraft' ? 'active switch clickable' : 'switch clickable'} onClick={() => setType1('Redraft')}>Redraft</button>
                <button className={type1 === 'All' ? 'active switch clickable' : 'switch clickable'} onClick={() => setType1('All')}>All</button>
                <button className={type1 === 'Dynasty' ? 'active switch clickable' : 'switch clickable'} onClick={() => setType1('Dynasty')}>Dynasty</button>
            </div>
            <div className="switch_wrapper">
                <button className={type2 === 'Bestball' ? 'active switch clickable' : 'switch clickable'} onClick={() => setType2('Bestball')}>Bestball</button>
                <button className={type2 === 'All' ? 'active switch clickable' : 'switch clickable'} onClick={() => setType2('All')}>All</button>
                <button className={type2 === 'Standard' ? 'active switch clickable' : 'switch clickable'} onClick={() => setType2('Standard')}>Standard</button>
            </div>

            {display}
        </>
}

export default View;