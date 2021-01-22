/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 94.11764705882354, "KoPercent": 5.882352941176471};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8529411764705882, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "/-12"], "isController": false}, {"data": [0.5, 500, 1500, "/gts1o1core-6"], "isController": false}, {"data": [1.0, 500, 1500, "/gts1o1core-7"], "isController": false}, {"data": [1.0, 500, 1500, "/gts1o1core-8"], "isController": false}, {"data": [1.0, 500, 1500, "/-17"], "isController": false}, {"data": [0.5, 500, 1500, "/-1"], "isController": false}, {"data": [1.0, 500, 1500, "/gts1o1core-9"], "isController": false}, {"data": [1.0, 500, 1500, "/gts1o1core-13"], "isController": false}, {"data": [1.0, 500, 1500, "/-2"], "isController": false}, {"data": [1.0, 500, 1500, "/-15"], "isController": false}, {"data": [1.0, 500, 1500, "/-3"], "isController": false}, {"data": [1.0, 500, 1500, "/gts1o1core-11"], "isController": false}, {"data": [1.0, 500, 1500, "/-16"], "isController": false}, {"data": [1.0, 500, 1500, "/-4"], "isController": false}, {"data": [0.5, 500, 1500, "/gts1o1core-10"], "isController": false}, {"data": [1.0, 500, 1500, "/gts1o1core-5"], "isController": false}, {"data": [1.0, 500, 1500, "/-14"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17, 1, 5.882352941176471, 300.05882352941177, 17, 1171, 670.1999999999996, 1171.0, 1171.0, 3.327461342728518, 5.240828073008417, 1.397273806028577], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["/-12", 1, 1, 100.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 3.717472118959108, 0.8313487453531598, 1.4739196096654275], "isController": false}, {"data": ["/gts1o1core-6", 1, 0, 0.0, 1171.0, 1171, 1171, 1171.0, 1171.0, 1171.0, 0.8539709649871904, 0.5854371263877028, 0.3444238364645602], "isController": false}, {"data": ["/gts1o1core-7", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 3.8167938931297707, 2.6165911259541983, 1.5393905057251909], "isController": false}, {"data": ["/gts1o1core-8", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 4.032258064516129, 2.7603641633064515, 1.6223538306451613], "isController": false}, {"data": ["/-17", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 4.166666666666667, 3.715006510416667, 1.7008463541666667], "isController": false}, {"data": ["/-1", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 1.834862385321101, 27.3383744266055, 1.2829701834862384], "isController": false}, {"data": ["/gts1o1core-9", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 3.952569169960474, 2.7058115118577075, 1.5902915019762847], "isController": false}, {"data": ["/gts1o1core-13", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 3.937007874015748, 2.69900344488189, 1.5878752460629921], "isController": false}, {"data": ["/-2", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 3.5460992907801416, 3.078595966312057, 1.4025099734042554], "isController": false}, {"data": ["/-15", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 52.447150735294116, 24.011948529411764], "isController": false}, {"data": ["/-3", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 4.739336492890995, 4.114521623222749, 1.8744446090047393], "isController": false}, {"data": ["/gts1o1core-11", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 2.0408163265306123, 1.399075255102041, 0.8231026785714286], "isController": false}, {"data": ["/-16", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 40.52734375, 18.5546875], "isController": false}, {"data": ["/-4", 1, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 43.47826086956522, 37.74626358695652, 17.195991847826086], "isController": false}, {"data": ["/gts1o1core-10", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 1.996007984031936, 1.3683570359281436, 0.8050305638722555], "isController": false}, {"data": ["/gts1o1core-5", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 3.4129692832764507, 2.3364174488054608, 1.3731868600682595], "isController": false}, {"data": ["/-14", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 44.580078125, 20.41015625], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1, 100.0, 5.882352941176471], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17, 1, "400/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/-12", 1, 1, "400/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
