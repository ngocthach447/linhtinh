// list() danh sách các hàm, hướng dẫn sử dụng

var strPermission = '';
var strMenu = '';
var strBearer;
var strListFunction = '';
var permissionAppId = '';

var createBy = 'BOT-IDC';
var appCode = 'FTIIDC';
var appId = 46; // Mã ứng dụng IDC = 46

//thach test
// 0: FunctionId, 1: IdRole(permissionAppId), 2: AppCode, 3: CreateBy , 4: "viewActionId":46 , 5: "updateActionId":26
var strRequestData = '{"lstPermissionFunction":[{"functionId":"{0}","permissionAppId":"{1}","appCode":"{2}","isAccess":"1","createBy":"{3}","viewActionId":{4},"createActionId":0,"updateActionId":{5},"deleteActionId":0,"importActionId":0,"exportActionId":0}]}';
var strGetPerFunctions = '{"AppId":{0},"FunctionId":0,"PermissionAppId":"{1}","PageNumber":1,"PageSize":500}';

var strFunction = '[{"isEnable":"{0}","code":"{1}","displayName":"{2}","path":"{3}","orders":"{4}","parentCode":"{5}","appCode":"{6}","createBy":"{7}"}]';
var strRoleUser = '{"lstRoleUsers":[{"id":0,"roleCode":"{0}","userName":"{1}","isDelete":0,"createBy":"{2}"}]}';


// Thêm quyền user 
async function AddRoleUser(roleCode, userName) {
    input = strRoleUser.f(roleCode, userName, createBy);
    var result = await callAjax('POST', '/api/user/v1/User/AddRoleUsers_v2', input, strBearer)
        .then(res => { return res; })
        .catch(error => console.log(error));

    if (result.code != 200) {
        console.log("Error!:", functionId, result.code, result.message);
    }
    else {
        console.log("Add Role User complete:", userName, roleCode) // thành công           
    }
}
async function GetRoleUser(userName) {
    input = {
        Email: userName,
        Role: '',
        PageSize: 100,
        PageNumber: 1
    };
    var result = await callAjax('GET', '/api/user/v1/User/GetUserRoleByEmail', input, strBearer)
        .then(res => { return res; })
        .catch(error => console.log(error));

    if (result.code != 200) {
        console.log("Error!:", userName);
    }
    else {
        console.log(result.data) // thành công           
    }
    return result.data;
}

async function GetInfoByUser(userName) {
    console.clear();
    console.log('%cList User Role', 'color: #bada55');

    // Lấy thông tin user
    var infoUser = await GetUserByEmail(userName);
    if (infoUser) {
        console.log('%cInfo User:', 'color: #bada55', infoUser.userId, '-', infoUser.userName, '-', infoUser.fullName, '-', infoUser.email, '-', infoUser.phone);
        console.log(infoUser.positionName, infoUser.divisionName, infoUser.departmentName);

    }
    // Lấy danh sách Role của appID
    var input = {
        AppId: appId,
        RoleId: 0,
        PageSize: 100,
        PageNumber: 1
    };
    var PermissionApps = await callAjax('POST', '/api/user/v1/permissionapp/GetPermissionApps', JSON.stringify(input), strBearer)
        .then(res => { return res; })
        .catch(error => console.log(error));
    if (PermissionApps.code != 200) {
        console.log("Error!:", permissionAppId);
        return;
    }
    var listRole = await GetRoleUser(userName);
    for (var func of listRole) {
        var roleId = 0;
        role = PermissionApps.data.filter(i => i.roleCode == func.code)[0];
        if (role)
            roleId = role.id;
        if (roleId) {
            listFunction = await getPermissionFunctions(roleId);
            console.log('%cList User By Role ', 'color: #bada55', func.code);
            if (listFunction.length == 0) {
                console.log('%cNot found by ', 'color: RED', func.code);
            }
            else {

                console.log(listFunction);
            }
        }
    }
}

