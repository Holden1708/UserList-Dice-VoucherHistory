/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */

var gPlayerInfoObj = {};
var gVoucherHistoryData = [];

var gNameCol = ["stt", "voucherId", "discount", "ngayTao"];
const gSTT_COL = 0;
const gMA_COL = 1;
const gPHAN_TRAM_COL = 1;
const gDATE_COL = 1;
var gPlayerDataTable = $("#table-voucher-history").DataTable({
    columns: [
        {data: gNameCol[gSTT_COL]},
        {data: gNameCol[gMA_COL]},
        {data: gNameCol[gPHAN_TRAM_COL]},
        {data: gNameCol[gDATE_COL]}
    ],
    columnDefs: [   // định nghĩa các cột cần hiện ra
        {
            targets: gSTT_COL,
            className: "text-center text-primary",
            render: function (data, type, row, meta){
                return meta.row + meta.settings._iDisplayStart + 1;
            }
        },
    ]
});
/*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */

/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */ 

// hàm tải trang
function onPageLoading(){
    "use strict";
    var vCurrentURL = window.location.href;
    catchDataFromURL(vCurrentURL);
    loadPlayerDataToForm(gPlayerInfoObj);
    getPlayerHistoryVoucher(gPlayerDataTable.userName);
}

/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/

// hàm lấy data từ url
function catchDataFromURL(paramCurrentURL){
    "use strict";
    var vNewUrl = new URL(paramCurrentURL);
    // get parameters
    var vUserName = vNewUrl.searchParams.get("username");
    var vFirstName = vNewUrl.searchParams.get("firstname");
    var vLastName = vNewUrl.searchParams.get("lastname");
    // save to var global
    gPlayerInfoObj.userName = vUserName;
    gPlayerInfoObj.firstName = vFirstName;
    gPlayerInfoObj.lastName = vLastName;
    // show result in console.log
    console.log("gPlayerParamsObj = " + JSON.stringify(gPlayerInfoObj, true, 2));
}

// hàm load thông tin người chơi lên form info
function loadPlayerDataToForm(paramPlayerInfo){
    "use strict";
    $("#inp-username").val(paramPlayerInfo.userName);
    $("#inp-firstname").val(paramPlayerInfo.firstName);
    $("#inp-lastname").val(paramPlayerInfo.lastName);
}

// hàm lấy lịch sử dice dựa vào userName của player
function getPlayerHistoryVoucher(paramPlayerUserName){
    "use strict";
    $.ajax({
        url: "http://42.115.221.44:8080/devcamp-lucky-dice" + "/voucher-history?username=" + paramPlayerUserName,
        type: "GET",
        dataType: "json",
        success: function(paramResponse){
            console.log(JSON.stringify(paramResponse));
            if (paramResponse.vouchers.length > 0){
                var vCount = 0;
                while (vCount < paramResponse.vouchers.length){
                    var bVoucher = {
                        "voucher": vCount,
                        "stt": paramResponse.vouchers[vCount]
                    };
                    gVoucherHistoryData.push(bVoucher);
                    vCount ++;
                }
                loadDataToVoucherTable();
            }
            if(paramResponse.vouchers == ""){
                $("#log-result").text("Không có bản ghi thỏa mãn!")
                    .show();
            }
        },
        error: function(paramError){
            alert(paramError);
        }
    })
}

// hàm load data lấy được từ ajax api vào table history voucher
function loadDataToVoucherTable(){
    "use strict";
    console.log(gVoucherHistoryData);
    gPlayerDataTable.clear();
    gPlayerDataTable.rows.add(gVoucherHistoryData);
    gPlayerDataTable.draw();
    soLuongUserInTable(gVoucherHistoryData);
}

// hàm trả về số lượng user có trên bảng là bao nhiêu
function soLuongUserInTable(paramVoucherHistoryData){
    "use strict";
    var vCount = 0;
    vCount = paramDiceHistoryData.length;
    $("#log-result").text("Có " + vCount + " bản ghi thỏa mãn!")
                    .show();
}