// Procurar o botão - clicar - executa  uma 
// função que duplica campo e coloca na tela num lugar especificado
document.querySelector("#add-time")
.addEventListener('click', cloneField)

function cloneField() {
    /* println = console.log("Cheguei aqui") */
    // Node = qualquer elemento do html
    const newFieldContainer = document.querySelector(".schedule-item").cloneNode(true)

    const fields = newFieldContainer.querySelectorAll("input")

    fields.forEach(function(field) {
        field.value = ""
    })

    //append child = adiciona filho 
    document.querySelector("#schedule-items").appendChild(newFieldContainer)
}



