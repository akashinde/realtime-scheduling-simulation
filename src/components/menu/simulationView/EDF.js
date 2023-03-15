import React, { useState, useEffect } from "react";

const EDF = (props) => {
    const [processes, setProcesses] = props.processState;
    const [currentAlgo, setCurrentAlgo] = props.algoState;
    const [resultArray, setResultArray] = useState({});

    let sortedProcesses = [...processes];
    sortedProcesses.sort(function (a, b) {
        return a.arrivalTime - b.arrivalTime;
    });

    const [avgWaitTime, setAvgWaitTime] = useState(0);
    const [avgTAT, setAvgTAT] = useState(0);
    const [totalExeTime, setTotalExeTime] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [index, setIndex] = useState(0);

    function lcmOfList(arr) {
        if (arr.length === 0) return 0;
        if (arr.length === 1) return arr[0];
        let lcm = arr[0];
        for (let i = 1; i < arr.length; i++) {
            lcm = lcm * arr[i] / gcd(lcm, arr[i]);
        }
        return lcm;
    }

    function gcd(a, b) {
        if (b === 0) return a;
        return gcd(b, a % b);
    }

    function handleSimStart() {
        setIsStarted(true);
        // rmsScheduling();
    }

    useEffect(() => {
        function rmsScheduling() {
            const [processes, setProcesses] = props.processState;
            const colors = ["#F55050", "#85CDFD", "#B5F1CC"]
            processes.map((p, i) => p.color = colors[i])
            // [1, 8, 0, 1]
            // [3, 15, 0, 2]
            // [6, 22, 0, 3]
            console.log(processes)
            processes.sort(function (a, b) {
                return a.period - b.period;
            });
            processes.forEach((p, index) => {
                p.priority = index + 1;
            });
            console.log(processes)
            let proc = processes.map(p => {
                return [p.exeTime, p.period, p.arrivalTime, p.priority]
            })
            console.log(proc)

            let n = proc.length
            let execution = []
            let startingPoints = []
            let tasksArray = []
            let resArray = {}
            let arrivalArray = []
            let i = 0

            for (const i of Array(n).keys()) {
                execution.push(proc[i][0])
                arrivalArray.push(proc[i][2])
            }

            let LCM = lcmOfList(proc.map(p => { return p[1] }));
            console.log(LCM)

            let ind;

            let Result = []

            for (const i of Array(LCM).keys()) {
                if (i != 0) {
                    for (const k of Array(n).keys()) {
                        if (Math.abs(i - proc[k][2]) % proc[k][1] === 0) {
                            execution[k] = proc[k][0];
                        }
                    }
                }
                ind = 0;
                for (const j of Array(n).keys()) {
                    if (execution[j] !== 0 && i >= arrivalArray[j]) {
                        execution[j] = execution[j] - 1;
                        Result.push(proc[j][3]);
                        ind = 1;
                        break;
                    }
                }
                if (ind == 0) {
                    Result.push(-1);
                }
            }

            console.log("Timeline length: ", LCM);

            for (const i of Array(LCM).keys()) {
                startingPoints.push(i);
                if (Result[i] != - 1) {
                    // console.log('From% d to% d: p% d ', i, i + 1, Result[i]);
                    tasksArray.push(Result[i]);
                } else {
                    // console.log(' From% d to% d: Empty slot ', i, i + 1);
                    tasksArray.push(0);
                }
            }

            startingPoints.push(i + 1);
            resArray.startingPoints = startingPoints;
            resArray.tasksArray = tasksArray;
            // resArray.startingPoints.length = 20
            // resArray.tasksArray.length = 20
            console.log(resArray);
            setResultArray(resArray)
        }

        rmsScheduling();
    }, [])


    return (
        <div className="simulation-container">
            <div className="section-container">
                <div className="section-left">
                    <p>Algorithm Name: {currentAlgo}</p>
                    {/* <p>CPU Utilization <br />Time: { }</p> */}
                </div>
                <div className="section-right">
                    <div className="label-container">
                        {
                            processes.map(p => {
                                return <div style={{ display: "flex" }}>{p.procName}: <div className="label-color-block" style={{ backgroundColor: p.color, marginLeft: "20px" }}></div></div>
                            })
                        }
                    </div>
                    {isStarted && (<div className="outputBar">
                        {
                            resultArray && resultArray.tasksArray && resultArray.tasksArray.map(points => {
                                let po = processes.find(p => p.priority === points)
                                let pName = po && po.procName;
                                return <p style={{ backgroundColor: po ? po.color : "gray" }}>{pName && (pName.charAt(0) + pName.charAt(pName.length - 1))}</p>;
                            })}
                    </div>)}
                    <div className="numberBar">{resultArray && resultArray.startingPoints && resultArray.startingPoints.map(points => <p>{points}</p>)}</div>
                </div>
            </div>
            <div className="section-footer" style={{ display: "flex", justifyContent: "center" }}>
                <div className="footer-right" style={{ padding: "10px" }}>
                    <button className="button">Reset</button>
                    <button className="button" onClick={handleSimStart}>Start</button>
                </div>
            </div>
        </div>
    );
};

export default EDF;
