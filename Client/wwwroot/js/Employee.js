$(document).ready(function () {
    $("#namaHeader").html("Insert Data");
    $("#btnSubmit").css('display', 'block');
    $("#btnEdit").css('display', 'none');

    $("#modalInsert").on('hidden.bs.modal', function () {
        console.log("modal ketutup");
        //atur ulang
        $('#inputNIK').val('');
        //$("#inputNIK").attr("disabled", "false");
        document.getElementById("inputNIK").disabled = false;
        $('#inputFirstName').val('');
        $('#inputLastName').val('');
        $('#inputPhone').val('');
        // $("#inputPhone").attr("disabled", "false");
        document.getElementById("inputPhone").disabled = false;
        $('#inputSalary').val('');
        $('#inputEmail').val('');
        //$("#inputEmail").attr("disabled", "false");
        document.getElementById("inputEmail").disabled = false;
    });

    let tables = $('#employee').DataTable({
        ajax: {
            url: "https://localhost:7234/api/Employees/",
            dataType: "Json",
            dataSrc: "data" //need notice, kalau misal API kalian 
        },
        columns: [ // untuk nampilkan nama kolom di datatable
            {
                //Tugas buat numbering otomatis pada datatables !!!!
                "data": null, "sortable": false,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                "data": "nik"
            },
            {
                "data": "firstName"
            },
            {
                "data": "lastName"
            },
            {
                "data": "phone"
            },
            {
                "data": "birthDate"
/*                render: function (data, type, row) {
                    if (type === "sort" || type === "type") {
                        return data;
                    }
                    return moment(data).format("DD-MMMM-YYYY");
                }*/
            },
            {
                "data": null,
                render: function (data, type, row) {
                    return 'Rp. ' + row["salary"];
                }
            },
            {
                "data": "email"
            },
            {
                "data": "gender",
                render: function (data, type, row) {
                    if (row.gender == 0) {
                        return "Laki-laki";
                    }
                    else {
                        return "Perempuan";
                    }
                }
            },
            {
                "data": "nik",
                render: function (data, type, row) {
                    return `<button type="button" onclick="Update(\'${data}'\)" class="btn btn-success" style="width: 100px" data-bs-toggle="modal" data-bs-target="#modalInsert">Edit</button>
                            <button type="button" onclick="Delete(\'${data}'\)" class="btn btn-light"  style="width: 100px">Hapus</button>`;
                }
            },
        ],
        dom: 'Bfrtip',
        buttons: [
            ['pageLength'],
            {
                extend: 'copyHtml5',
                text: ' Copy',
                className: 'fa fa-files-o bg-info text-white text-uppercase', //nama class button saja
                exportOptions: {
                    columns: [0, ':visible']
                }
            },
            {
                extend: 'excelHtml5',
                text: ' Excel',
                className: 'fa fa-file-excel-o bg-success text-white text-uppercase', //nama class button saja
                exportOptions: {
                    columns: [0, ':visible']
                }
            },
            {
                extend: 'csvHtml5',
                text: ' CSV',
                className: 'fa fa-file-text-o bg-warning text-white text-uppercase', //nama class button saja
                exportOptions: {
                    columns: [0, ':visible']
                }
            },
            {
                extend: 'pdfHtml5',
                text: ' PDF',
                className: 'fa fa-file-pdf-o bg-danger text-white text-uppercase', //nama class button saja
                exportOptions: {
                    columns: [0, ':visible']
                }
            },
            {
                extend: 'colvis',
                className: 'bnt btn-dark mx-2 rounded-pill',
                text: 'Column Visibility',
            }
        ]
    });
});

// ===== UNTUK VALIDASI INSERT DATA=====
$(function () {
    $("#formValidation").validate({
        rules: {
            nik: {
                required: true,
                minlength: 5,
                maxlength: 5
            },
            firstName: {
                required: true
            },
            lastName: {
                required: true
            },
            phone: {
                required: true,
                minlength: 10,
                maxlength: 13
            },
            birthDate: {
                required: true
            },
            salary: {
                required: true,
                number: true
            },
            email: {
                required: true,
                email: true
            },
            gender: {
                required: true
            }
        },
        messages: {
            nik: {
                required: "<p style='color: red; margin-bottom:-50px;'>*Please enter your NIK</p>",
                minlength: "<p style='color: red; margin-bottom:-50px;'>*nik should be at least 5 number</p>",
                maxlength: "<p style='color: red; margin-bottom:-50px;'>*nik can't be longer than 5 number</p>"
            },
            firstName: {
                required: "<p style='color: red; margin-bottom:-50px;'>*Please enter your first name</p>"
            },
            lastName: {
                required: "<p style='color: red; margin-bottom:-50px;'>*Please enter your last name</p>"
            },
            phone: {
                required: "<p style='color: red; margin-bottom:-50px;'>*Please enter your phone number</p>",
                minlength: "<p style='color: red; margin-bottom:-50px;'>*Phone number should be at least 10 characters</p>",
                maxlength: "<p style='color: red; margin-bottom:-50px;'>*Phone number can't be longer than 13 characters</p>"
            },
            birthDate: {
                required: "<p style='color: red; margin-bottom:-50px;'>*Please enter your birthdate</p>"
            },
            salary: {
                required: "<p style='color: red; margin-bottom:-50px;'>*Please enter your salary</p>"
            },
            email: {
                required: "<p style='color: red; margin-bottom:-50px;'>*Please enter your email</p>",
                email: "<p style='color: red; margin-bottom:-50px;'>*The email should be in the format: abc@domain.tld</p>"
            },
            gender: {
                required: "<p style='color: red; margin-bottom:-50px;'>*Please choose your gender</p>"
            }
        }
    });
});

