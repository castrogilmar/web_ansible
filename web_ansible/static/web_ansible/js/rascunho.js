$(document).ready(function(){
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    
    
    if(!window.indexedDB)
	{
		console.log("Seu navegador não suporta o recurso HTML5 IndexedDB");
	}
	else
	{
		request = window.indexedDB.open("PedidoTecon", 2);
		request.onerror = function(event){
			console.log("Erro ao abrir o banco de dados", event);
		}
	
		request.onupgradeneeded = function(event){
			console.log("Atualizando");
			db = event.target.result;
            var objRascunho = db.createObjectStore("rascunhos", { keyPath: "id_rascunho",  autoIncrement: true });
            objRascunho.createIndex("emissao", "emissao", { unique: false });
            objRascunho.createIndex("cnpj", "cnpj", { unique: false });
		};
		request.onsuccess = function(event){
			console.log("Banco de dados aberto com sucesso");
			db = event.target.result;
		}
	}

	$("#addBtn").click(function(){
		var transaction = db.transaction('rascunhos', "readwrite");

		// Quando a transação é executada com sucesso
		transaction.oncomplete = function(event) {
		};
	
		// Quando ocorre algum erro na tansação
		transaction.onerror = function(event) {
		};

		var objectStore = transaction.objectStore("rascunhos");
			objectStore.add({emissao: "20191106", cnpj: "06526131000193"});
	});
	
	/* $("#removeBtn").click(function(){
		var codigo = $("#codigo").val();
		db.transaction(["estudantes"],"readwrite").objectStore("estudantes").delete(codigo);
                          transaction.oncomplete = function(event){
			$("#result").html("Removido");
		};	
	}); */
	
	$("#getBtn").click(function(){
		var transaction = db.transaction('rascunhos', "readonly");
		var objectStore = transaction.objectStore('rascunhos');
    
		var r = objectStore.count();
		
		r.onsuccess = function(event){
			$("#result").html("Nome : "+r.result);
		};

		//objectStore.getAll(query);
		var index = objectStore.index("emissao");
 
 
		var filtro = IDBKeyRange.bound("20191106","20191107");
		
		var r1 = index.getAll(filtro);
		
		
		r1.onsuccess = function(event){
			let data_table=[]
			$.each(r1.result, function(idx, data) {
				if (data.cnpj == "06526131000193")
					data_table.push(data);	
			})
			console.log(data_table);
			
		};
	});
	/* $("#updateBtn").click(function(){
		var codigo = $("#codigo").val();
		var nome = $("#nome").val();
		var transaction = db.transaction(["estudantes"],"readwrite");
		var objectStore = transaction.objectStore("estudantes");
		var request = objectStore.get(codigo);
		request.onsuccess = function(event){
			$("#result").html("Atualizando : "+request.result.nome + " para " + nome);
			request.result.nome = nome;
			objectStore.put(request.result);
		};
	}); */
});