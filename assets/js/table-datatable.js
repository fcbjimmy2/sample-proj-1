$(function () {
    "use strict";


    $(document).ready(function () {
        $('#example').DataTable();
    });

    $(document).ready(function () {
        $('#myDataTable').DataTable();
    });

    $(document).ready(function () {
        $('#myDataTable2').DataTable();
    });

    $(document).ready(function () {
        $('#myDataTable3').DataTable();
    });

    $(document).ready(function () {
        $('#MsgContact').DataTable();
    });

    $(document).ready(function () {
        $('#product_list_sm').DataTable();
    });

    $(document).ready(function () {
        $('#conflict_sm').DataTable();
    });

    $(document).ready(function () {
        $('#selection_table_search').DataTable();
    });

    $(document).ready(function () {
        $('#selection_table_search2').DataTable();
    });

    $(document).ready(function () {
        $('#selection_table_search3').DataTable();
    });

    $(document).ready(function () {
        $('#selection_table_search4').DataTable();
    });

    $(document).ready(function () {
        $('#selection_table_search5').DataTable();
    });

    $(document).ready(function () {
        $('#selection_table_search6').DataTable();
    });

    $(document).ready(function () {
        var table = $('#exampleX').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print']
        });

        table.buttons().container()
            .appendTo('#exampleX_wrapper .col-md-6:eq(0)');
    });


});