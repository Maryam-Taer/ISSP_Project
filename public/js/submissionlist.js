function format ( d ) {
    var pre = ''
    if (d.prefix != null){
        pre = d.prefix
    }
    return 'Contact: '+ pre + ' ' + d.first + ' '+ d.last +'<br>'+
        'Contact Phone: '+d.phone+'<br>'+
        'The child row can contain any data you wish, including links, images, inner tables etc.';
}

$(document).ready(function() {
    $('#example thead tr').clone(true).appendTo('#example thead');
    $('#example thead tr:eq(1) th').each(function (i) {
        if (i>0 && i <6){
        $(this).html('<input class="form-control form-control-sm" type="text" placeholder="Filter..." />');
        $('input', this).on('keyup change', function () {
            if (dt.column(i).search() !== this.value) {
                dt
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });}
    });
    var dt = $('#example').DataTable( {
        "orderCellsTop": true,
        "ordering": true,
        "searching": true,
        "processing": true,
        "data": submissions,
        "columns": [
            {
                "class":          "details-control",
                "orderable":      false,
                "data":           null,
                "defaultContent": ""
            },
            { "data": "id" },
            { "data": "created_time" },
            { "data": "company_name" },
            { "data": "project_description" },
            { "data": "current_arrangement" },
            {"orderable":      false,
            "render": function ( data, type, row, meta ) {
                return '<a href="/submission/edit?id='+row.id+ '" class="btn btn-outline-info">Edit</a>';
            }},
            {"orderable":      false,
            "render": function ( data, type, row, meta ) {
                return '<form action="/submission/feedback" method="POST" >' + 
                    '<input name="id" type="hidden" value="'+row.id+ '" />' +
                    '<input name="username" type="hidden" value="'+"<%- username %>" +'" />' +
                    '<button class="btn btn-outline-success" type="submit">Feedback</button>' +
                '</form>';
            }},
            {"orderable":      false,
            "render": function ( data, type, row, meta ) {
                return '<form class="del" action="/submission/delete" method="POST" >' + 
                    '<input name="id" type="hidden" value="'+row.id+ '" />' +
                    '<button class="btn btn-danger" type="submit">Delete</button>' +
                '</form>';
            }},
            {"orderable":      false,
            "render": function ( data, type, row, meta ) {
                return JSON.stringify(row)
            }},
        ],
        "columnDefs": [
        {
            "targets": [ hidden_columns ], // show buttons based on roles
            "visible": false,
            "searchable": true
        }],
        "order": [[1, 'asc']]
    } );

    // Array to track the ids of the details displayed rows
    var detailRows = [];

    $('#example tbody').on( 'click', 'tr td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = dt.row( tr );
        var idx = $.inArray( tr.attr('id'), detailRows );

        if ( row.child.isShown() ) {
            tr.removeClass( 'details' );
            row.child.hide();
            tr.removeClass('shown');
            // Remove from the 'open' array
            detailRows.splice( idx, 1 );
        }
        else {
            tr.addClass( 'details' );
            row.child( format( row.data() ) ).show();
            tr.addClass('shown');
            // Add to the 'open' array
            if ( idx === -1 ) {
                detailRows.push( tr.attr('id') );
            }
        }
    } );

    // On each draw, loop over the `detailRows` array and show any child rows
    dt.on( 'draw', function () {
        $.each( detailRows, function ( i, id ) {
            $('#'+id+' td.details-control').trigger( 'click' );
        } );
    } );

    $('#example tbody').on('submit', 'tr td form.del', function () {
        return confirm('Are you sure you want to delete?')
    } );
    
} );