Object.prototype.toType = function() {
  return ({}).toString.call(this).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

var db;
var console="";
var tokens=[];
var updates=[];
var guardados=[];
var modificados=[];
    
var updateurl = "http://www.reformapenalslp.gob.mx/leyjson.php?callback=?";

$(document).bind("mobileinit", function(){
	$.mobile.allowCrossDomainPages = true;
});

function borrartabla(){
    db.transaction(
        function(tx){ 
        tx.executeSql('drop table leyes'); 
        $("#docs").html('');
//        alert('borrada');
        }, 
        function(e){
            alert(e);
        },displayDocs 
    );

}
function init() {
    document.addEventListener("deviceready",startup,false);
//    startup();

}

function startup() {
    $('#console').html(console);
    db = window.openDatabase("main","1","reformap",200000);
//    db.transaction(initDB,dbError,dbReady);
    db.transaction(initDB,dbError,syncDB3);

}

function metenuevos(){
    alert('metenuevos');
    if(navigator.connection.type != Connection.NONE) {   
        alert('Si tiene internet');
        $.get(updateurl, function(resp, code) {
                alert('get');

            resp=resp.leyes;
            resp.forEach(function(ob) {
                db.transaction(function(ctx){
                        alert('inserta');

                ctx.executeSql("insert into leyes(titulo,contenido,fecha,archivo,tipo,lastupdated,token) values(?,?,?,?,?,?,?)", [ob.titulo,ob.contenido,ob.fecha,ob.archivo,ob.tipo,ob.lastupdated,ob.token]);
                });
            });//Foreach
           displayDocs();
        },'json');//get
    }else{
      alert('Necesita conectarse a Internet para sincronizar el contenido');
    }     
}

function sincronizaLeyes(){
    $("#docs").html(''); 

    if(navigator.connection.type != Connection.NONE) {
    $.get('http://reformapenalslp.gob.mx/leyjson.php?k=1&callback=?', function(resp, code){
      var co="";
        resp=resp.leyes;
        resp.forEach(function(ob) {
            tokens.push(ob.token);
            guardados.push(ob.token);
            updates.push(ob.lastupdated);
            co+=ob.token+'<hr>';
        });
        
//        $('#console').html(co);

///Borra y actualiza
    db.transaction(function(tx) {
        tx.executeSql("select token,lastupdated from leyes order by id desc", [], function(tx, results) {
                for(var i=0; i<results.rows.length; i++) {
                    var esta=$.inArray(results.rows.item(i).token,tokens);
                   
                    if(esta>=0){
                        guardados.splice(esta,1);
                        if(results.rows.item(i).lastupdated==updates[esta]){
                            alert('son iguales');
                        }else
                        {
                           alert('hay que modificar: '+results.rows.item(i).token);
                            $.get('http://reformapenalslp.gob.mx/leyjson.php?t='+results.rows.item(i).token+'&callback=?', function(resp, code){
                                var ob=resp.leyes[0];
                                    db.transaction(
                                    function(tx){
                                        tx.executeSql("update leyes set titulo=?,contenido=?,fecha=?,archivo=?,tipo=?,lastupdated=? where token=?", [ob.titulo,ob.contenido,ob.fecha,ob.archivo,ob.tipo,ob.lastupdated,ob.token]);
                                    });
                            },'json');
                        }
                    }else{
                       alert(results.rows.item(i).token+' no esta, hay que borrar el local');
                         tx.executeSql("delete from leyes where token = ?", [results.rows.item(i).token]);

                    }
                }
        });//tx.executeSql
    },dbError,function(){
        
            guardados.forEach(function(i,k) {
                $.get('http://reformapenalslp.gob.mx/leyjson.php?t='+guardados[k]+'&callback=?', function(resp, code){
                    var ob=resp.leyes[0];
                        db.transaction(
                        function(tx){
                            tx.executeSql("insert into leyes(titulo,contenido,fecha,archivo,tipo,lastupdated,token) values(?,?,?,?,?,?,?)", [ob.titulo,ob.contenido,ob.fecha,ob.archivo,ob.tipo,ob.lastupdated,ob.token]);
                        });
                },'json');
                
            }); 
            guardados.splice(0,guardados.length); 
        displayDocs();      
    });//db.transaction    

       
    },'json');

//displayDocs();    
    }else{
      alert('Necesita conectarse a Internet para sincronizar el contenido');
    }

}

function syncDB3() {
    db.transaction(function(tx) {
        tx.executeSql("select token,lastupdated from leyes order by id desc", [], function(tx, results) {
            if(results.rows.length==0){
                metenuevos();  
                console+="meto nuevos"+'<hr>';$('#console').html(console);
            }else{
                //displayDocs();//alert('');
                sincronizaLeyes();
                console+="ya tienedatos, los muestro"+'<hr>';$('#console').html(console);
            }
        });
    },dbError);
}//syncDB3

function dbError(e) {
    console+="SQL ERROR"+'<hr>';
    $('#console').html(console);
}



function initDB(tx) {
    $('#console').html(console);
//    tx.executeSql("drop table leyes");
    tx.executeSql("create table if not exists leyes(id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, contenido LONGTEXT, fecha DATE, archivo TEXT, tipo TINYINT, lastupdated DATE, token TEXT)");
}

function dbReady() {
    console+="DB initialization done."+'<hr>';
    $('#console').html(console);
    
    //begin sync process
    if(navigator.connection.type != Connection.NONE) {
        console+="syncDB";
        $('#console').html(console+'<hr>');
        syncDB();
    }
    else {
        console+="displayDocs";
        $('#console').html(console+'<hr>');
        //displayDocs();
    }
  
}

function syncDB() {
    $("#docs").html("Refreshing documentation...");

//    var date = localStorage["lastdate"]?localStorage["lastdate"]:'';
    
//    $('#console').html("Will get items after "+date);
    
    $.get(updateurl, function(resp, code) {
        resp=resp.leyes;
        console+="back from getting updates with "+resp.length + " items to process.<hr>";
        $('#console').html(console);
        //Ok, loop through. For each one, we see if it exists, and if so, we update/delete it
        //If it doesn't exist, straight insert

        
        resp.forEach(function(ob) {
            db.transaction(function(ctx) {
                ctx.executeSql("select id from leyes where token = ?", [ob.token], function(tx,checkres) {
                    if(checkres.rows.length) {
                        
                        
                        $('#console').html(console+="possible update/delete<hr>");
                        if(!ob.deleted) {
                            $('#console').html(console+="updating "+ob.titulo+ " "+ob.lastupdated+" token: "+ob.token+" Borrado: "+ob.deleted+'<hr>');
                            tx.executeSql("update leyes set titulo=?,contenido=?,fecha=?,archivo=?,tipo=?,lastupdated=? where token=?", [ob.titulo,ob.contenido,ob.fecha,ob.archivo,ob.lastupdated,ob.token]);
                        } else {
                            $('#console').html(console+="deleting "+ob.titulo+ " "+ob.lastupdated+'<hr>');
                            tx.executeSql("delete from leyes where token = ?", [ob.token]);
                        }
                    
                    } else {
                        //only insert if not deleted
                        $('#console').html("possible insert");
                        if(!ob.deleted) {
                            $('#console').html(console+="inserting "+ob.titulo+ " "+ob.lastupdated+'<hr>');
                            tx.executeSql("insert into leyes(titulo,contenido,fecha,archivo,tipo,lastupdated,token) values(?,?,?,?,?,?,?)", [ob.titulo,ob.contenido,ob.fecha,ob.archivo,ob.tipo,ob.lastupdated,ob.token]);
                        }
                    }

                });
            });
        });
        
        //if we had anything, last value is most recent
        if(resp.length) localStorage["lastdate"] = resp[resp.length-1].lastupdated;
        displayDocs();    
    },"json");

}

function displayDocs() {
    $('<a>')
    .text('Sincronizacion completa')
    .attr('href','inicio.html')
    .appendTo('body');
//    window.open('inicio.html');
/*    
    $("#docs").html('');
    db.transaction(function(tx) {
        tx.executeSql("select * from leyes order by id desc", [], function(tx, results) {
    var s="vacio";
                s = "<h2>Docs</h2>";
                for(var i=0; i<results.rows.length; i++) {
                    s +='<h1>'+results.rows.item(i).titulo+'</h1>'+
                        '<p>'+ results.rows.item(i).contenido+'</p>'+
                        '<p>'+ results.rows.item(i).fecha+'</p>'+
                        '<p>'+ results.rows.item(i).archivo+'</p>'+
                        '<p>'+ results.rows.item(i).lastupdated+'</p>'+
                        '<p>'+ results.rows.item(i).token+'</p>'+
                        '<hr/>';
                }
    $("#docs").html(s);
        });
    },function(e){
        $("#docs").html('no hay nada');
    });
*/    
}