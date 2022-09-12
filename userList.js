
/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
  // Mảng gUserObjects là mảng chứa dữ liệu users
  var gUserObjects = [
    {
      id: 2,
      username: "quannv",
      firstname: "Ngo Van",
      lastname: "Quan",
      age: 18,
      email: "quan@gmail.com",
      roleId: 5
    },
    {
      id: 3,
      username: "longdh",
      firstname: "Do Hoang",
      lastname: "Long",
      age: 19,
      email: "long@gmail.com",
      roleId: 8
    },
    {
      id: 4,
      username: "hiendt",
      firstname: "Do Thi",
      lastname: "Hien",
      age: 29,
      email: "hien@gmail.com",
      roleId: 11
    },
    {
      id: 5,
      username: "lanht",
      firstname: "Ho Thi",
      lastname: "Lan",
      age: 27,
      email: "lan@gmail.com",
      roleId: 13
    }

];
// Mảng gRoleObjects là mảng chứa dữ liệu các roles
var gRoleObjects = [
    {
      roleId: 5,
      roleName: "Admin" 
    },
    {
      roleId: 8,
      roleName: "Manager" 
    },
    {
      roleId: 11,
      roleName: "Teacher" 
    },
    {
      roleId: 13,
      roleName: "Staff" 
    }  
];

// Biến mảng toàn cục chứa danh sách tên các thuộc tính
const gUSERS_COLS = ["id", "username", "firstname", "lastname", "email", "age", "roleId", "action"];
var gStt = 0;
// Biến mảng toàn cục định nghĩa chỉ số các cột tương ứng
const gUSERS_STT_COL = 0;
const gUSERS_USER_NAME_COL = 1;
const gUSERS_FIRST_NAME_COL = 2;
const gUSERS_LAST_NAME_COL = 3;
const gUSERS_EMAIL_COL = 4;
const gUSERS_AGE_COL = 5;
const gUSERS_ROLE_COL = 6;
const gUSERS_ACTION_COL = 7;

/*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */

$('[data-toggle="tooltip"]').tooltip();

// hàm gọi khi nhấn nút filter
$("#btn-filter-user").on("click", function(){
  onBtnFilterClick(this);
})

// hàm gọi khi ấn icon dice
$(document).on("click", "#user-table .fa-dice", function(){
  onIconDiceClick(this);
})

// hàm gọi khi ấn icon gift
$(document).on("click", "#user-table .fa-gift", function(){
  onIconGiftClick(this);
})

/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */  

// hàm tải trang
function onPageLoading(){
  "use strict";
  loadDataUserToTable(gUserObjects);
  loadDataToSelectRole(gRoleObjects);
}

// hàm sự kiện ấn nút filter
function onBtnFilterClick(paramFilterButton){
  "use strict";
  // khai báo đối tượng chứa dữ liệu filter
  var vFilterData = {
    roleId: -1
  }
  // thu thập dữ liệu để fiter
  getFilterFormData(vFilterData);
  // xử lý filter
  filterOrders(vFilterData);
}

// hàm sự kiện ấn icon dice 
function onIconDiceClick(paramDiceIcon){
  "use strict";
  var vRowClick = $(paramDiceIcon).closest("tr"); // xác định tr chứa nút bấm được click
  var vTable = $("#user-table").DataTable(); // tạo biên truy xuất đến datatable
  var vDataRow = vTable.row(vRowClick).data(); // lấy dữ liệu của hàng dữ liệu chứa nút bấm
  console.log(vDataRow);

  const vDETAIL_FORM_URL = "diceHistory.html";
  var vUrlSiteToOpen = vDETAIL_FORM_URL +
    "?username=" + vDataRow.username +
    "&firstname=" + vDataRow.firstname +
    "&lastname=" + vDataRow.lastname;
  location.href = vUrlSiteToOpen;
}

// hàm sự kiện ấn icon gift 
function onIconGiftClick(paramDiceIcon){
  "use strict";
  var vRowClick = $(paramDiceIcon).closest("tr"); // xác định tr chứa nút bấm được click
  var vTable = $("#user-table").DataTable(); // tạo biên truy xuất đến datatable
  var vDataRow = vTable.row(vRowClick).data(); // lấy dữ liệu của hàng dữ liệu chứa nút bấm
  console.log(vDataRow);

  const vDETAIL_FORM_URL = "voucherHistory.html";
  var vUrlSiteToOpen = vDETAIL_FORM_URL +
    "?username=" + vDataRow.username +
    "&firstname=" + vDataRow.firstname +
    "&lastname=" + vDataRow.lastname;
  location.href = vUrlSiteToOpen;
}

