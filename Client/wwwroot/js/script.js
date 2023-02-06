$.ajax({
    type: "GET",
    url: "../Employees/GetAllUniversity"
}).done((result) => {
    let univ = `<option value="" disabled selected>Please select your university</option>`;

    $.each(result, (key, val) => {
        univ += `<option value="${val.id}" >${val.name}</option>`;
    })

    $("#university_id").html(univ);
    $("#put_university_id").html(univ);
}).fail((error) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.responseJSON.message}`,
    })
    $('#tblEmployee').DataTable().ajax.reload();
})

function Update(emp) {
    $.ajax({
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        type: "PUT",
        url: "../Employees/Put",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(emp)
    }).done((result) => {
        Swal.fire({
            title: 'Updated!',
            text: 'Your data has been updated.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
        })
        $('#tblEmployee').DataTable().ajax.reload();
        $('#modalUpdateEmployee').modal('hide');
    }).fail((error) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Something went wrong! ${error.responseJSON.message}`,
        })
        $('#tblEmployee').DataTable().ajax.reload();
    })
}

function Delete(nik, name) {
    Swal.fire({
        title: `Are you sure?`,
        text: `${name} will be deleted. You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "DELETE",
                url: `../Employees/Delete/${nik}`
            }).done((result) => {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your data has been deleted.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                })
                $('#tblEmployee').DataTable().ajax.reload();
            }).fail((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Something went wrong! ${error.responseJSON.message}`,
                })
                $('#tblEmployee').DataTable().ajax.reload();
            })

        }
    })
}

function GetEmployee(nik) {
    $.ajax({
        type: "GET",
        url: `../Employees/Get/${nik}`
    }).done((result) => {
        const emp = new Employee(
            result.nik,
            result.firstName,
            result.lastName,
            result.phone,
            result.birthDate.substring(0, 10),
            result.gender,
            result.salary,
            result.email
        );

        $("#nik").val(emp.nik);
        $("#put_first_name").val(emp.firstName);
        $("#put_last_name").val(emp.lastName);
        $("#put_phone").val(emp.phone);
        $("#put_birthdate").val(emp.birthDate);
        $("#put_salary").val(emp.salary);
        $("#put_email").val(emp.email);
        gender = emp.gender;
        if (gender == 0) {
            $("#put_male_radio").prop("checked", true);
        } else {
            $("#put_female_radio").prop("checked", true);
        }

        $(document).on('click', '#btn_update', function (event) {
            event.preventDefault();

            if ($("#put_male_radio").prop("checked")) {
                gender = 0;
            }
            else {
                gender = 1;
            }

            emp.firstName = $("#put_first_name").val();
            emp.lastName = $("#put_last_name").val();
            emp.phone = $("#put_phone").val();
            emp.birthDate = $("#put_birthdate").val();
            emp.gender = gender;
            emp.salary = parseInt($("#put_salary").val());
            emp.email = $("#put_email").val();
            Update(emp);
        });
    }).fail((error) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Something went wrong! ${error.responseJSON.message}`,
        })
    })

    $('#put_first_name').click(function () {
        $("#put_first_name").val('');
    });
    $('#put_last_name').click(function () {
        $("#put_last_name").val('');
    });
    $('#put_phone').click(function () {
        $("#put_phone").val('');
    });
    $('#put_salary').click(function () {
        $("#put_salary").val('');
    });
    $('#put_degree').click(function () {
        $("#put_degree").val('');
    });
    $('#put_gpa').click(function () {
        $("#put_gpa").val('');
    });
    $('#put_email').click(function () {
        $("#put_email").val('');
    });
}

function Register() {
    let gender;

    if ($("#maleRadio").prop("checked")) {
        gender = 0;
    }
    else {
        gender = 1;
    }

    const emp = new RegisterEmployee(
        "",
        $("#first_name").val(),
        $("#last_name").val(),
        $("#phone").val(),
        $("#birthdate").val(),
        gender,
        parseInt($("#salary").val()),
        $("#email").val(),
        $("#password").val(),
        $("#degree").val(),
        $("#gpa").val(),
        parseInt($("#university_id").val())
    );

    $("#formRegister").validate({ errorPlacement: function (error, element) { } });
    if ($("#formRegister").valid()) {
        $.ajax({
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "../Employees/Register",
            dataType: "json",
            data: JSON.stringify(emp)
        }).done((result) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `${result.message}`,
                showConfirmButton: false,
                timer: 1500
            })
            $('#tblEmployee').DataTable().ajax.reload();
            $('#modalRegisterEmployee').modal('hide');
            $('#modalRegisterEmployee').on('hidden.bs.modal', function (e) {
                $(this)
                    .find("input,textarea,select")
                    .val('')
                    .end()
                    .find("input[type=checkbox], input[type=radio]")
                    .prop("checked", "")
                    .end();
            })
            $("#btn_register").prop("disabled", false);
        }).fail((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Something went wrong! ${error.message}`,
            })
            $('#tblEmployee').DataTable().ajax.reload();
            $("#btn_register").prop("disabled", false);
        })
    }
}

(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    event.preventDefault();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

$(document).ready(function () {
    let table = $("#tblEmployee").DataTable({
        "ajax": {
            "url": "../Employees/GetAllProfile/",
            "dataType": "Json",
            "dataSrc": ""
        },
        "columns": [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "nik" },
            { "data": "fullName" },
            { "data": "email" },
            { "data": "phone" },
            { "data": "gender", visible: false },
            { "data": "birthDate", visible: false },
            {
                data: null,
                render: function (data, type, row) {
                    return `Rp.${data.salary}`;
                },
                visible: false
            },
            { "data": "gpa", visible: false },
            { "data": "degree", visible: false },
            { "data": "universityName", visible: false },
            {
                data: null,
                render: function (data, type, row) {
                    return `<button class="btn btn-warning" data-toggle="modal" data-target="#modalUpdateEmployee" onclick="GetEmployee('${data.nik}')"><i class="fa-solid fa-user-pen"></i></button>
                            <button class="btn btn-danger" onclick="Delete('${data.nik}','${data.fullName}')"><i class="fa-solid fa-trash-can"></i></button>`;
                }
            }
        ],
        dom: `<'row'<'col-md-2'l><'col-md-5'B><'col text-right'f>>
              <'row'<'col-md-12'tr>>
              <'row'<'col-md-5'i><'col-md-7'p>>`,
        buttons: [
            {
                text: '<i class="fa-solid fa-user-plus"></i>',
                className: 'btn btn-primary',
                action: function (e, dt, node, config) {
                    $('#modalRegisterEmployee').modal('show');
                }
            },
            {
                extend: 'collection',
                text: '<i class="fa-solid fa-file-export"></i>',
                className: 'btn btn-primary',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa-solid fa-file-excel"></i> excel',
                        exportOptions: {
                            columns: ':visible'
                        }
                    },
                    {
                        extend: 'csv',
                        text: '<i class="fa-solid fa-file-csv"></i> csv',
                        exportOptions: {
                            columns: ':visible'
                        }
                    },
                    {
                        extend: 'pdf',
                        text: '<i class="fa-solid fa-file-pdf"></i> pdf',
                        exportOptions: {
                            columns: ':visible'
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fa-solid fa-print"></i> print',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }
                ]
            },
            {
                extend: 'colvis',
                text: `<i class="fa-solid fa-table-columns"></i>`,
                columns: ':not(.noVis)',
                className: 'btn btn-primary',
            }
        ]
    });

    table.buttons().container().appendTo("#tblEmployee .col-md-6:eq(0)");
})