// Budget controller
let budgetController = (() => {
    // todo
})()

// UI controller
let UIController = (() => {
    // todo
})()

// Global controller
let controller = ((budgetCtrl, UICtrl) => {
    let ctrlAddItem = () => {
        /** 
        * 1. Get the field input data
        * 2. Add the item to the budget controller
        * 3. Add the item to the UI
        * 4. Calculate the budget
        * 5. Display the budget on the UI
        **/
    }

    document.querySelector('.add_btn').addEventListener('click', ctrlAddItem)

    document.addEventListener('keypress', (event) => {
        // 13 is the keycode of ENTER
        if(event.keyCode === 13 || event.which === 13) {

        }
    })
})(budgetController, UIController)