async function GetUserByEmail(userName) {
    input = {
        email: userName,
        departmentCode: '',
        divisionCode: '',
        roleCode: '',
        PageSize: 1,
        PageNumber: 1
    };
    var result = await callAjax('GET', '/api/user/v1/User/Find', input, strBearer)
        .then(res => { return res; })
        .catch(error => console.log(error));
    if (result.code != 200) {
        console.log("Error!:", 'GetUserByEmail');
    }
    else if (!result.data[0]) {
        return null;
    }
    return result.data[0];
}

async function DelRoleUser(idRole, userName) {
    input = {
        id: idRole,
        UpdateBy: createBy,
        Code: userName
    };
    var result = await callAjax('DELETE', '/api/user/v1/roleuser/Delete_v2', input, strBearer)
        .then(res => { return res; })
        .catch(error => console.log(error));

    if (result.code != 200) {
        console.log("Error!:", userName, result.message);
    }
    else {
        console.log(result.message) // thành công           
    }
}
async function ConfirmPermissionbyID() {
    input = {
        AppId: appId,
        RoleId: 0,
        PageSize: 1000,
        PageNumber: 1
    };
    var result = await callAjax('POST', '/api/user/v1/permissionapp/GetPermissionApps', JSON.stringify(input), strBearer)
        .then(res => { return res; })
        .catch(error => console.log(error));
    if (result.code != 200) {
        console.log("Error!:", permissionAppId);
    }
    else {
        res = result.data.filter(i => i.id == permissionAppId);
        if (res.length == 1) {
            return confirm("Vui lòng kiểm tra các dữ liệu : " +
                "\n permissionAppId : " + permissionAppId +
                "\n AppID : " + appId +
                "\n appCode : " + appCode +
                "\n ROLE : " + res[0].roleCode + " : " + res[0].roleName
            );
        }
    }
    console.log("%cError -- Check lại các config", 'color: RED');
    return false;
}

//DANH SÁCH CHỨC NĂNG

