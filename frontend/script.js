const input = document.querySelector("#input")
const chatContainer = document.querySelector("#chat-container")
const askBtn = document.querySelector("#ask")

input?.addEventListener('keyup', handleEnter)
askBtn.addEventListener('click', handleAsk)

function generate(text){
    /**
     * 1. Append message to ui
     * 2. Send 
     */

    const msg = document.createElement('div')
    msg.className = `my-6 bg-neutral-700 p-3 rounded-xl ml-auto max-w-fit`
    msg.textContent = text

    chatContainer.appendChild(msg)
    input.value = '';

}

function handleAsk(e){
    const text = input.value.trim();
        if(!text){
            return
        }

    generate(text)
}

function handleEnter(e){
    if(e.key == "Enter"){
        const text = input.value.trim();
        if(!text){
            return
        }

        generate(text)
    }
}