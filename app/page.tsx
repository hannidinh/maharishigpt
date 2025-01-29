"use client"
import Image from "next/image"
import logo from "./assets/logo2.png"
import { useChat } from "ai/react"
import { Message } from "ai"
import Bubble from "./components/Bubble"
import LoadingBubble from "./components/LoadingBubble"
import PromptSuggestionsRow from "./components/PromptSuggestionsRow"

const Home = () => {
    const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat()
    const noMessages = !messages || messages.length === 0

    const handlePrompt = (promptText) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user"
        }
        append(msg)
    }

    return (
        <main>
            <Image src={logo} width="250" alt="Maharishi gpt logo" />
            <section className={noMessages ? "" : "populated"}>
                {noMessages ? (
                    <>
                        <p className="starter-text">
                            Ask me anything about Maharishi International University. I hope you enjoy.
                        </p>
                        <br />
                        <PromptSuggestionsRow onPromptClick={handlePrompt} />
                    </>
                ) : (
                    <>
                        {messages.map((message, index) => <Bubble key={`message-${index}`} message={message} />)}
                        {isLoading && <LoadingBubble />}
                    </>
                )}
            </section>
            <form onSubmit={handleSubmit}>
                <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask me anything about Maharishi International University" />
                <input type="submit" />
            </form>
            <footer className="footer">
                <p>
                    &copy; Hanni Dinh 2025 |
                    <a href="https://www.linkedin.com/in/hannidinhcs/" target="_blank" rel="noopener noreferrer">
                        Connect with me on LinkedIn
                    </a>
                </p>
            </footer>
        </main>
    )
}

export default Home