$('#btnSubmit').click(function (e) {
    e.preventDefault();
    if ($('#formValidation').valid() == true) {
        Insert();
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        })
    }
});

$("#btnEdit").click(function (e) {
    e.preventDefault();
    if ($("#formValidation").valid() == true) {
        UpdateData();
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        })
    }
})

// ===== UNTUK VALIDASI INSERT DATA===== end

// ===== UNTUK INSERT DATA===== //
function Insert() {
    var obj = new Object(); //sesuaikan sendiri nama objectnya dan beserta isinya
    //ini ngambil value dari tiap inputan di form nya
    obj.NIK = $("#inputNIK").val();
    obj.FirstName = $("#inputFirstName").val();
    obj.LastName = $("#inputLastName").val();
    obj.Phone = $("#inputPhone").val();
    obj.BirthDate = $("#inputBirthDate").val();
    obj.Salary = parseInt($("#inputSalary").val());
    obj.Email = $("#inputEmail").val();
    obj.Gender = parseInt($("#inputGender").val()),
        console.log(obj);
    //isi dari object kalian buat sesuai dengan bentuk object yang akan di post
    $.ajax({
        url: "https://localhost:7234/api/Employees",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj)//jika terkena 415 unsupported media type (tambahkan headertype Json & JSON.Stringify();)
    }).done((result) => {
        //buat alert pemberitahuan jika success
        Swal.fire({
            text: 'Berhasil simpan data',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true
        });
        $('#employee').DataTable().ajax.reload();
    }).fail((error) => {
        //alert pemberitahuan jika gagal
        Swal.fire({
            text: 'Data gagal disimpan',
            icon: 'error',
            timer: 2000,
            timerProgressBar: true
        });
    })
}
// ===== UNTUK INSERT DATA===== // END


// ===== UNTUK DELETE DATA===== // 
const Delete = (key) => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You want able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'DELETE',
                url: `https://localhost:7234/api/Employees?key=${key}`,
                success: () => {
                    Swal.fire(
                        'Deleted',
                        'Employee has been deleted.',
                        'success'
                    )
                    $('#employee').DataTable().ajax.reload()
                },
                error: () => {
                    Swal.fire(
                        'Failed',
                        'Error deleting employee',
                        'error'
                    )
                }
            })
        }
    })
}
// ===== UNTUK DELETE DATA===== // END

function ClearForm() {
    $("#nik").val("");
    $("#firstName").val("");
    $("#lastName").val("");
    $("#phone").val("");
    $("#date").val("");
    $("#salary").val("");
    $("#email").val("");
}

// ===== UNTUK UPDATE DATA===== // 
function Update(nik) {
    $("#namaHeader").html("Edit Data");
    $("#btnSubmit").css('display', 'none');
    $("#btnEdit").css('display', 'block');
    $.ajax({
        url: "https://localhost:7234/api/Employees/" + nik,
        success: function (result) {
            console.log(result);
        }
    }).done((result) => {
        $("#inputNIK").val(result.data.nik);
        $("#inputNIK").attr("disabled", "true");

        $("#inputFirstName").val(result.data.firstName);
        $("#inputLastName").val(result.data.lastName);

        $("#inputPhone").val(result.data.phone);
        $("#inputPhone").attr("disabled", "true");

        $("#inputBirthDate").val(result.data.birthDate);

        $("#inputSalary").val(result.data.salary);

        $("#inputEmail").val(result.data.email);
        $("#inputEmail").attr("disabled", "true");

        $("#inputGender").val(result.data.gender);

    }).fail((err) => {
        console.log(err);
    })
}

function UpdateData() {

    var edt = new Object(); //sesuaikan sendiri nama objectnya dan beserta isinya
    //ini ngambil value dari tiap inputan di form nya
    edt.NIK = $("#inputNIK").val();
    edt.FirstName = $("#inputFirstName").val();
    edt.LastName = $("#inputLastName").val();
    edt.Phone = $("#inputPhone").val();
    edt.BirthDate = $("#inputBirthDate").val();
    edt.Salary = parseInt($("#inputSalary").val());
    edt.Email = $("#inputEmail").val();
    edt.Gender = parseInt($("#inputGender").val());
    //isi dari object kalian buat sesuai dengan bentuk object yang akan di post
    $.ajax({
        url: "https://localhost:7234/api/Employees",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(edt)//jika terkena 415 unsupported media type (tambahkan headertype Json & JSON.Stringify();)
    }).done((result) => {
        //buat alert pemberitahuan jika success
        console.log("Berhasil simpan data")
/*        $("#modalInsert").modal("hide");
*/        Swal.fire({
            text: 'Berhasil simpan data',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true
        });
        $('#employee').DataTable().ajax.reload();
    }).fail((error) => {
        //alert pemberitahuan jika gagal
        console.log("Data gagal disimpan")
/*        $("#modalInsert").modal("hide");
*/        Swal.fire({
            text: 'Data gagal disimpan',
            icon: 'error',
            timer: 2000,
            timerProgressBar: true
        });
    })
}
// ===== UNTUK UPDATE DATA END===== //
