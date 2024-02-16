const instruction =
    "Responda a pergunta baseado nas instruções:\n" +
    " - Use linguamgem simples, moderna, atual como se estivesse conversando com um amigo;\n" +
    " - Responda somente pergunta que tenham embasamento bíblico e nos ensinamentos de Jesus e de Deus;\n" +
    " - Não responda nenhum outro tipo de pergunta;\n" +
    " - Mantenha seu foco em compartilhar conhecimento e compreensão dos ensinamentos bíblicos, mas faça isso de uma maneira mais informal e acessível;\n" +
    " - Evite jargões religiosos complexos e opte por um tom mais casual e amigável;\n" +
    " - Não responda nenhuma pergunta que não sigam as instruções anteriores;\n" +
    " - Não faça uma introdução sobre a pergunta antes de dizer que não pode responder, simplesmente dica educadamente que não pode responder;\n" +
    "A abordagem é ser um companheiro espiritual, facilitando o entendimento dos ensinamentos bíblicos de uma forma que ressoe com a vida cotidiana das pessoas.\n" +
    "Pule uma linha nofinal de cada frase.\n" +
    "Essa é a pergunta:"

async function sendMessage() {
    const userInput = document.getElementById("user-input").value
    if (userInput.trim() === "") {
        alert("Por favor, digite uma mensagem.")
        return
    }

    displayMessage(userInput, "user") // Exibe a mensagem do usuário
    document.getElementById("user-input").value = "" // Limpar o campo de entrada

    const loadingMessageElement = showLoadingMessage() // Mostra a mensagem de carregamento

    try {
        const response = await getChatGPTResponse(userInput)
        if (loadingMessageElement) {
            loadingMessageElement.remove() // Remove a mensagem de carregamento
        }
        displayMessage(response, "assistant") // Exibe a resposta do assistente
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error)
        displayMessage("Desculpe, ocorreu um erro. Tente novamente.", "error") // Exibe mensagem de erro
    }
}

function showLoadingMessage() {
    const messagesDiv = document.getElementById("messages")
    const loadingDiv = document.createElement("div")
    loadingDiv.textContent = "Carregando..."
    loadingDiv.id = "loading-message"
    messagesDiv.appendChild(loadingDiv)
    return loadingDiv
}

// Função para exibir mensagens na interface
function displayMessage(message, role) {
    document.getElementById("placeholder-message").style.display = "none" // Esconde a frase de placeholder
    const messagesDiv = document.getElementById("messages")
    const loadingMessage = document.getElementById("loading-message")
    if (loadingMessage) {
        messagesDiv.removeChild(loadingMessage) // Remove a mensagem de carregando se ela existir
    }

    const messageDiv = document.createElement("div")
    messageDiv.textContent = message
    messageDiv.className = role // Pode ser usado para estilos diferentes
    messagesDiv.appendChild(messageDiv)

    messagesDiv.scrollTop = messagesDiv.scrollHeight // Rolar para a mensagem mais recente
}

// Função para obter resposta da API OpenAI
async function getChatGPTResponse(userInput) {
    const combinedInput = instruction + " " + userInput
    console.log(combinedInput)
    try {
        const response = await fetch(
            "https://vercel.com/matheus-torres-projects/biblify/9zWgCMagwXe4pRMCJAqCMJZMSUBQ/get-response",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        { role: "user", content: combinedInput }, // Corrigido para evitar duplicação de instrução
                    ],
                }),
            }
        )
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data.choices
            ? data.choices[0].message.content
            : "Resposta não encontrada." // Adiciona verificação para `choices`
    } catch (error) {
        console.error("Erro ao obter resposta:", error)
        return "Houve um erro ao processar sua solicitação."
    }
}
