import { useState,useEffect } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
function Game(){
    const [round , setRound] = useState(1);
    const players = [
        {name: "You", score:0},
        {name: "Deepak", score:0},
        {name: "Muskaan", score:0},
    ];
    const [ drawerIndex,setDrawerIndex] = useState(0);
    const currentDrawer = players[drawerIndex].name;
    const currentUser = "You";
    const isCurrentDrawer = currentUser === currentDrawer;
    const [guess, setGuess] = useState("");
    const [messages, setMessages] = useState([
        {user : "Muskaan", text : "Is is a car?"}
    ]);
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const [secondsLeft, setSecondsLeft] = useState(80);
    const isRoundOver = secondsLeft === 0;
    const navigate = useNavigate();
    useEffect(()=>{
    if(secondsLeft === 0) return;
    const timerId = setInterval(()=>{
        setSecondsLeft((seconds)=>seconds - 1);
    },1000);
    return () => clearInterval(timerId);
},[secondsLeft]);
    const minutes = Math.floor(secondsLeft/60);
    const seconds = String(secondsLeft%60).padStart(2,"0");
    useEffect(() => {
        if (!isRoundOver) return;

        isDrawing.current = false;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }, [isRoundOver]);
    //words
    const [wordOptions, setWordOptions] = useState([]);
    const[isLoadingWords, setIsLoadingWords] = useState(false);
    const [word, setWord] = useState(null);
    const hiddenWord = word
        ? Array.from(word)
            .map((character) => (character === " " ? " " : "_"))
            .join(" ")
        : "";
    async function loadWordOptions(){
        setIsLoadingWords(true);
        try{
            const response = await fetch(
                "https://random-word-api.herokuapp.com/word?number=3&diff=1"
            )
            if(!response.ok){
                throw new Error("Could not load words");
            }
            const choices = await response.json();
            setWordOptions(choices);
        } catch(error){
            console.error(error);
        }finally{
            setIsLoadingWords(false);
        }
    }
    useEffect(()=>{
        loadWordOptions();
    },[]);
    return(
        <div>
            <div>
                <h1>
                Round {round}/3
                </h1>
                <h1>
                    Word: {isCurrentDrawer || isRoundOver ? word : hiddenWord}
                </h1>
                {isRoundOver && (
                    <p>Time's up! The word was {word}.</p>
                )}
                {isRoundOver && (
                    <button type="button" onClick={nextRound}>
                        {round === 3 ? "See Results" : "Next Round"}
                    </button>
                )}
                <h1>Time:{minutes}:{seconds}</h1>
            </div>
            <div>
                <p>
                {currentDrawer} is drawing;
                </p>
                {isCurrentDrawer && !word && !isRoundOver && (
                 <div>
                    <h2>{currentDrawer}, choose a word:</h2>
                    {isLoadingWords && <p>Loading Words</p>}
                    {wordOptions.map((option)=>(
                        <button type="button" key={option} onClick={()=>setWord(option)}>{option}</button>
                    ))}
                 </div>
                )}
            </div>
            <div className="canvas">
                  <div className="player-panel">
                    <h2>Players</h2>
                    {players.map((player)=>(
                        <div key={player.name}>
                            <span>
                                {player.name}
                            </span>
                            <span>
                                {player.score}
                            </span>
                        </div>
                    ))}
                  </div>
                 <canvas
                 ref={canvasRef}
                 width={700}
                 height={450}
                 onMouseDown={startDrawing}
                 onMouseMove={draw}
                 onMouseUp={stopDrawing}
                 onMouseLeave={stopDrawing}/>
                 <div className="chat">
                    <div className="messages">
                        {messages.map((message,index)=>(
                            <p key={`${message.user}-${index}`}
                            >
                                {message.user}: {message.text}
                            </p>
                        ))}
                    </div>
                    <form onSubmit={sendGuess}>
                        <input
                        value={guess}
                        onChange={(event)=> setGuess(event.target.value)}
                        placeholder="Type your guess..."/>
                        <button type="submit">Send</button>
                    </form>
                 </div>
                 <button type="button" onClick={clearCanvas}>Clear-Canvas</button>
            </div>
        </div>
    )
function sendGuess(event){
event.preventDefault();
if(!guess.trim()) return;
setMessages([
    ...messages,
    {user: "You", text: guess.trim()},
]);
setGuess("");
}
function startDrawing(event){
    if (isRoundOver) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    isDrawing.current = true;
    context.beginPath();
    context.moveTo(
        event.clientX - rect.left,
        event.clientY - rect.top
    );
}
function draw(event){
    if(!isDrawing.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    context.lineTo(
        event.clientX - rect.left,
        event.clientY - rect.top
    );
    context.stroke();
}
function stopDrawing(){
    isDrawing.current = false;
}
function clearCanvas(){
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0,0,canvas.width,canvas.height);
}
function nextRound(){
    if (round === 3) {
        navigate("/results");
        return;
    }

    setRound((currentRound) => currentRound + 1);
    setDrawerIndex((index) => (index + 1) % players.length);
    setSecondsLeft(80);
    setMessages([]);
    setGuess("");
    setWord(null);
    loadWordOptions();
    clearCanvas();
}
}

export default Game;
