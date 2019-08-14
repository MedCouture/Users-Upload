$(document).ready(function () {

    $('#file').on('change', function () {
        if ($('#file').val().length > 0)
            $('#upload').removeAttr('disabled')

    })

    $('.update').on('click', function () {

        let url = $(this).data('email');
        let fte = $(this).data('fte');

        console.log(url);
        $.ajax({
            method: 'PUT',
            url: `/users/${url}`,
            data: {
                fte: fte
            }
        })
        $(this).text('done')
            .attr('disabled', true);
    });

    $('.add').on('click', function () {
        let data = {
            FullName: $(this).data('fullname'),
            FirstName: $(this).data('firstname'),
            LastName: $(this).data('lastname'),
            DepartmentDesc: 'Nursing',
            JobCode: $(this).data('jobcode'),
            JobCodeDescription: $(this).data('jobcodedescription'),
            FTE: $(this).data('fte'),
            Gender: $(this).data('gender'),
            Email: $(this).data('email'),
        };
        console.log(data);
        $.ajax({
            method: 'POST',
            url: '/users/add',
            data: data
        })
        $(this).html('done')
            .attr('disabled', true);

    })
    $('.delete').on('click', function () {
        let data = {
            FullName: $(this).data('fullname'),
            FirstName: $(this).data('firstname'),
            LastName: $(this).data('lastname'),
            DepartmentDesc: 'Nursing',
            JobCode: $(this).data('jobcode'),
            JobCodeDescription: $(this).data('jobcodedescription'),
            FTE: $(this).data('fte'),
            Gender: $(this).data('gender'),
            Email: $(this).data('email'),
        };
        console.log(data);
        $.ajax({
            method: 'DELETE',
            url: '/users/',
            data: data
        })
        $(this).html('deleted')
            .attr('disabled', true);

    })

    //Filter table to find the row that matches the value
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#myInput2").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable2 tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});