 $(function() {
     var name = common.getQueryString('name') || '';
     var type = common.getQueryString('type') || '';
     if (!name) return;
     $.getJSON(`/file/stat${location.search}`, function(xdata) {
         var ctx = document.getElementById("myChart");
         var ctx2 = document.getElementById("myChart2");
         var ctx3 = document.getElementById("myChart3");

         if (type !== '9') {
             showData(ctx, xdata);
         } else {
             ctx2.style.display = 'block';
             ctx3.style.display = 'block';
             showData(ctx, xdata['s90']);
             showData(ctx2, xdata['sa0']);
             showData(ctx3, xdata['sa1']);
         }
     })
 })

 function showData(ctx, xdata) {
     var myChart = new Chart(ctx, {
         type: 'line',
         data: {
             labels: xdata.time,
             datasets: [{
                 label: '# temperature',
                 pointRadius: 0,
                 data: xdata.temperature,
                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
                 borderColor: 'rgba(255,99,132,1)',
                 borderWidth: 1,
                 yAxisID: '1y'
             }, {
                 label: '# temperature2',
                 pointRadius: 0,
                 data: xdata.temperature2 || [],
                 backgroundColor: 'rgba(54, 162, 235, 0.2)',
                 borderColor: 'rgba(54, 162, 235, 1)',
                 borderWidth: 1,
                 yAxisID: '1y'
             }, {
                 label: '# temperature3',
                 pointRadius: 0,
                 data: xdata.temperature3 || [],
                 backgroundColor: 'rgba(255, 206, 86, 0.2)',
                 borderColor: 'rgba(255, 206, 86, 1)',
                 borderWidth: 1,
                 yAxisID: '2y'
             }]
         },
         options: {
             hover: {
                 mode: 'label'
             },
             scales: {
                 yAxes: [{
                     id: '1y',
                     type: 'linear',
                     position: 'left'
                 }, {
                     id: '2y',
                     type: 'linear',
                     position: 'right',
                     // ticks: {
                     //     //设置y坐标的后缀
                     //     callback: function(value, index, values) {
                     //         return value;
                     //     }
                     // }
                 }]
             }
         }
     });
 }