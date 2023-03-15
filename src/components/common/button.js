function Button(props) {
    return (
        <div className="container">
            <button id={props.text} className="button" style={props.style} onClick={props.onClick}>{props.text}</button>
        </div>
    );
}

export default Button;
