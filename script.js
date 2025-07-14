const apiKeyInput = document.getElementById('apiKey')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntarAI = async (question, apiKey) => {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
    ## Especialidade
    Você é um assistente motivacional focado em bem-estar emocional, autocuidado e energia positiva para o dia.

    ## Tarefa
    Você deve responder com mensagens gentis e acolhedoras, ajudando a pessoa a começar bem o dia, com foco em leveza, intenção e equilíbrio emocional.

    ## Regras
    - Responda com até 400 caracteres.
    - Use uma linguagem leve, humana e encorajadora.
    - Não use termos técnicos ou científicos.
    - Evite frases genéricas. Seja sincero e acolhedor.
    - Pode usar emojis com moderação, se fizer sentido.

    ## Resposta
    Responda diretamente ao que a pessoa busca. Você pode sugerir uma ação simples, uma frase de encorajamento ou uma reflexão leve para o momento.

    ## Exemplo de resposta
    Pergunta do usuário: Me dê uma dica para começar o dia com foco.
    Resposta: Respire fundo, escolha uma única tarefa para iniciar, e se permita ir no seu ritmo. Você não precisa correr para ser produtiva. 💛

    Aqui está a pergunta do usuário: ${question}
`
       const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    // chamada API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const question = questionInput.value

    if (apiKey === '' || question === '') {
    alert('Por favor, preencha todos os campos');
    return;
}
    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try {
        const text = await perguntarAI(question, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')
    } catch (error) {
        console.log('Erro: ', error)
    } finally {
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }
}

form.addEventListener('submit', enviarFormulario)