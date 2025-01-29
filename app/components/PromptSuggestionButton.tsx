const PromptSuggestionButton = ({ text, onClick }) => {
    return (
        <button
            className="prompt-suggestion-button"
            onClick={onClick}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f55e06")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f6af64")}
        >
            {text}
        </button>
    );
}

export default PromptSuggestionButton;