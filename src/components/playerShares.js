

const PlayerShares = (props) => {
    const header = (
        <tr className="main_header">
            <td colSpan={3}>
                Name
            </td>
            <td>
                Leagues
            </td>
            <td>
                Wins
            </td>
            <td>
                losses
            </td>
            <td>
                Win PCT
            </td>
            <td>
                PF
            </td>
            <td>
                PA
            </td>
            <td>
                <em>
                    Differential
                </em>
            </td>
        </tr>
    )

    const player_shares = props.player_shares.map((player, index) =>
        <tr key={`${player.id}_${index}`}>
            <td>
                {
                    props.avatar(player.id, player.name.full_name, 'player')
                }
            </td>
            <td colSpan={2}>
                {
                    player.name.full_name
                }
            </td>
            <td>
                {
                    player.leagues_owned.length
                }
            </td>
            <td>
                {
                    player.leagues_owned.reduce((acc, cur) => acc + cur.wins, 0)
                }
            </td>
            <td>
                {
                    player.leagues_owned.reduce((acc, cur) => acc + cur.losses, 0)
                }
            </td>
            <td>
                {
                    (player.leagues_owned.reduce((acc, cur) => acc + cur.wins, 0) /
                        player.leagues_owned.reduce((acc, cur) => acc + cur.losses + cur.wins, 0)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                }
            </td>
            <td>
                {
                    player.leagues_owned.reduce((acc, cur) => acc + cur.fpts, 0).toLocaleString("en-US")
                }
            </td>
            <td>
                {
                    player.leagues_owned.reduce((acc, cur) => acc + cur.fpts_against, 0).toLocaleString("en-US")
                }
            </td>
            <td>
                <em>
                    {
                        (player.leagues_owned.reduce((acc, cur) => acc + cur.fpts, 0) -
                            player.leagues_owned.reduce((acc, cur) => acc + cur.fpts_against, 0)).toLocaleString("en-US")
                    }
                </em>
            </td>
        </tr>
    )

    return <>
        <h1>PlayerShares</h1>
        <table className="main playershares">
            <tbody>
                {header}
                {player_shares}
            </tbody>
        </table>
    </>
}

export default PlayerShares;