//Thêm list chức năng từ strListFunction,strFunction
async function AddFunction(strInput) {

    input = strFunction.f(strInput.isEnable, strInput.code, strInput.displayName, strInput.path, strInput.orders,
        strInput.parentCode, appCode, createBy);
    var result = await callAjax('POST', '/api/user/v1/function/Post', input, strBearer)
        .then(res => { return res; })
        .catch(error => console.log(error));

    if (result.code != 200) {
        console.log("Error!:", functionId, result.code, result.message);
    }
    else {
        console.log("Add complete:", functionId) // thành công           
    }
    return result.code;
}
//Thêm list chức năng từ strListFunction
async function AddListFunction() {
    // lấy danh dách function
    flag = 0;
    var listFunction = JSON.parse(strListFunction);
    funcCodeOld = '';
    for (var func of listFunction) {
        if (funcCodeOld != func.code);
        {
            funcCodeOld = func.code;
            var resultCode = await AddFunction(func);
            // Lỗi thì out ko add tiếp
            if (resultCode != 200) {
                break;
            }
        }
        flag++;
        console.log("add complete:", flag, "/", listFunction.length, func.code) // thành công    
    }
};
//Ẩn/hiện menu / cập nhật DisplayName (update function)
async function UpdateMenu(isShow = 0) {
    // Get menu by ID 
    // https://ftms-stag.fpt.net/api/user/v1/function/GetById?Id=16606
    // {"status":"OK","message":"Success","code":200,"data":{"isDelete":0,"createBy":"viethq14","transactionDate":"2022-06-15T10:16:08","updateBy":"viethq14","updateDate":"2022-06-15T10:16:08","totalRow":1,"appName":null,"id":16606,"code":"IDCV3.SERVICE.REQUEST","description":null,"displayName":"Xử lý yêu cầu dịch vụ","parentCode":"IDCV3.SERVICE","appCode":"FTIIDC","orders":2,"host":null,"prefix":null,"path":"/idc/V3/Service/Excess","cssClass":"nav-icon fa fa-genderless","isEnable":1}}
    // Put menu by ID
    // https://ftms-stag.fpt.net/api/user/v1/function/Put
    // {"isDelete":0,"createBy":"viethq14","transactionDate":"2022-06-15T10:16:08","updateBy":"thachtn9","updateDate":"2022-06-15T10:16:08","totalRow":1,"appName":null,"id":16606,"code":"IDCV3.SERVICE.REQUEST","description":null,"displayName":"Xử lý yêu cầu dịch vụ","parentCode":"IDCV3.SERVICE","appCode":"FTIIDC","orders":2,"host":null,"prefix":null,"path":"/idc/V3/Service/Excess","cssClass":"nav-icon fa fa-genderless","isEnable":0}
    listMenu = JSON.parse(strMenu);
    countMenu = listMenu.length;
    flag = 0;
    for (var v of listMenu) {

        var id = { id: v.ID }
        var result = await callAjax('GET', '/api/user/v1/function/GetById', id, strBearer).then(res => {
            return res;
        }).catch(error => console.log(error));

        if (result.code != 200) {
            console.log("Error!!! : ", v.ID, v.displayName);
            break;
        }
        else {
            flag++;
            var inputMenu = result.data;
            inputMenu.isEnable = isShow == -1 ? inputMenu.isEnable : isShow; //if isShow = -1 thì chỉ cập nhật displayName
            inputMenu.updateBy = createBy;
            inputMenu.displayName = v.displayName;
            var input = JSON.stringify(inputMenu);
            var resultPut = await callAjax('PUT', '/api/user/v1/function/Put', input, strBearer).then(res => {
                return res;
            }).catch(error => console.log(error));
            if (resultPut.code != 200) {
                console.log("Error Put !!! : ", v.ID, v.displayName);
                break;
            }
            else {
                console.log("Complete:", flag, "/", countMenu, v.displayName) // thành công

            }
        }
    }
    console.log("DONE", "UpdateMenu")
}
async function getFunctions(filter = '') {
    input = {
        Code: '',
        ParentCode: '',
        AppCode: appCode,
        PageSize: 500,
        PageNumber: 1
    };
    listfunc = '';
    var result = await callAjax('GET', '/api/user/v1/function/Find', input, strBearer)
        .then(res => { return res; })
        .catch(error => console.log(error));

    if (result.code != 200) {
        console.log("Error:", result.code, result.message);
    }
    else {
        listfunc = result.data.filter(i => i.code.includes(filter)).sort((a, b) => parseFloat(a.id) - parseFloat(b.id)).map(i => ({
            id: i.id,
            code: i.code,
            displayName: i.displayName,
            parentCode: i.parentCode,
            orders: i.orders,
            path: i.path,
            cssClass: i.cssClass,
            isEnable: i.isEnable
        }))
        console.log(listfunc) // thành công     
        console.log("complete: Get Function") // thành công           
    }
    return listfunc;
};
async function delAllFuntionbyAppcode() {
    // lấy danh dách function
    console.log("Xóa từng cái đi.");
};
// xóa 1 quyền theo ID
async function delFunction(functionId) {
    var result = await callAjax('DELETE', '/api/user/v1/function/Delete?Id={0}'.f(functionId), null, strBearer)
        .then(res => { return res; })
        .catch(error => console.log(error));

    if (result.code != 200) {
        console.log("Error!:", functionId, result.code, result.message);
    }
    else {
        console.log("Delete complete:", functionId) // thành công           
    }
    return result.code;
};
//PHÂN QUYỀN CHỨC NĂNG
async function getPermissionFunctions(_permissionAppId = 0) {    //permissionAppId khai báo ở trên.
    input = strGetPerFunctions.f(appId, _permissionAppId ?? permissionAppId);
    var result = await callAjax('POST', '/api/user/v1/permissionfunction/GetPermissionFunctions', input, strBearer)
        .then(res => { return res; })
        .catch(error => console.log(error));
    return result.data;
};
async function runPermission(action = 0) {    //action = 0 : View, 1: View + Update
    if (!ConfirmPermissionbyID()) return;
    flag = 0;
    var listPer = JSON.parse(strPermission);
    var perOld = '';
    for (var p of listPer) {
        if (perOld != p.functionCode) {
            perOld = p.functionCode;
            input = strRequestData.f(p.functionId, permissionAppId, appCode, createBy, 46, action == 1 ? 26 : 0);
            var result = await callAjax('POST', '/api/user/v1/permissionfunction/AddPermissionFunctions', input, strBearer)
                .then(res => { return res; })
                .catch(error => console.log(error));
            if (result.code != 200) {
                console.log("Error!!! : ", v.ID, v.displayName);
                break;
            }
        }
        flag++
        console.log("Add complete:", flag, "/", listPer.length, p.functionId, p.functionName) // thành công    
    }
    console.log("---Add DONE---");
};
async function Del_Add_AllPermissionByRole(type, filter, action) {
    var isDelect = await delAllPermissionByRole(type, filter);
    if (isDelect) {
        runPermission(action);
    }
}
// xóa tất cả quyền theo ID Role
// xóa hết các quyền theo permissionAppId , type = 0 tìm chính xác, 1: tìm like, strfilter : tìm theo functionCode
async function delAllPermissionByRole(type = 0, strfilter = '') {
    if (!ConfirmPermissionbyID()) return;
    flag = 0;
    strfilter = 'IDCV3';
    isE = true;
    // lấy danh dách function
    listFunction = await getPermissionFunctions();
    //danh sách theo filter 
    listFunctionDel = listFunction.filter(i => i.functionCode.includes(strfilter) && (type == 0 ? i.functionCode == strfilter : 1 == 1));
    if (listFunctionDel.length == 0) {
        console.log('not found function by filter');
        return true;
    }
    for (var func of listFunctionDel) {
        var resultCode = await delPermission(func.id);
        // Lỗi thì out ko xóa tiếp
        if (resultCode != 200) {
            isE = false;
            break;
        }
        else {
            flag++
            console.log("Delete complete:", flag, "/", listFunctionDel.length, func.functionCode); // thành công 
        }
    }
    console.log("---Delete DONE---");
    return isE;
};
// xóa 1 quyền theo ID
async function delPermission(perId) {
    var result = await callAjax('DELETE', '/api/user/v1/permissionfunction/Delete?Id={0}'.f(perId), null, strBearer)
        .then(res => { return res; })
        .catch(error => console.log(error));

    if (result.code != 200) {
        console.log("Error!:", perId, result.code, result.message);
    }
    return result.code;
};
//Tool
async function callAjax(method = 'GET', url, input = null, strAuthor = '') {
    if (method == 'GET') {
        return await GetPromise(url, input, strAuthor);
    }
    else if (method == 'POST') {
        return await PostPromise(url, input, strAuthor);
    }
    else if (method == 'PUT') {
        return await PutPromise(url, input, strAuthor);
    }
    else if (method == 'DELETE')
        return await DeletePromise(url, input, strAuthor);
}
function PostPromise(url, input = null, strAuthor = '') {
    return new Promise((resolve, reject) => {
        var postData = {
            dataType: "json",
            type: "POST",
            data: input,
            contentType: 'application/json',
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strAuthor);
            },
            success: function (data) {
                resolve(data)
            },
            failure: function (data) {
                reject(data)
            },
            error: function (data) {
                reject(data)
            }
        };

        $.ajax(postData);
    })
}
function GetPromise(url, input = null, strAuthor = '') {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            data: input,
            dataType: "json",
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strAuthor);
            },
            success: function (data) {
                resolve(data)
            },
            failure: function (data) {
                reject(data)
            },
            error: function (data) {
                reject(data)
            }
        });
    })
}
function PutPromise(url, input = null, strAuthor = '') {

    return new Promise((resolve, reject) => {
        $.ajax({
            dataType: "json",
            type: "PUT",
            data: input,
            contentType: 'application/json',
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strAuthor);
            },
            success: function (data) {
                resolve(data)
            },
            failure: function (data) {
                reject(data)
            },
            error: function (data) {
                reject(data)
            }
        });
    })
}
function DeletePromise(url, input = null, strAuthor = '') {

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "DELETE",
            data: input,
            dataType: "json",
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strAuthor);
            },
            success: function (data) {
                resolve(data)
            },
            failure: function (data) {
                reject(data)
            },
            error: function (data) {
                reject(data)
            }
        });
    })
}

