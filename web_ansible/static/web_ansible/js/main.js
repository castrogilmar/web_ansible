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


function appendTasksDiv(jsonData) {
    var playbook_name="example"
    var id_task=1

    $(".tasks").remove()

    $.each(jsonData, (a, b) => {
        console.log(b)

        newMessage = $(`
                <div data-id-tasks="${id_task}" class="row tasks"> 
                    <div class="col-lg-6 mb-4">              
                        <div class="card shadow mb-4">
                            <div class="card-header py-3">
                            <div>
                            <h6 class="m-0 font-weight-bold text-primary">${playbook_name}: ${b.name}</h6>
                            </div>
                            <div></div>
                            </div>
                            <div class="card-body">
                            <div id="status-task" class="text-right">
                                
                            </div>
                            <p>Add some quality, svg illustrations to your project courtesy of  constantly updated collection of beautiful svg images that you can use completely free and without attribution!</p>
                            </div>
                        </div>
                    </div>
                </div>
        `)

        id_task+=1

        $("#div-content").append(newMessage)
    })


}

$("#id-btn-get-tasks").on("click", (e) => {
    alert("OPA")
})


var loc = window.location
var userName=$("#user-name").text()

var wsStart='ws://'

if (loc.protocol == 'https:') 
    wsStart='wss://'

var endpoint=`${wsStart}${loc.host}${loc.pathname}/`
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
   
    var chatDataMsg = JSON.parse(e.data)

    console.log(chatDataMsg)

    appendTasksDiv(chatDataMsg['message'])
    //appendMessage(chatDataMsg.message, chatDataMsg.username)
}
sockect.onerror = function(e){
    console.log("error", e)
}
sockect.onclose = function(e){
    console.log("close", e)
}