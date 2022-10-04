

const Leagues = (props) => {
    const rank = props.leagues.map(league => {
        const standings = league.rosters.sort((a, b) =>
            b.settings.wins - a.settings.wins || b.settings.losses - a.settings.losses ||
            b.settings.fpts - a.settings.fpts
        )
        const rank = standings.findIndex(obj => {
            return obj.owner_id === props.user_id
        })
        league['rank'] = rank + 1
        const standings_points = league.rosters.sort((a, b) =>
            b.settings.fpts - a.settings.fpts || b.settings.wins - a.settings.wins
        )
        const rank_points = standings_points.findIndex(obj => {
            return obj.owner_id === props.user_id
        })
        league['rank_points'] = rank_points + 1
        return league
    })

    const header = (
        <tr className="main_header">
            <td colSpan={5}>
                League
            </td>
            <td colSpan={2}>
                Record
            </td>
            <td colSpan={2}>
                PF - PA
            </td>
            <td>
                Rank
            </td>
            <td>
                Rank (Points)
            </td>
            <td>
                Teams
            </td>
        </tr>
    )

    const display = props.leagues.map((league, index) =>
        <tr
            key={`${league.league_id}_${index}`}
            className="grid-container"
        >
            <td>
                {
                    props.avatar(league.avatar, league.name, 'league')
                }
            </td>
            <td colSpan={4}>
                {
                    league.name
                }
            </td>
            <td colSpan={2}>
                <p>
                    {
                        `${league.wins}-${league.losses}${league.ties > 0 ? league.ties : ''}`
                    }

                </p>
                <em>
                    {
                        (league.wins / (league.wins + league.losses + league.ties)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                    }
                </em>
            </td>
            <td colSpan={2}>
                <p>
                    {
                        league.fpts
                    }
                    -
                    {
                        league.fpts_against
                    }
                </p>
            </td>
            <td>
                {
                    league.rank
                }
            </td>
            <td>
                {
                    league.rank_points
                }
            </td>
            <td>
                {
                    league.total_rosters
                }
            </td>
        </tr>
    )

    const totals = (
        <h3>
            {
                props.leagues.reduce((acc, cur) => acc + cur.wins, 0)
            }
            -
            {
                props.leagues.reduce((acc, cur) => acc + cur.losses, 0)
            }
            {
                props.leagues.reduce((acc, cur) => acc + cur.ties, 0) > 0 ?
                    `-${props.leagues.reduce((acc, cur) => acc + cur.ties, 0)}` :
                    null
            }
            &nbsp;
            <em>
                {
                    (
                        props.leagues.reduce((acc, cur) => acc + cur.wins, 0) /
                        props.leagues.reduce((acc, cur) => acc + cur.wins + cur.losses + cur.ties, 0)
                    ).toLocaleString("en-US", {
                        maximumFractionDigits: 4,
                        minimumFractionDigits: 4
                    })
                }
            </em>
            <br />
            {
                props.leagues.reduce((acc, cur) => acc + cur.fpts, 0).toLocaleString("en-US", {
                    maximumFractionDigits: 2
                })
            } pts
            &nbsp;-&nbsp;
            {
                props.leagues.reduce((acc, cur) => acc + cur.fpts_against, 0).toLocaleString("en-US", {
                    maximumFractionDigits: 2
                })
            } pts
        </h3>
    )

    return <>
        <h1>{props.leagues.length} Leagues</h1>
        {totals}
        <table className="main leagues">
            <tbody>
                {header}
                {display}
            </tbody>
        </table>
    </>
}

export default Leagues;