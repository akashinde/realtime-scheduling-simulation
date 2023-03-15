import { useState } from "react";
import Button from "../common/button";
import CreateProcess from "./createProcess";
import { useNavigate } from "react-router-dom";


function Menu(props) {
    const [isSelected, setIsSelected] = useState(false);

    const navigate = useNavigate();

    const [processes, setProcesses] = props.processState;
    const [currentAlgo, setCurrentAlgo] = props.algoState;

    function handleSelect(e) {
        // if (e.target.id === "EDF") {
        //     setCurrentAlgo(e.target.id);
        //     navigate("/EDF")
        // }
        setCurrentAlgo(e.target.id);
        setIsSelected(!isSelected);
    }

    return (
        <div className="menu-container">
            {
                isSelected ? (<CreateProcess processState={[processes, setProcesses]} algoState={props.algoState} />) : (
                    <>
                        <p className="heading">Select an Algorithm</p>
                        <div className="algorithm-container">
                            <Button text="FCFS" onClick={handleSelect} style={{ width: "80px" }} />
                            <Button text="RMS" onClick={handleSelect} style={{ width: "80px" }} />
                            {/* <Button text="EDF" onClick={handleSelect} style={{ width: "80px" }} /> */}
                        </div>
                    </>
                )
            }
        </div>
    );
}

export default Menu;
