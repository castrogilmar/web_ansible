function appendMessage(msgReceived, msgUser) {
    newMessage = $(`
                <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="dropdown-list-image mr-3">
                    <img class="rounded-circle" src="https://source.unsplash.com/fn_BT9fwg_E/60x60" alt="">
                    <div class="status-indicator bg-success"></div>
                  </div>
                  <div class="font-weight-bold">
                    <div class="text-truncate">${msgReceived}</div>
                    <div class="small text-gray-500">${msgUser}</div>
                  </div>
                </a>
    `)

    console.log(newMessage)
    $("#messages-list").append(newMessage)

    $("#counter-message").text((parseInt($("#counter-message").text())|0)+1)
}
var loc = window.location

var wsStart='ws://'

if (loc.protocol == 'https:') 
    wsStart='wss://'

var endpoint=`${wsStart}${loc.host}${loc.pathname}`
var sockect = new WebSocket(endpoint)
var formData = $("#search-form")
var msgInput = $("#search-input")

var formData2 = $("#search-form-2")
var msgInput2 = $("#search-input-2")

sockect.onopen = function(e){
    console.log("open", e)

    formData.submit(function(event){
        event.preventDefault()

        var msgTxt=msgInput.val()

        var finalData = {
            'message': msgTxt
        }
        sockect.send(JSON.stringify(finalData))

        msgInput.val("")
    })

    formData2.submit(function(event){
        event.preventDefault()

        var msgTxt=msgInput2.val()
        var finalData = {
            'message': msgTxt
        }
        sockect.send(JSON.stringify(finalData))

        msgInput2.val("")
    })
}
sockect.onmessage = function(e){
    console.log("message", e)
    console.log(e.data)
    

    var chatDataMsg = JSON.parse(e.data)

    appendMessage(chatDataMsg.message, chatDataMsg.username)
}
sockect.onerror = function(e){
    console.log("error", e)
}
sockect.onclose = function(e){
    console.log("close", e)
}