console.log(window.location)

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
}
sockect.onerror = function(e){
    console.log("error", e)
}
sockect.onclose = function(e){
    console.log("close", e)
}