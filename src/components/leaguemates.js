

const Leaguemates = (props) => {
    const header = (
        <tr className="main_header">

        </tr>
    )

    const leaguemates = props.leaguemates.filter(x => x.user_id !== props.user_id).map((leaguemate, index) =>
        <tr key={`${leaguemate.user_id}_${index}`}>
            <td>
                {
                    props.avatar(leaguemate.avatar, leaguemate.display_name, 'user')
                }
            </td>
            <td colSpan={2}>
                {
                    leaguemate.display_name
                }
            </td>
            <td>
                {
                    leaguemate.leagues.length
                }
            </td>
            <td>
                {
                    leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster.settings.wins, 0)
                }
                -
                {
                    leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster.settings.losses, 0)
                }
            </td>
            <td>
                <em>
                    {
                        (leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster.settings.wins, 0) /
                            leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster.settings.wins + cur.lmroster.settings.losses, 0)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                    }
                </em>
            </td>
            <td>
                {
                    leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.wins, 0)
                }
                -
                {
                    leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.losses, 0)
                }
            </td>
            <td>
                <em>
                    {
                        (leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.wins, 0) /
                            leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.wins + cur.roster.settings.losses, 0)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                    }
                </em>
            </td>
        </tr>
    )

    return <>
        <h1>Leaguemates</h1>
        <table className="main leaguemates">
            <tbody>
                {leaguemates}
            </tbody>
        </table>
    </>
}

export default Leaguemates;