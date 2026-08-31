import {useNavigate} from "react-router-dom";

function Home(){
    const navigate = useNavigate();
    return(
        <div>
            <h1>
                INKrush
            </h1>
            <div>
                <button className="create-room"
                onClick={()=> navigate("/lobby")}
                >
                    Create-Room
                </button>
            </div>
        </div>
    )
}
export default Home;