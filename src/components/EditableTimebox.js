import React from "react";
import Clock from "./Clock";
import classNames from "classnames";

function ProgressBar({ className = "", percent = 33, big=false, color = null }) {
    let progressClassName = classNames(
        "progress",
        className,
        {
            "progress--big": big,
            "progress--color-red": color === "red"
        }
    );
    return (
        <div className={progressClassName}>
            <div className="progress__bar" style={{width: `${percent}%`}}></div>
        </div>
    );
}

function TimeboxEditor(props) {
    const { 
        title, 
        totalTimeInMinutes,
        isEditable,
        onTitleChange,
        onTotalTimeInMinutesChange,
        onConfirm
    } = props;
    return (
        <div className={`TimeboxEditor ${isEditable ? "" : "inactive"}`}>
            <label>
                Co robisz?
                <input 
                    disabled={!isEditable} 
                    value={title}
                    onChange={onTitleChange} 
                    type="text" 
                />
            </label><br/>
            <label>
                Ile minut?
                <input 
                    disabled={!isEditable} 
                    value={totalTimeInMinutes}
                    onChange={onTotalTimeInMinutesChange} 
                    type="number" 
                />
            </label><br />
            <button 
                onClick={onConfirm}
                disabled={!isEditable}
            >Zatwierdź zmiany</button>
        </div>
    )
}

class CurrentTimebox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRunning: false,
            isPaused: false,
            pausesCount: 0,
            elapsedTimeInSeconds: 0
        }
        this.handleStart = this.handleStart.bind(this)
        this.handleStop = this.handleStop.bind(this)
        this.togglePause = this.togglePause.bind(this)
    }
    handleStart(event) {
        this.setState({
            isRunning: true
        })
        this.startTimer();
    }
    handleStop(event) { 
        this.setState({
            isRunning: false,
            isPaused: false,
            pausesCount: 0,
            elapsedTimeInSeconds: 0
        })
        this.stopTimer();
    }
    startTimer() {
        this.intervalId = window.setInterval(
            () => {
                this.setState(
                    prevState => ({ elapsedTimeInSeconds: prevState.elapsedTimeInSeconds + 0.1 })
                )
            },
            100
        );
    }
    stopTimer() {
        window.clearInterval(this.intervalId);
    }
    togglePause() {
        this.setState(
            function(prevState) {
                const isPaused = !prevState.isPaused;
                if (isPaused) {
                    this.stopTimer();
                } else {
                    this.startTimer();
                }
                return {
                    isPaused,
                    pausesCount: isPaused ? prevState.pausesCount + 1 : prevState.pausesCount
                }
            }
        )
    }
    render() {
        const { isPaused, isRunning, pausesCount, elapsedTimeInSeconds } = this.state;
        const { title, totalTimeInMinutes, isEditable, onEdit } = this.props;
        const totalTimeInSeconds = totalTimeInMinutes * 60;
        const timeLeftInSeconds = totalTimeInSeconds - elapsedTimeInSeconds;
        const minutesLeft = Math.floor(timeLeftInSeconds / 60);
        const secondsLeft = Math.floor(timeLeftInSeconds % 60);
        const progressInPercent = (elapsedTimeInSeconds / totalTimeInSeconds) * 100.0;
        return (
            <div className={`CurrentTimebox ${isEditable ? "inactive" : ""}`}>
                <h1>{title}</h1>
                <Clock minutes={minutesLeft} seconds={secondsLeft} className={isPaused ? "inactive" : ""}/>
                <ProgressBar 
                    percent={progressInPercent} 
                    className={isPaused ? "inactive" : ""}
                    color="red"
                    big
                />
                <button onClick={onEdit} disabled={isEditable}>Edytuj</button>
                <button onClick={this.handleStart} disabled={isRunning}>Start</button>
                <button onClick={this.handleStop} disabled={!isRunning}>Stop</button>
                <button onClick={this.togglePause} disabled={!isRunning}>{isPaused ? "Wznów" : "Pauzuj"}</button>
                Liczba przerw: {pausesCount}
            </div>
        )
    }
}

class EditableTimebox extends React.Component {
    state = {
        title: "Uczę się Testować!",
        totalTimeInMinutes: 20,
        isEditable: true
    }
    handleTitleChange = (event) => {
        this.setState({ title: event.target.value });
    }
    handleTotalTimeInMinutesChange = (event) => {
        this.setState({ totalTimeInMinutes: event.target.value });
    }
    handleConfirm = () => {
        this.setState({ isEditable: false });
    }
    handleEdit = () => {
        this.setState({ isEditable: true });
    }
    render() {
        const { title, totalTimeInMinutes, isEditable } = this.state;
        return (
            <>
                <TimeboxEditor 
                    title={title}
                    totalTimeInMinutes={totalTimeInMinutes}
                    isEditable={isEditable}
                    onConfirm={this.handleConfirm}
                    onTitleChange={this.handleTitleChange}
                    onTotalTimeInMinutesChange={this.handleTotalTimeInMinutesChange}
                />
                <CurrentTimebox 
                    isEditable={isEditable}
                    title={title} 
                    totalTimeInMinutes={totalTimeInMinutes} 
                    onEdit={this.handleEdit}
                />
            </>
        )
    }
}

export default EditableTimebox;