
const button = document.querySelector('.addButton')
const addIngrName = document.querySelector('.ingredientFieldName')
const addIngrQuantity = document.querySelector('.ingredientFieldQuantity')

button.addEventListener('click', () => {
    const ingrFieldName = document.createElement('input')
    ingrFieldName.type = 'text'
    ingrFieldName.name = 'ingrName'
    ingrFieldName.id = 'ingrName'
    ingrFieldName.placeholder = 'Name'

    const ingrFieldQuantity = document.createElement('input')
    ingrFieldQuantity.type = 'text'
    ingrFieldQuantity.name = 'ingrQuantity'
    ingrFieldQuantity.id = 'ingrQuantity'
    ingrFieldQuantity.placeholder = 'Gr.'

    const addIngrName = document.querySelector('.ingredientFieldName')
    addIngrName.appendChild(ingrFieldName)
    addIngrQuantity.appendChild(ingrFieldQuantity)

});


