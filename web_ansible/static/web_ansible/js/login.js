$("#offline-rascunho-id").on('click', function(event) {
    if (navigator.onLine) {
        alert("on")
    } else {
        alert("off")
    }
})