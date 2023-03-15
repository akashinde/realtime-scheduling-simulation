import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../common/button";

function CreateProcess(props) {
    const navigate = useNavigate();

    const [processes, setProcesses] = props.processState;
    const [currentAlgo, setCurrentAlgo] = props.algoState;

    const fcfsInit = {
        procName: "",
        arrivalTime: "",
        burstTime: "",
        completed: false
    }

    const rmsInit = {
        procName: "",
        exeTime: "",
        period: "",
        completed: false
    }

    const edfInit = {
        procName: "",
        exeTime: "",
        period: "",
        completed: false
    }

    const [form, setForm] = useState({});

    function handleChange(e) {
        setForm({ ...form, [e.target.id]: !(e.target.value == "") ? (e.target.value) : 0 });
    }

    function handleDemo() {
        const fcfsDemo = [
            // { procName: "P1", arrivalTime: 0, burstTime: 7 },
            // { procName: "P2", arrivalTime: 2, burstTime: 4 },
            // { procName: "P3", arrivalTime: 3, burstTime: 1 },
            // { procName: "P4", arrivalTime: 5, burstTime: 4 }
            { procName: "P1", arrivalTime: 2, burstTime: 6 },
            { procName: "P2", arrivalTime: 5, burstTime: 2 },
            { procName: "P3", arrivalTime: 1, burstTime: 8 },
            { procName: "P4", arrivalTime: 3, burstTime: 0 },
            { procName: "P5", arrivalTime: 4, burstTime: 4 }
        ];

        const rmsDemo = [
            { procName: "P1", period: 5, exeTime: 1, arrivalTime: 0 },
            { procName: "P2", period: 10, exeTime: 2, arrivalTime: 0 },
            { procName: "P3", period: 8, exeTime: 1, arrivalTime: 0 },
            { procName: "P4", period: 20, exeTime: 2, arrivalTime: 0 }
        ];

        const edfDemo = [
            // { procName: "Task 1", period: 8, exeTime: 1, arrivalTime: 0 },
            // { procName: "Task 2", period: 15, exeTime: 3, arrivalTime: 0 },
            // { procName: "Task 3", period: 22, exeTime: 6, arrivalTime: 0 },
            { procName: "P1", period: 20, exeTime: 3, arrivalTime: 0 },
            { procName: "P2", period: 5, exeTime: 2, arrivalTime: 0 },
            { procName: "P3", period: 10, exeTime: 2, arrivalTime: 0 },
        ];
        // setProcesses(tasks);
        if (currentAlgo === "FCFS") setProcesses(fcfsDemo)
        else if (currentAlgo === "RMS") setProcesses(rmsDemo)
        else if (currentAlgo === "EDF") setProcesses(edfDemo)
    }

    function addProcess(e) {
        e.preventDefault();
        setProcesses([...processes, form]);
        if (currentAlgo === "FCFS") setForm(fcfsInit)
        else if (currentAlgo === "RMS") setForm(rmsInit)
        else if (currentAlgo === "EDF") setForm(edfInit)
    }

    function handleStart() {
        if (currentAlgo === "FCFS") navigate("/FCFS");
        else if (currentAlgo === "RMS") navigate("/RMS");
        else if (currentAlgo === "EDF") navigate("/EDF");
    }

    function handleCancel(e) {
        window.location.reload(false);

    }

    function handleDelete(e) {
        // console.log(e.target);
        let newProcesses = processes.filter(p => { return p.procName !== e.target.id })
        setProcesses(newProcesses);
    }

    useEffect(() => {
        if (currentAlgo === "FCFS") setForm(fcfsInit)
        else if (currentAlgo === "RMS") setForm(rmsInit)
    }, [])


    return (
        <div>
            {/* {console.log(form)}
            {console.log(processes)} */}
            <p className="heading">Create Process</p>
            {
                (currentAlgo === "FCFS") ? (<FCFSForm handleChange={handleChange} form={form} addProcess={addProcess} />) : ((currentAlgo === "RMS") ? <RMSForm handleChange={handleChange} form={form} addProcess={addProcess} /> : ((currentAlgo === "EDF") ? <EDFForm handleChange={handleChange} form={form} addProcess={addProcess} /> : ""))
            }
            <div className="process-container">
                {processes && processes.map((proc, index) => <ProcessContainer handleDelete={handleDelete} key={index} data={proc} currentAlgo={currentAlgo} />)}
            </div>
            <div className="create-process-start">
                <button className="button" onClick={handleDemo}>Demo</button>
                <button className="button" onClick={handleCancel}>Cancel</button>
                <button className="button" onClick={handleStart}>Start Simulation</button>
            </div>
        </div>
    );
}

function ProcessContainer({ data, currentAlgo, handleDelete }) {
    return (
        <div className="process">
            {
                (currentAlgo === "FCFS") ? (
                    <>
                        <div>{data.procName}</div>
                        <div>{data.arrivalTime}</div>
                        <div>{data.burstTime}</div>
                    </>
                ) : ((currentAlgo === "RMS") ? (
                    <>
                        <div>{data.procName}</div>
                        <div>{data.exeTime}</div>
                        <div>{data.period}</div>
                    </>
                ) : ((currentAlgo === "EDF") ? (
                    <>
                        <div>{data.procName}</div>
                        <div>{data.exeTime}</div>
                        <div>{data.period}</div>
                    </>
                ) : ("")))
            }

            <button id={data.procName} className="button" onClick={handleDelete}>Delete</button>
        </div>
    )
}

function FCFSForm({ handleChange, form, addProcess }) {
    return (
        <form className="create-process-container">
            <input className="input-block" type="text" placeholder="Process Name" onChange={handleChange} id="procName" value={form.procName} />
            <input className="input-block" type="text" placeholder="Arrival Time" onChange={handleChange} id="arrivalTime" value={form.arrivalTime} />
            <input className="input-block" type="text" placeholder="Burst Time" onChange={handleChange} id="burstTime" value={form.burstTime} />
            <Button text="Create" onClick={addProcess} />
        </form>
    )
}

function RMSForm({ handleChange, form, addProcess }) {
    return (
        <form className="create-process-container">
            <input className="input-block" type="text" placeholder="Process Name" onChange={handleChange} id="procName" value={form.procName} />
            <input className="input-block" type="text" placeholder="Execution Time" onChange={handleChange} id="exeTime" value={form.exeTime} />
            <input className="input-block" type="text" placeholder="Period" onChange={handleChange} id="period" value={form.period} />
            <Button text="Create" onClick={addProcess} />
        </form>
    )
}

function EDFForm({ handleChange, form, addProcess }) {
    return (
        <form className="create-process-container">
            <input className="input-block" type="text" placeholder="Process Name" onChange={handleChange} id="procName" value={form.procName} />
            <input className="input-block" type="text" placeholder="Execution Time" onChange={handleChange} id="exeTime" value={form.exeTime} />
            <input className="input-block" type="text" placeholder="Period" onChange={handleChange} id="period" value={form.period} />
            <Button text="Create" onClick={addProcess} />
        </form>
    )
}

export default CreateProcess;