/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/

// hàm load dữ liệu người dùng lên table dùng DataTable
function loadDataUserToTable(paramUserDataObj){
  "use strict";
  // Chuyển đổi html table thành DataTable và cấu hình cho DataTable
  var vUserTable = $("#user-table").DataTable({
    data: paramUserDataObj,
    columns: [
        { data: gUSERS_COLS[gUSERS_STT_COL] },
        { data: gUSERS_COLS[gUSERS_USER_NAME_COL] },
        { data: gUSERS_COLS[gUSERS_FIRST_NAME_COL] },
        { data: gUSERS_COLS[gUSERS_LAST_NAME_COL] },
        { data: gUSERS_COLS[gUSERS_EMAIL_COL] },
        { data: gUSERS_COLS[gUSERS_AGE_COL] },
        { data: gUSERS_COLS[gUSERS_ROLE_COL] },
        { data: gUSERS_COLS[gUSERS_ACTION_COL] }
    ],
    columnDefs: [
        {
          targets: gUSERS_STT_COL,
          render: sTT
        },
        {
          targets: gUSERS_ROLE_COL,
          render: function(paramRoleId){
                      return getRoleNameByRoleId(paramRoleId);
                  }
        },
        {
          targets: gUSERS_ACTION_COL,
          defaultContent: "<i class='fas fa-dice text-primary' style='cursor:pointer' id='fa-dice' data-toggle='tooltip'  data-placement='top' title='dice'></i> <i class='fas fa-gift text-primary' style='cursor:pointer' id='fa-gift' data-toggle='tooltip'  data-placement='top' title='gift'></i>"
        }
    ]
  });
  soLuongUserInTable(paramUserDataObj);
  //insertRowToTable(paramUserDataObj);
}

// hàm trả về số thứ tự
function sTT(){
    "use strict";
    gStt++;
    return gStt;
}

// hàm trả về role name từ role id
function getRoleNameByRoleId(paramRoleId){
  "use strict";
    var vRoleName = "";
    var vIndex = 0;
    var vIsRoleFound = false;
    while(!vIsRoleFound && vIndex < gRoleObjects.length) {
      if(gRoleObjects[vIndex].roleId === paramRoleId) {
        vIsRoleFound = true;
        vRoleName = gRoleObjects[vIndex].roleName;
      }
      else {
        vIndex ++;
      }
    }
    return vRoleName;
}

// hàm trả về số lượng user có trên bảng là bao nhiêu
function soLuongUserInTable(paramUserObj){
  "use strict";
  var vCount = 0;
  vCount = paramUserObj.length;
  $("#p-message").text("Có " + vCount + " bản ghi thỏa mãn!")
                .show();
}

// hàm load dữ liệu role lên select role form
function loadDataToSelectRole(paramRoleObj){
    "use strict";
    var vRoleSelect = $("#select-role");

    $("<option/>", {
      text: "---Chọn tất cả---",
      value: 0
    }).appendTo(vRoleSelect);

    for(let bI = 0; bI < paramRoleObj.length; bI ++){
      var bRoleOption = $("<option/>", {
        text: paramRoleObj[bI].roleName,
        value: paramRoleObj[bI].roleId
      }).appendTo(vRoleSelect);
    }
}

// hàm thu thập dữ liệu để filter
function getFilterFormData(paramFilterDataObj){
  "use strict";
  paramFilterDataObj.roleId = parseInt($("#select-role").val());
  console.log("paramFilterDataObj.roleId: " + paramFilterDataObj.roleId);
}

// hàm thực hiện lọc và hiển thị kết quả ra table
function filterOrders(paramFilterDataObj){
  "use strict";
  var vUserResult = [];
  // thực hiện việc lọc
  vUserResult = gUserObjects.filter(function(paramUser){
    return (paramFilterDataObj.roleId === 0 || paramUser.roleId === paramFilterDataObj.roleId);
  });
  // load dữ liệu trả về lên table
  var vTable = $("#user-table").DataTable();
  vTable.clear();
  insertRowToTable(vUserResult);
}

// hàm thêm từng dòng dữ liệu vào datatable
function insertRowToTable(paramUserObj){
  "use strict";
  gStt = 0;
  var vTable = $("#user-table").DataTable();
  vTable.rows.add(paramUserObj);
  vTable.draw();
  soLuongUserInTable(paramUserObj);
}