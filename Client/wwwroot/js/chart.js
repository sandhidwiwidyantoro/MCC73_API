//Chart
var colorPalette = ['#00D8B6', '#008FFB', '#FEB019', '#FF4560', '#775DD0'];

$.ajax({
    type: "GET",
    url: "../Employees/GetChartUniversity"
}).done((result) => {
    var options = {
        chart: {
            type: 'bar'
        },
        series: [{
            name: 'sales',
            data: result.series
        }],
        xaxis: {
            categories: result.labels
        }
    }

    var chart = new ApexCharts(document.querySelector("#bar"), options);
    chart.render();
})

$.ajax({
    type: "GET",
    url: "../Employees/GetChartGender"
}).done((result) => {
    var optionDonut = {
        series: result.series,
        chart: {
            width: 480,
            type: 'pie',
        },
        labels: result.labels
    };

    var donut = new ApexCharts(
        document.querySelector("#donut"),
        optionDonut
    )
    donut.render();
})