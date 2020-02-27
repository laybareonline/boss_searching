$(document).ready(function(){
    //
// Pipelining function for DataTables. To be used to the `ajax` option of DataTables
//
$.fn.dataTable.pipeline = function ( opts ) {
    // Configuration options
    var conf = $.extend( {
        pages: 5,     // number of pages to cache
        url: '',      // script url
        data: null,   // function or object with parameters to send to the server
                      // matching how `ajax.data` works in DataTables
        method: 'GET' // Ajax HTTP method
    }, opts );
 
    // Private variables for storing the cache
    var cacheLower = -1;
    var cacheUpper = null;
    var cacheLastRequest = null;
    var cacheLastJson = null;
 
    return function ( request, drawCallback, settings ) {
        var ajax          = false;
        var requestStart  = request.start;
        var drawStart     = request.start;
        var requestLength = request.length;
        var requestEnd    = requestStart + requestLength;
         
        if ( settings.clearCache ) {
            // API requested that the cache be cleared
            ajax = true;
            settings.clearCache = false;
        }
        else if ( cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper ) {
            // outside cached data - need to make a request
            ajax = true;
        }
        else if ( JSON.stringify( request.order )   !== JSON.stringify( cacheLastRequest.order ) ||
                  JSON.stringify( request.columns ) !== JSON.stringify( cacheLastRequest.columns ) ||
                  JSON.stringify( request.search )  !== JSON.stringify( cacheLastRequest.search )
        ) {
            // properties changed (ordering, columns, searching)
            ajax = true;
        }
         
        // Store the request for checking next time around
        cacheLastRequest = $.extend( true, {}, request );
 
        if ( ajax ) {
            // Need data from the server
            if ( requestStart < cacheLower ) {
                requestStart = requestStart - (requestLength*(conf.pages-1));
 
                if ( requestStart < 0 ) {
                    requestStart = 0;
                }
            }
             
            cacheLower = requestStart;
            cacheUpper = requestStart + (requestLength * conf.pages);
 
            request.start = requestStart;
            request.length = requestLength*conf.pages;
 
            // Provide the same `data` options as DataTables.
            if ( typeof conf.data === 'function' ) {
                // As a function it is executed with the data object as an arg
                // for manipulation. If an object is returned, it is used as the
                // data object to submit
                var d = conf.data( request );
                if ( d ) {
                    $.extend( request, d );
                }
            }
            else if ( $.isPlainObject( conf.data ) ) {
                // As an object, the data given extends the default
                $.extend( request, conf.data );
            }
 
            settings.jqXHR = $.ajax( {
                "type":     conf.method,
                "url":      conf.url,
                "data":     request,
                "dataType": "json",
                "cache":    false,
                "success":  function ( json ) {
                    cacheLastJson = $.extend(true, {}, json);
 
                    if ( cacheLower != drawStart ) {
                        json.data.splice( 0, drawStart-cacheLower );
                    }
                    if ( requestLength >= -1 ) {
                        json.data.splice( requestLength, json.data.length );
                    }
                     
                    drawCallback( json );
                }
            } );
        }
        else {
            json = $.extend( true, {}, cacheLastJson );
            json.draw = request.draw; // Update the echo for each response
            json.data.splice( 0, requestStart-cacheLower );
            json.data.splice( requestLength, json.data.length );
 
            drawCallback(json);
        }
    }
};
 
// Register an API method that will empty the pipelined data, forcing an Ajax
// fetch on the next draw (i.e. `table.clearPipeline().draw()`)
$.fn.dataTable.Api.register( 'clearPipeline()', function () {
    return this.iterator( 'table', function ( settings ) {
        settings.clearCache = true;
    } );
} );
 


    var dataTable = $('#myTable').DataTable( {
        searchDelay: 500,
        "processing": true,
        "serverSide": true,
        "ajax":{
            url :"getClientData.php",
            type: "post",  
            pages: 5 // number of pages to cache
        },
        'columns': [
            { data: 'client_id' },
            { data: 'custom_client_id' },
            { data: 'firstname' },
            { data: 'lastname' },
            { data: 'action' },
         ]
    } );

    $('tbody').on('click','#viewClientTransaction',function(e){
        e.preventDefault();
        var client_id = $(this).data('id');
        var custom_id = $(this).data('custom-id');

        var data = { client_id: client_id, custom_id: custom_id };

        $.ajax({
            type:"POST",
            url:'__transaction_details.php',
            data:data,
            beforeSend:function(){
                $("#transaction_details tbody").append('<tr class="searching_text"><td colspan="5" class="text-center">Searching. . .</td></tr>');
                $("#closeDetails").attr("disabled", true);
            }
        }).done(function(res){
            $("#closeDetails").removeAttr("disabled");
            if(res.length > 0){
                $("#transaction_details tbody > tr").remove(".searching_text");
                res.forEach(function(el){
                    $("#transaction_details tbody").append("<tr><td>" + el.transaction_date +"</td><td>"+el.service_invoice_number+"</td><td>"+el.item_name+"</td><td>"+el.quantity+"</td><td>"+el.sub_total+"</td></tr>")
                });
            }else{
                $("#transaction_details tbody").append('<tr><td>No Results Found</td></tr>')
            }
        });     
    });

    $(document).on('click','#closeDetails',function(){
        $('#exampleModal').modal('toggle');
        $("#transaction_details tbody").remove();
    });
});