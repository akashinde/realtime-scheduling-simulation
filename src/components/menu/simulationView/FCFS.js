import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FCFS(props) {

    const [processes, setProcesses] = props.processState;
    const [currentAlgo, setCurrentAlgo] = props.algoState;
    const navigate = useNavigate();

    let sortedProcesses = [...processes];
    sortedProcesses.sort(function (a, b) {
        return a.arrivalTime - b.arrivalTime;
    });

    const [avgWaitTime, setAvgWaitTime] = useState(0);
    const [avgTAT, setAvgTAT] = useState(0);
    const [totalExeTime, setTotalExeTime] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [index, setIndex] = useState(0);

    function fcfsScheduling() {
        let completionTimes = {};
        let waitingTimes = {};
        let turnAroundTimes = {};
        let totalWait = 0;
        let totalTAT = 0;
        let currentTime = 0;
        for (let i = 0; i < sortedProcesses.length; i++) {
            const process = processes[i];
            if (currentTime < process.arrivalTime) {
                currentTime = process.arrivalTime;
            }
            completionTimes[process.procName] = currentTime + process.burstTime;
            waitingTimes[process.procName] = currentTime - process.arrivalTime;
            turnAroundTimes[process.procName] = completionTimes[process.procName] - process.arrivalTime;

            currentTime += process.burstTime;
            totalWait = totalWait + waitingTimes[process.procName];
            totalTAT = totalTAT + turnAroundTimes[process.procName];
        }

        setTimeout(() => {
            setAvgWaitTime(totalWait / processes.length);
            setAvgTAT(totalTAT / processes.length);
            setTotalExeTime(currentTime);
        }, 2000)

        let oldProc = [...processes];
        oldProc.map((p) => {
            p.waitTime = waitingTimes[p.procName];
            p.completionTimes = completionTimes[p.procName];
        })
        setProcesses(oldProc);
    }

    function handleSimStart() {
        setIsStarted(true);
        fcfsScheduling();
    }

    function handleReset() {
        navigate("/")
        window.location.reload()
    }

    useEffect(() => {
        if (isStarted) {
            const [processes, setProcesses] = props.processState;

            var len = processes.length;
            var sortedIndices = new Array(len);
            for (var i = 0; i < len; ++i) sortedIndices[i] = i;
            sortedIndices.sort(function (a, b) { return processes[a].arrivalTime < processes[b].arrivalTime ? -1 : processes[a].arrivalTime > processes[b].arrivalTime ? 1 : 0; });

            const delay = setTimeout(() => {
                if (index === processes.length) {
                    clearTimeout(delay);
                    setIndex(0);
                    setIsStarted(false);
                    return;
                }
                processes[sortedIndices[index]].completed = true;
                setProcesses(processes);
                setIndex(index + 1);
            }, 2000);
            return () => clearTimeout(delay)
        }
    }, [processes, index])


    return (
        <div className="simulation-container">
            <div className="section-container">
                <div className="section-left">
                    <p>Algorithm Name: {currentAlgo}</p>
                    <p>Average Waiting <br />Time: {avgWaitTime}</p>
                    <p>Average Turnaround <br />Time: {avgTAT}</p>
                    <p>Total Execution <br />Time: {totalExeTime}</p>
                </div>
                <div className="section-right">
                    <table className="scheduling-table">
                        <tr>
                            <th>Process Name</th>
                            <th>Arrival Time</th>
                            <th>Burst Time</th>
                            <th>Waiting Time</th>
                            <th>Status</th>
                        </tr>
                        {
                            processes.map((p) => {
                                return (<tr>
                                    <td>{p.procName}</td>
                                    <td>{p.arrivalTime}</td>
                                    <td>{p.burstTime}</td>
                                    <td>{p.waitTime}</td>
                                    <td>
                                        <div className="bar-bg">
                                            {p.completed && <div className="barAnimated">
                                            </div>}
                                        </div>
                                    </td>
                                </tr>)
                            })}
                    </table>
                </div>
            </div>
            <div className="section-footer">
                <div className="footer-left">
                    <p className="ready-queue">Ready Queue</p>
                    {
                        sortedProcesses.map(p => <p className="ready-queue-tasks">{p.procName}</p>)
                    }
                </div>
                <div className="footer-right">
                    <button className="button" onClick={handleReset}>Reset</button>
                    <button className="button" onClick={handleSimStart}>Start</button>
                </div>
            </div>
        </div>
    );
}

export default FCFS;