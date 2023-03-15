import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function RMS(props) {
  const [processes, setProcesses] = props.processState;
  const [currentAlgo, setCurrentAlgo] = props.algoState;
  const [resultArray, setResultArray] = useState({});
  const [cpuUtilization, setCpuUtilization] = useState();

  const navigate = useNavigate();


  let sortedProcesses = [...processes];
  sortedProcesses.sort(function (a, b) {
    return a.arrivalTime - b.arrivalTime;
  });

  const [isStarted, setIsStarted] = useState(false);

  function lcmOfList(arr) {
    if (arr.length === 0) return 0;
    if (arr.length === 1) return arr[0];
    let lcm = arr[0];
    for (let i = 1; i < arr.length; i++) {
      lcm = (lcm * arr[i]) / gcd(lcm, arr[i]);
    }
    return lcm;
  }

  function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  }

  function handleSimStart() {
    setIsStarted(true);
  }

  function handleReset() {
    navigate("/")
    window.location.reload()
}

  useEffect(() => {
    function rmsScheduling() {
      const [processes, setProcesses] = props.processState;
      let colors = [];
      let n = processes.length;
      for (let i = 0; i < processes.length; i++) {
        let randomColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
        colors.push(randomColor);
      }
      // const colors = ["#F55050", "#85CDFD", "#B5F1CC"]
      processes.map((p, i) => (p.color = colors[i]));
      // [1, 8, 0, 1]
      // [3, 15, 0, 2]
      // [6, 22, 0, 3]
      // console.log(processes)
      processes.sort(function (a, b) {
        return a.period - b.period;
      });
      let u = 0;
      for (let i = 0; i < processes.length; i++) {
        u += processes[i].exeTime / processes[i].period;
      }
      setCpuUtilization(u);
      processes.forEach((p, index) => {
        p.priority = index + 1;
      });

      let proc = processes.map((p) => {
        return [p.exeTime, p.period, p.arrivalTime, p.priority];
      });
      // console.log(proc)
      console.log("utiliation: ", u);
      if (u <= 1) {
        let Ub = n * (Math.pow(2, 1 / n) - 1);
        console.log(Ub);
        if (u <= Ub) {
          let n = proc.length;
          let execution = [];
          let startingPoints = [];
          let tasksArray = [];
          let resArray = {};
          let arrivalArray = [];
          let i = 0;

          for (const i of Array(n).keys()) {
            execution.push(proc[i][0]);
            arrivalArray.push(proc[i][2]);
          }

          let LCM = lcmOfList(
            proc.map((p) => {
              return p[1];
            })
          );
          // console.log(LCM)

          let ind;

          let Result = [];

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

          // console.log("Timeline length: ", LCM);

          for (const i of Array(LCM).keys()) {
            startingPoints.push(i);
            if (Result[i] != -1) {
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
          // console.log(resArray);
          setResultArray(resArray);
        } else {
          console.log("Cannot Schedule");
        }
      } else {
        console.log("Cannot schedule");
      }
    }

    rmsScheduling();
  }, []);

  return (
    <div className="simulation-container">
      <div className="section-container">
        <div className="section-left">
          <p>Algorithm Name: {currentAlgo}</p>
          <p>
            Utilization Factor <br />
            {cpuUtilization}
          </p>
        </div>
        <div className="section-right">
          <div className="label-container">
            {processes.map((p) => {
              return (
                <div style={{ display: "flex" }}>
                  {p.procName}:
                  <div
                    className="label-color-block"
                    style={{ backgroundColor: p.color }}
                  ></div>
                </div>
              );
            })}
          </div>
          <div className="bar-container">
            {isStarted && (
              <div className="outputBar">
                {resultArray &&
                  resultArray.tasksArray &&
                  resultArray.tasksArray.map((points, index) => {
                    let po = processes.find((p) => p.priority === points);
                    let pName = po && po.procName;
                    return (
                      <div>
                        <div
                          className="outputBar-name"
                          style={{
                            backgroundColor: po ? po.color : "white",
                            marginBottom: "15px"
                          }}
                        >
                          {pName ?
                            pName.charAt(0) + pName.charAt(pName.length - 1) : " "}
                        </div>
                        <div className="numberBar-numbers">{index}</div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="section-footer"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="footer-right" style={{ padding: "10px" }}>
          <button className="button" onClick={handleReset}>Reset</button>
          <button className="button" onClick={handleSimStart}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default RMS;
