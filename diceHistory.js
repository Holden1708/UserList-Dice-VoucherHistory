/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */

var gPlayerInfoObj = {};
var gDiceHistoryData = [];

var gNameCol = ["stt", "dice"];
const gSTT_COL = 0;
const gDICE_COL = 1;

var gPlayerDataTable = $("#table-dice-history").DataTable({
    columns: [
        {data: gNameCol[gSTT_COL]},
        {data: gNameCol[gDICE_COL]}
    ],
    columnDefs: [   // định nghĩa các cột cần hiện ra
        {
            targets: gSTT_COL,
            className: "text-center text-primary",
            render: function (data, type, row, meta){
                return meta.row + meta.settings._iDisplayStart + 1;
            }
        },
        {
            targets: gDICE_COL,
            className: "text-center text-success"
        }
    ]
})
/*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */

/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */ 

// hàm tải trang
function onPageLoading(){
    "use strict";
    var vCurrentURL = window.location.href;
    catchDataFromURL(vCurrentURL);
    loadPlayerDataToForm(gPlayerInfoObj);
    getPlayerHistoryDice(gPlayerDataTable.userName);
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
    console.log("gOderParamsObj = " + JSON.stringify(gPlayerInfoObj, true, 2));
}

// hàm load thông tin người chơi lên form info
function loadPlayerDataToForm(paramPlayerInfo){
    "use strict";
    $("#inp-username").val(paramPlayerInfo.userName);
    $("#inp-firstname").val(paramPlayerInfo.firstName);
    $("#inp-lastname").val(paramPlayerInfo.lastName);
}

// hàm lấy lịch sử dice dựa vào userName của player
function getPlayerHistoryDice(paramPlayerUserName){
    "use strict";
    $.ajax({
        url: "http://42.115.221.44:8080/devcamp-lucky-dice" + "/dice-history?username=" + paramPlayerUserName,
        type: "GET",
        dataType: "json",
        success: function(paramResponse){
            console.log(JSON.stringify(paramResponse));
            if (paramResponse.dices.length > 0){
                var vCount = 0;
                while (vCount < paramResponse.dices.length){
                    var bDice = {
                        "game": vCount,
                        "dice": paramResponse.dices[vCount]
                    };
                    gDiceHistoryData.push(bDice);
                    vCount ++;
                }
                loadDataToDiceTable();
            }
            if(paramResponse.dices == ""){
                $("#log-result").text("Không có bản ghi thỏa mãn!")
                    .show();
            }
        },
        error: function(paramError){
            alert(paramError);
        }
    })
}

// hàm load data lấy được từ ajax api vào table history dice
function loadDataToDiceTable(){
    "use strict";
    console.log(gDiceHistoryData);
    gPlayerDataTable.clear();
    gPlayerDataTable.rows.add(gDiceHistoryData);
    gPlayerDataTable.draw();
    soLuongUserInTable(gDiceHistoryData);
}

// hàm trả về số lượng user có trên bảng là bao nhiêu
function soLuongUserInTable(paramDiceHistoryData){
    "use strict";
    var vCount = 0;
    vCount = paramDiceHistoryData.length;
    $("#log-result").text("Có " + vCount + " bản ghi thỏa mãn!")
                    .show();
}