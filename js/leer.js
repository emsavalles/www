
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var first = getUrlVars()["id"];
var second = getUrlVars()["a"];
        
    
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
//        var db = window.openDatabase("Database", "1.0", "ReformaP", 200000);
//        db.transaction(successCB, errorCB);
    }
    
   
    function errorCB(err) {
        console.log("Error procesando: "+err.code);
    }
    
    $(document).ready(function(){

    
    if(second=="CNPP"){
        $('.title').html('Leyes Nacionales');
    }else{
        $('.title').html('Leyes Estatales');
    }    
    $('#archivon').val(second);
    
    $('#guardarnota').on('click',function(){
        var db = window.openDatabase("Database", "1.0", "ReformaP", 200000);

//id unique, data LongText,archivo text,fecha date
        db.transaction(function(tx){
            //titulo=$('#titulonota').val();
            data=$('#textonota').val();
            archivo=$('#archivon').val();
            if(data!=""&&data.length>0){
                tx.executeSql('INSERT INTO notas(data,archivo) VALUES (?,?)',[data,archivo]);
//                tx.executeSql('insert into People(id, name, age) values (?,?,?)',[1, "Marujita", 105]);
                $('#textonota,#archivon').val('');
//                $('#guardanota').hide();     
                    $('.lightbox').remove();
                    $('#guardanota').hide(); 
                    $('#textonota,#archivon').val('');
            } else{
                alert('No se puede guardar una nota vacía');
            }
              
        }, errorCB);
        
    });

        $.getJSON( "json/"+second+".json", function( data ) {
            var posts = [];
            $.each( data, function( key, val ) {
                posts.push(val);
            });
           
           $('<h2>').text(posts[1]).appendTo('#titulo');
               cont="<p>";
                contenido= posts[2].split(/\r\n/g);
                $.each(contenido,function(k,v){
                    cont+='<a name="p'+k+'" id="p'+k+'"></a>'+v+"</p><p>";
                }); 
                cont+="</p>";
                $('#contenido').html('');
                $('<div>').attr('id','parrafo').html(cont).appendTo('#contenido');

        
			$('p').on('click',function(){
				var este=$(this).find('a');
//				var offset = este.offset();
				 $('#parrafo').find('p').removeClass('fdo').removeClass('oculto');
				 //$('#cont').animate({top:'-'+offset.top+'px'},500);
				// window.location.hash=este.attr('name');
			    $('html,body').unbind().animate({scrollTop: $(este).offset().top-100},'slow');

//				console.log(offset.top);
				

			});
           
                if(first){
                  $('#listanotas').trigger("click",function(){
                        $('#despnotas ul li').removeClass('view');
                       
                        $('#li_'+first).addClass('view');
                        $('#emergente').hide();
                        //alert(2);
                  });
                   
                }
               
		});//getJSON
		

    $('#descarga').on('click',function(){
      //  window.plugin.notification.local.add({ message: 'Descargando su archivo' });
       try{
           handleDocumentWithURL(
           function() {
            alert('Archivo descargado correctamente');
     //       window.plugin.notification.local.add({ message: 'Descarga Exitosa' });
            
           },
           function(error) {
                alert('Error!');
                if(error == 53) {
                     alert('No tiene una aplicación para abrir este archivo.');
                     }
                   },
           'http://www.reformapenalslp.gob.mx/pdfs/LEYES/'+second+'.pdf'
           );
           }
       catch(e){
           alert(e.message);
           }
    });//descarga
            
        $('#contenido').on('click',function(){
            $('#emergente').hide();
        });

        $('#compartir').on('click',function(e){
            e.preventDefault();
            $('#share').show('slow');

        });
        
        $('#Cnota').on('click',function(){
           $('#lasnotas').show('slow');
        });        
        
        $('#nuevanota').on('click',function(){
           $('#emergente').toggle();
           $('<div>').addClass('lightbox').appendTo('body');
           $('#guardanota').show();
           $('#textonota').focus();
            
        });
        $('#cierralista').on('click',function(){
            $('.lightbox').remove();
            $('#despnotas').hide();
        });
        
        $('#listanotas').on('click',function(){
            $('#despnotas ul').html('');
            
        var db = window.openDatabase("Database", "1.0", "ReformaP", 200000);
    
            db.transaction(function(tx){
                tx.executeSql('SELECT * FROM notas where archivo like "%'+second+'%"', [], function(tx,results){

                    var len = results.rows.length;
                    for (var i=0; i<len; i++){
            
                       titulox=results.rows.item(i).data;
                        $('<li>')
                            .attr('id','li_'+results.rows.item(i).id)
                            .html(results.rows.item(i).id+' - '+titulox)
                            .on('click',function(){
                                $('#despnotas ul li').removeClass('view');
                                $(this).toggleClass('view');
                            })
                            .appendTo('#despnotas ul');
                       
                    }
                   
                }, errorCB);
            }, errorCB);
            
           $('#emergente').hide();
           $('<div>').addClass('lightbox').appendTo('body');
   
           $('#despnotas').show();

        });
     
        $('textarea[maxlength]').keyup(function(){  
        //get the limit from maxlength attribute  
        var limit = parseInt($(this).attr('maxlength'));  
        //get the current text inside the textarea  
        var text = $(this).val();  
        //count the number of characters in the text  
        var chars = text.length; 
        $('#caracteres').html((200-chars));
  
        //check if there are more characters then allowed  
        if(chars > limit){  
            //and if there are use substr to get the text before the limit  
            var new_text = text.substr(0, limit);  
  
            //and change the current text with the new text  
            $(this).val(new_text);  
        }  
    });  
        
        $('#cancelarnota').on('click',function(){
           $('.lightbox').remove();
           $('#guardanota').hide(); 
           $('#textonota,#archivon').val('');
        });
        
        $('#subm').on('click',function(){
          $('#emergente').toggle();  
        });
        
        $('#compFB').on('click',function(){
            mensaje='Message via Facebook';
            window.plugins.socialsharing.shareViaFacebook(
            mensaje, 
            null /* img */, 
            null /* url */, 
            function() {console.log('share ok')}, 
            function(errormsg){alert('Aplicación de Facebook no Instalada')});
        });
        
        $('#compTW').on('click',function(){
            mensaje='Message via Facebook';
            window.plugins.socialsharing.shareViaTwitter('Message via Twitter');
        });        
		
        
/*
    var _timeoutId = 0;

    var _startHoldEvent = function(e) {
      _timeoutId = setInterval(function() {
         //myFunction.call(e.target);
         console.log("e.pageX: " + e.pageX + ", e.pageY: " + e.pageY);
         $('#emer')
         .css({'top':e.pageY-55,'left':'10%'})
         .show();
      },500);
    };

    var _stopHoldEvent = function() {
      clearInterval(_timeoutId );
    };

    $('#contenido').on('mousedown', _startHoldEvent).on('mouseup mouseleave', _stopHoldEvent);
    
        $('#veot').on('click',function(){
            GetSelectedText ();
        });
*/    
    $('#busca').on('click',function(){
        //$('#emergente').hide();
        $('#parrafo').find('p').removeClass('fdo').removeClass('oculto');
        $('html,body').unbind().animate({scrollTop: 0},'slow');
        });

    $('.busca').on('click',function(){
		 $('html,body').unbind().animate({scrollTop: 0},'slow');
		busca=$('#busca');
        if(busca.val().length>2){
		$('mark').contents().unwrap();

        $('#parrafo').find('p').removeClass('oculto');
        $('#parrafo').find('p').removeClass('fdo');
        text=$('#busca').val();
        text=text.replace(/a/g,'[aàáâãäåÀÁÂÃÄÅÆA]');
        text=text.replace(/e/g,'[eèéêëÈÉÊËE]');
        text=text.replace(/i/g,'[iìíîïÌÍÎÏI]');
        text=text.replace(/o/g,'[oòóôõöøÒÓÔÕÖØO]');
        text=text.replace(/u/g,'[uùúûüÙÚÛÜU]');
		
        var filtro=new RegExp("("+text+")",'gi');
//        console.log(filtro);
		
        $('#parrafo').find('p').each(function(i){
                if($(this).html().match(filtro)==null){
                    $(this)
						.addClass('oculto');
                }else{
						var texto=$(this).text();
						str=$(this).html().replace(filtro,'<mark>$1</mark>');
	                   $(this)
						.html(str)
				   		.addClass('fdo'); 
                }
            
        });
        }else{
                    $('#parrafo').find('p').removeClass('fdo').removeClass('oculto');
        }
     
    });                 

});//jquery

    function onMenuKeyDown() {
        $('#emergente').toggle(); 
    }
    
    function onBackKeyDown() {
        location.href="inicio.html";
    }

    function GetSelectedText () {
        if (window.getSelection) {  // all browsers, except IE before version 9
            var range = window.getSelection ();                                        
            //alert (range+", "+range.toString ());
            window.plugins.copy(range.toString ());
        } 
        else {
            if (document.selection.createRange) { // Internet Explorer
                var range = document.selection.createRange ();
                //alert (range.text);
                window.plugins.copy(range.text);
            }
        }
    }
   
