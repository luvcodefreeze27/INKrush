import { useNavigate } from "react-router-dom";
function Lobby(){
    const roomCode = "INK-4821";
    const players = ["You (Host)","Deepak","Muskaan"];
    const navigate = useNavigate();
    return(
        <div>
            <h1>
                Game Lobby
            </h1>
            <div>
            <p>
                Share the room code with the Friends
            </p>
            <p>
                {roomCode}
            </p>
            <p>
                Waiting for the players
            </p>
            <h2>
                Players ({players.length}/4)
            </h2>
            {
                players.map((player)=>(
                    <p key={player}>{player}</p>
                ))
            }
            <button disabled={players.length<2}
            onClick={()=>{
                navigate("/game")
            }}>
                Start-Game
            </button>
            </div>
        </div>
    )
}
export default Lobby;