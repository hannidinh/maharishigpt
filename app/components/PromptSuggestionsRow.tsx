import PromptSuggestionButton from "./PromptSuggestionButton";
const PromptSuggestionsRow = ({ onPromptClick }) => {
    const prompts = [
        "Is MIU an accredited university?",
        "What is Consciousness-Based Education at MIU?",
        "What are the admission requirements for MIU?",
        "What is the tuition cost at MIU?",
        "Are there scholarships or financial aid options available?",
        "What is the ComPro (Computer Professionals) program at MIU?"
    ]
    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) =>
                <PromptSuggestionButton
                    key={`suggestion-${index}`}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
                />)}
        </div>
    )
}

export default PromptSuggestionsRow;