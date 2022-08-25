var strMenu = '[{"ID":12476,"displayName":"Chuyển pháp nhân"},{"ID":12456,"displayName":"Duyệt yêu cầu"},{"ID":12466,"displayName":"Tạo yêu cầu"},{"ID":12446,"displayName":"Thực hiện yêu cầu"},{"ID":12596,"displayName":"Quản lý DataCenter"},{"ID":12626,"displayName":"Tra cứu Rack"},{"ID":12616,"displayName":"Thực hiện"},{"ID":12606,"displayName":"Kết quả"},{"ID":12516,"displayName":"Gia hạn phụ lục"},{"ID":12496,"displayName":"Duyệt yêu cầu"},{"ID":12506,"displayName":"Tạo yêu cầu"},{"ID":12486,"displayName":"Thực hiện yêu cầu"},{"ID":12746,"displayName":"Khởi tạo"},{"ID":12366,"displayName":"Nghiệm thu"},{"ID":12356,"displayName":"Triển khai"},{"ID":12636,"displayName":"Danh sách triển khai"},{"ID":12716,"displayName":"Khảo sát"},{"ID":12656,"displayName":"Danh sách khảo sát"},{"ID":12556,"displayName":"Chuyển dịch vụ"},{"ID":12536,"displayName":"Duyệt yêu cầu"},{"ID":12546,"displayName":"Tạo yêu cầu"},{"ID":12526,"displayName":"Thực hiện yêu cầu"},{"ID":12586,"displayName":"Quản trị dịch vụ"},{"ID":12376,"displayName":"Profile Dịch vụ"},{"ID":12026,"displayName":"Xác nhận Yêu cầu xóa"},{"ID":12386,"displayName":"Xử lý yêu cầu dịch vụ"},{"ID":12436,"displayName":"Nâng cấp - Hạ cấp"},{"ID":12416,"displayName":"Duyệt yêu cầu"},{"ID":12426,"displayName":"Tạo yêu cầu"},{"ID":12406,"displayName":"Thực hiện yêu cầu"},{"ID":12396,"displayName":"Gửi lại yêu cầu"}]';
var createBy = 'BOT-IDC';
var appCode = 'FTIIDC';
var strBearer;
//Ẩn/hiện menu / cập nhật DisplayName (update function)
async function UpdateMenu(isShow = 0) {
    console.clear();
    if (!strMenu) {
        console.log('%c Không tìm thấy strMenu ', 'color: RED');
        showNotification(2, ' Không tìm thấy strMenu ', 1)
        return;
    }
    showAwaitUpdate()
    console.log('%c -- START -- ', 'color: #bada55');
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
                changeStatusAwait("Error : " + v.displayName);
                break;
            }
            else {
                console.log("Complete:", flag, "/", countMenu, v.displayName) // thành công
                changeStatusAwait(v.displayName);
            }
        }
    }
    showNotification(0, ' -- DONE -- ', 1)
    console.log('%c -- DONE -- ', 'color: #bada55');
    if (localStorage.getItem("currentUser")) {
        id = JSON.parse(localStorage.getItem("currentUser")).currentUser.id;
        console.log('%cXóa cache Redis : ' + id + 'FTIIDC', 'color: yellow');
    }

}

function onRun() {
    console.clear();
    if (localStorage.getItem("currentUser")) {
        strBearer = JSON.parse(localStorage.getItem("currentUser")).publicToken;
        if (strBearer == "") {
            console.log("%c strBearer chưa được cập nhật, vui lòng bổ sung.", 'color: RED');
        }
        else {
            console.log("%c Đã cập nhật token: ", 'color: #bada55', strBearer);
        }
    }
    else {
        console.log("%c strBearer chưa được cập nhật, vui lòng bổ sung.", 'color: RED');
    }
    UpdateMenu(1);
};
onRun();
//XÓA CACHE


String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp("\\{" + i + "\\}", "gm"), arguments[i]);
    }
    return s;
};