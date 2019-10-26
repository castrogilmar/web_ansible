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

    
    $("#messages-list").append(newMessage)

    $("#counter-message").text((parseInt($("#counter-message").text())|0)+1)
}


function appendTasksDiv(jsonData) {
    var playbook_name="example"
    var id_task=1

    $(".tasks").remove()

    $.each(jsonData, (a, b) => {
        
        obj[id_task]=b

        newMessage = $(`
                <div id="data-id-tasks-${id_task}" class="row tasks"> 
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


var obj={}

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

    $("#id-btn-get-tasks").on("click", (e) => {
        var finalData = {
            'message': 'get_tasks'
        }
        sockect.send(JSON.stringify(finalData))
    })

    $("#id-btn-exec-tasks").on("click", (e) => {

        $.each(obj, (idx, ob)=> {
            //console.log(ob)
            $("#status-task",`#data-id-tasks-${idx}`).html(`<i class="fas fa-cog fa-spin"></i>`)            

            var finalData = {
                'message': 'exec_tasks',
                'id_task': idx,
                'task': ob
            }
            sockect.send(JSON.stringify(finalData))
        })
        
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
    //console.log("message", e)
   
    var chatDataMsg = JSON.parse(e.data)

    //console.log(chatDataMsg)

    if (chatDataMsg['request']=='get_tasks')
        appendTasksDiv(chatDataMsg['message'])
    if (chatDataMsg['request']=='exec_tasks') {
        console.log(chatDataMsg['message'])
        
        var result=chatDataMsg['message']

        var id_task=chatDataMsg['id_task']
        var result_task=result['result']

        console.log(result_task)

        if (result_task == 'ok')
            $(".card-header",`#data-id-tasks-${id_task}`).addClass('result-ok')
        else    
            $(".card-header",`#data-id-tasks-${id_task}`).addClass('result-failed')
        
        $("#status-task",`#data-id-tasks-${id_task}`).html(result_task=='ok' ? `<i class="fas fa-check"></i>` :
                                                           result_task=='failed' ? `<i class="fa fa-times" aria-hidden="true"></i>` :
                                                           '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>')   
    }
    //appendMessage(chatDataMsg.message, chatDataMsg.username)
}
sockect.onerror = function(e){
    console.log("error", e)
}
sockect.onclose = function(e){
    console.log("close", e)
}