function list() {
    console.log("%c --- DANH SÁCH PHÂN QUYỀN ---", 'color: RED');

    console.log("%cAddFunction()", 'color: #bada55', "\n\tLấy tất cả chức năng theo nhóm quyền permissionAppId");
    console.log("%cAddListFunction()", 'color: #bada55', "\n\tLấy tất cả chức năng theo nhóm quyền permissionAppId");
    console.log("%cUpdateMenu()", 'color: #bada55', "\n\tLấy tất cả chức năng theo nhóm quyền permissionAppId");
    console.log("%cgetFunctions()", 'color: #bada55', "\n\tLấy tất cả chức năng theo nhóm quyền permissionAppId");
    console.log("%cdelAllFuntionbyAppcode()", 'color: #bada55', "\n\tLấy tất cả chức năng theo nhóm quyền permissionAppId");
    console.log("%cdelFunction()", 'color: #bada55', "\n\tLấy tất cả chức năng theo nhóm quyền permissionAppId");

    console.log("%c --- PHÂN QUYỀN CHỨC NĂNG ---", 'color: RED');

    console.log("%cgetPermissionFunctions()", 'color: #bada55', "\n\tLấy tất cả chức năng theo nhóm quyền permissionAppId");
    console.log("%crunPermission(action)", 'color: #bada55', "\n\tThêm mới các quyền (strPermission) vào nhóm quyền permissionAppId, action = 0 : View, 1: View + Update");
    console.log("%cdelPermission(functionId)", 'color: #bada55', "\n\tXóa quyền theo functionID của nhóm quyền permissionAppId");
    console.log("%cdelAllPermissionByRole(type,strfilter)", 'color: #bada55', "\n\tXóa hết các quyền theo permissionAppId , type = 0 tìm chính xác, 1: tìm like, strfilter : tìm theo functionCode");
    console.log("%cUpdateMenu(isShow)", 'color: #bada55', "\n\tCập nhật menu từ listMenu.\n isShow:  Ẩn = 0, Hiện = 1, chỉ displayName = -1");

    console.log("%setstrPermissionProd()", 'color: #bada55', "\n\t Cập nhật string Permission, permissionAppId Product");

    console.log('%c Cập nhật các biến trước khi thao tác tiếp: strPermission  strMenu  strBearer  strFunction  permissionAppId  createBy  appCode appId', "color: red; font-size: 20px");
}
$(document).ready(function () {

    String.prototype.format = String.prototype.f = function () {
        var s = this,
            i = arguments.length;

        while (i--) {
            s = s.replace(new RegExp("\\{" + i + "\\}", "gm"), arguments[i]);
        }
        return s;
    };

    console.clear();
    strBearer = JSON.parse(localStorage.getItem("currentUser")).publicToken;
    if (strBearer == "") {
        console.log("%c strBearer chưa được cập nhật, vui lòng bổ sung.", 'color: RED');
    }
    else {
        console.log("%c Đã cập nhật token: ", 'color: #bada55', strBearer);
    }
});
