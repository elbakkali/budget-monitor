// Budget controller
let budgetController = (() => {
    let Expense = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    let Income = function(id, description, value)  {
        this.id = id
        this.description = description
        this.value = value
    }

    let calculateTotal = (type) => {
        let sum = 0;
        
        data.allItems[type].forEach((current) => {
            sum = sum + parseFloat(current.value)
        });
        data.totals[type] = sum;
    }   

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 
    }

    return {
        addItem: (type, description, value) => {
            let newItem, ID


            // id = last id + 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0
            }

            if (type === 'exp') {
                newItem = new Expense(ID, description, value)                
            } else if (type === 'inc') {
                newItem = new Income(ID, description, value)                
            }

            data.allItems[type].push(newItem)
            return newItem
        },

        deleteItem: (type, id) => {
            let ids, index
            
            ids = data.allItems[type].map((current) => {
                return current.id
            })

            index = ids.indexOf(id)

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },

        calculateBudget: () => {
            // Calculate total incomes and expenses
            calculateTotal('exp')
            calculateTotal('inc')

            // Calculate the budget (income - expenses)
            data.budget = data.totals.inc - data.totals.exp

            // Calculate the percentage of incone we spent
            if (data.totals.inc > 0) {
                let prct = (data.totals.exp / data.totals.inc) * 100
                prct = Math.round(prct)
                data.percentage = prct
            } else {
                data.percentage = -1
            }
        },

        calculatePercentages: function() {
            

            
            data.allItems.exp.forEach(function(cur) {
               cur.calcPercentage(data.totals.inc);
            });
        },
        
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: () => {
            console.log(data);
        }
    };
})()

// UI controller
let UIController = (() => {
    let DOMstrings = {
        inputType: '.add_type',
        inputDescription: '.add_description',
        inputValue: '.add_value',
        inputBtn: '.add_btn',
        incomeContainer: '.income_list',
        expensesContainer: '.expenses_list',
        budgetLabel: '.budget_value',
        incomeLabel: '.budget_income-value',
        expensesLabel: '.budget_expenses-value',
        percentageLabel: '.budget_expenses-percentage',
        container: '.container',
        expensesPercLabel: '.item_percentage',
        dateLabel: '.budget_title-month'
    }

    let formatNumber = (num, type) => {
        let numSplit, int, dec
        num = Math.abs(num)
        num = num.toFixed(2)

        numSplit = num.split('.')
        int = numSplit[0]
        if(int.length > 3) {
            console.log('int')
            // input 2310, output 2,310
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
        }

        dec = numSplit[1]

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec
    }
    
    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMstrings.inputType).value,  // Either income or expense
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },
        addListItem: (obj, type) => {
            let html, newhtml, element

            if (type === 'inc') {
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item_description">%description%</div> <div class="right clearfix"> <div class="item_value">%value%</div> <div class="item_delete"> <button class="item_delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item_description">%description%</div> <div class="right clearfix"> <div class="item_value">%value%</div> <div class="item_percentage">21%</div> <div class="item_delete"> <button class="item_delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }

            newhtml = html.replace('%id%', obj.id)
            newhtml = newhtml.replace('%description%', obj.description)
            newhtml = newhtml.replace('%value%', formatNumber(obj.value, type))

            document.querySelector(element).insertAdjacentHTML('beforeend', newhtml)
        },
        deleteListItem: (selectorID) => {
            let el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
        },
        clearFields: () => {
            let fields, fieldsArray
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            fieldsArray = Array.prototype.slice.call(fields)

            fieldsArray.forEach((current, index, array) =>{
                current.value = ''
            })

            fieldsArray[0].focus()
        },
        displayBudget: (obj) => {
            let type = obj.budget > 0 ? 'inc' : 'exp'
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type)
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc')
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp')

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }
        },
        displayPercentages: (percentages) => {
            let fields = document.querySelectorAll(DOMstrings.expensesPercLabel)

            let nodeListForEach = (list, callback) => {
                for(let i = 0; i < list.length; i++) {
                    callback(list[i], i)
                }
            }

            nodeListForEach(fields, (current, index) => {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'
                } else {
                    current.textContent = '---'
                }
            })
        },
        displayMonth: () => {
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            let now = new Date()
            let year = now.getFullYear()
            let month = now.getMonth()
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year
        },
        getDOMstrings: () => {
            return DOMstrings
        },
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
                ctrlAddItem()
            }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    }

    let updateBudget = () => {
        budgetCtrl.calculateBudget()
        let budget = budgetCtrl.getBudget()
        UIController.displayBudget(budget)
    }

    var updatePercentages = function() {
        budgetCtrl.calculatePercentages();
        var percentages = budgetCtrl.getPercentages();
        UICtrl.displayPercentages(percentages)
    };

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

        // 2. Add the item to the budget controller
        let newItem = budgetCtrl.addItem(input.type, input.description, input.value)

        // 3. add the item to the UI
        UIController.addListItem(newItem, input.type)
        UIController.clearFields()

        // 4. Calculate and update budget
        updateBudget()

        // 5. Calculate and update percentages
        updatePercentages();
    }

    let ctrlDeleteItem = (event) => {
        let itemID, splitID, type, ID
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
        if(itemID) {
            splitID = itemID.split('-')
            type = splitID[0]
            ID = parseInt(splitID[1])

            budgetController.deleteItem(type, ID)
            UIController.deleteListItem(itemID)
            updateBudget()
        }
    }

    return {
        init: () => {
            UICtrl.displayMonth()
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListeners()
        }
    }
})(budgetController, UIController)

controller.init()