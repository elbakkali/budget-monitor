// Budget controller
let budgetController = (() => {
    // todo
})()

// UI controller
let UIController = (() => {
    let DOMstrings = {
        inputType: '.add_type',
        inputDescription: '.add_description',
        inputValue: '.add_value',
        inputBtn: '.add_btn',
    }
    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMstrings.inputType).value,  // Either income or expense
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        getDOMstrings: () => {
            return DOMstrings
        }
    }
})()

// Global controller
let controller = ((budgetCtrl, UICtrl) => {
    let setupEventListeners = () => {
        let DOM = UIController.getDOMstrings()

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', (event) => {
            // 13 is the keycode of ENTER
            if(event.keyCode === 13 || event.which === 13) {

            }
        })
    }

    
    let ctrlAddItem = () => {
        /** 
        * 1. Get the field input data
        * 2. Add the item to the budget controller
        * 3. Add the item to the UI
        * 4. Calculate the budget
        * 5. Display the budget on the UI
        **/

       // 1. Get the field input data
       let input = UICtrl.getInput()
    }

    return {
        init: () => {
            setupEventListeners()
        }
    }
})(budgetController, UIController)

controller.init()