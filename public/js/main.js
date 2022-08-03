const deleteBtn = document.querySelectorAll('.fa-trash') //declares and assigns variable to select all .fa-trash icons on the app page
const item = document.querySelectorAll('.item span') //declares and assigns variable to select all span elements within elements with a .item class
const itemCompleted = document.querySelectorAll('.item span.completed') // declares and assigned variable to select all span elements within elements with a .item class with a .completed class

Array.from(deleteBtn).forEach((element)=>{ //create an array of all of the items selected by the deleteBtn variable, and for each do the following 
    element.addEventListener('click', deleteItem) //for each element, add an event listener that will run deleteItem() function when the element is clicked
})

Array.from(item).forEach((element)=>{ //create an array of all of the items selected by the item variable, and for each do the following 
    element.addEventListener('click', markComplete) //for each element, add an event listener that will run markComplete() function when the element is clicked
})

Array.from(itemCompleted).forEach((element)=>{ //create an array of all of the items selected by the itemCompleted variable, and for each do the following 
    element.addEventListener('click', markUnComplete) //for each element, add an event listener that will run markUncomplete() function when the element is clicked
})

async function deleteItem(){ //define  & declare asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //declares and assigns variable to text of item that is clicked on (this = item clicked on, innerText is likely the to do task itself)
    try{ //do the following
        const response = await fetch('deleteItem', { //declare and assign variable to an asynchronous function that sends a deleteItem request to the server with the following information as an object
            method: 'delete', //method type of delete
            headers: {'Content-Type': 'application/json'}, //content type of json
            body: JSON.stringify({ // body is converted to JSON
              'itemFromJS': itemText //itemFromJS is set to itemText defined in line 18 (would be the to do task itself)
            })
          })
        const data = await response.json() //declare and assign variable to an asynchronous function that waits for a response from the server and sends the respons as a json file
        console.log(data) // console log data received from server
        location.reload() // reloads page

    }catch(err){ //if error is received, do the following
        console.log(err) // console log the error receieved
    }
}

async function markComplete(){ //define & declare asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText //declares and assigns variable to text of item that is clicked on (this = item clicked on, innerText is likely the to do task itself)
    try{ //do the following
        const response = await fetch('markComplete', { //declare and assign variable to an asynchronous function that sends a markComplete request to the server with the following information as an object
            method: 'put', //method is put
            headers: {'Content-Type': 'application/json'}, //content type is json
            body: JSON.stringify({ // body is a json file containing the following
                'itemFromJS': itemText //itemFromJS with value of to do task (defined in line 37)
            })
          })
        const data = await response.json() //declare and assign variable to an asynchronous function that waits for a response from the server and sends the respons as a json file
        console.log(data) // console log data received from server
        location.reload() // reloads page

    }catch(err){ //if error is received, do the following
        console.log(err) // console log the error receieved
    }
}

async function markUnComplete(){ //define & declare asynchronous function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //declares and assigns variable to text of item that is clicked on (this = item clicked on, innerText is likely the to do task itself)
    try{ //do the following
        const response = await fetch('markUnComplete', { //declare and assign variable to an asynchronous function that sends a markComplete request to the server with the following information as an object
            method: 'put', //method is put
            headers: {'Content-Type': 'application/json'}, //content type is json
            body: JSON.stringify({ //body is a json file containing the following
                'itemFromJS': itemText //itemFromJS with value of to do task (defined in line 56)
            })
          })
        const data = await response.json() //declare and assign variable to an asynchronous function that waits for a response from the server and sends the respons as a json file
        console.log(data) // console log data received from server
        location.reload() //reloads page

    }catch(err){ //if error is received, do the following
        console.log(err) // console log the error receieved
    }
}