import axios from 'axios';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Homepage = () => {
    const [username, setUsername] = useState('')

    const getUser = async (e) => {
        if (e.target.value.trim().length > 0) {
            let user = await axios.get(`/user/${e.target.value}`)
            console.log(user.data)
            if (user.data !== 'Invalid') {
                setUsername(e.target.value)
            } else {
                setUsername('')
            }
        } else {
            setUsername('')
        }
    }

    return <>
        <h1 className='home'>Dynasty Dashboard</h1>

        <div className="username_search_wrapper">
            <input
                className='home'
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <Link to={`/${username}`}>
                <button
                    className='home'
                >
                    Submit
                </button>
            </Link>
        </div>
    </>
}

export default Homepage;
