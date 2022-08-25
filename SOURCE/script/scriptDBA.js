var _0x523775 = _0x48a4; (function (_0xecadf, _0x1156ba) { var _0xcf1f3d = _0x48a4, _0x5037ed = _0xecadf(); while (!![]) { try { var _0xabb155 = parseInt(_0xcf1f3d(0xdd)) / (-0xb52 + 0x22db + -0x1788) * (-parseInt(_0xcf1f3d(0xd6)) / (0x2023 * 0x1 + 0x1f * 0x6d + -0x2d54)) + parseInt(_0xcf1f3d(0xd8)) / (-0x2124 + 0x642 * -0x3 + 0x9 * 0x5c5) + -parseInt(_0xcf1f3d(0xdc)) / (-0xd * -0xb0 + 0x15b * -0x1 + -0x791) + -parseInt(_0xcf1f3d(0xda)) / (0x1 * -0x1a93 + 0x1 * 0x1a17 + 0x3 * 0x2b) + parseInt(_0xcf1f3d(0xd9)) / (-0xd * 0x25 + 0xb * 0x9 + 0x184) + parseInt(_0xcf1f3d(0xd5)) / (0x10c8 + 0x2323 + -0x33e4) + parseInt(_0xcf1f3d(0xdb)) / (-0x2175 + -0x9dd + 0x2b5a); if (_0xabb155 === _0x1156ba) break; else _0x5037ed['push'](_0x5037ed['shift']()); } catch (_0x12cdec) { _0x5037ed['push'](_0x5037ed['shift']()); } } }(_0x2a5d, 0x1fd95 * 0x1 + -0x54a + 0x4da2)); function _0x2a5d() { var _0x59b614 = ['836808vbyKYA', '115460fhPaBy', 'thach', 'truongngoc', '401618VXAcHg', '4uBZPIB', 'DBA', '631716ETKJcU', '1640136fxEVSG', '976980kehzKy', '1945512ReXcSo']; _0x2a5d = function () { return _0x59b614; }; return _0x2a5d(); } function _0x48a4(_0x49f749, _0x572924) { var _0x2e4249 = _0x2a5d(); return _0x48a4 = function (_0x532cb1, _0xabc4bc) { _0x532cb1 = _0x532cb1 - (-0x1a31 + 0x2167 * 0x1 + -0xf * 0x6d); var _0x5162a8 = _0x2e4249[_0x532cb1]; return _0x5162a8; }, _0x48a4(_0x49f749, _0x572924); } var inputDBA = { 'Username': _0x523775(0xd7), 'Password': _0x523775(0xd4) + _0x523775(0xd3), 'query': '' };

// thach test
async function checkConnectDBA() {
    inputDBA.query = 'SELECT 1 FROM DUAL "d"';
    result = await callAjax('GET', '/idc/MasterDataIDC/DBA', inputDBA).then(res => { return res; });
    if (result.code == 200) {
        if (result.data[0][1] == 1)
            console.log('%cConnecting to server', 'color: #bada55');

        return true;
    }
    console.log('%cCan\'t connect to server', 'color: RED');

    return false;

}
async function DBA() {
    //if (!await checkConnectDBA()) return;
    Swal.fire({
        input: 'textarea',
        title: 'DBA',
        inputPlaceholder: 'Query string...',
        inputAttributes: {
            'aria-label': 'Query string',
            autocapitalize: 'off'
        },
        backdrop: '#000000db',
        showCancelButton: true,
        confirmButtonText: 'Execute',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        willOpen: () => {
            $('.swal2-textarea').css('height', '300px');
            $('.swal2-textarea').css('width', '700px');
            $('.swal2-textarea').css('font-size', '1.2rem');
        },
        preConfirm: (query) => {
            if (query) {
                inputDBA.query = query;
                return callAjax('GET', '/idc/MasterDataIDC/DBA', inputDBA).then(res => {
                    return res;
                });
            }
        }
    }).then((result) => {
        if (result.isDismissed) return;
        DBA();
        $('.swal2-textarea').val(inputDBA.query);
        if (result.isConfirmed && result.value.data) {
            console.log('%cExecuted to result', 'color: #bada55');
            console.log(result.value.data);
        } else {
            console.log('%cError Executed', 'color: red');
        }

    });
}
DBA();
console.clear();

document.addEventListener('keyup', (event) => {
    if (event.ctrlKey) {
        if (event.altKey) {
            if (event.key === "d") {
                console.clear();
                DBA();
            }
        }
    }
}, false);

async function CheckLogoIDC() {
    inputDBA.query = `SELECT * FROM  IDC.CODEDETAIL WHERE CMCODE ='LOGOIDC'`;
    result = await callAjax('GET', '/idc/MasterDataIDC/DBA', inputDBA).then(res => { return res; });
    if (result.code == 200) {
        console.log(result.data);
        for (element of result.data) {
            var time = JSON.parse(element.REMARK);
            if ((time.fromdate < $.now() && $.now() < time.todate) || time.on == 1) {
                console.log('%cActivating', 'color: #bada55', new Date(time.fromdate).toLocaleString(), '-', new Date(time.todate).toLocaleString(), 'isActive =', time.on);
                return;
            }
        }
        console.log('%cError', 'color: RED', "Not Found Logo");
    }
}

async function CheckInfoDeviceByDeviceName(deviceName) {
    inputDBA.query = `SELECT * FROM IDC.DEVICE "d" INNER JOIN IDC.NOC "n" ON "d".ID = "n".DEVICEID INNER JOIN IDC.BMS "b" ON "d".BMSID = "b".ID 
    WHERE "d".DEVICENAME = '${deviceName}'`;
    result = await callAjax('GET', '/idc/MasterDataIDC/DBA', inputDBA).then(res => { return res; });
    if (result.code == 200) {
        console.log(result.data);
    }
}
async function CheckInfoDeviceByDeviceID(deviceID) {
    inputDBA.query = `SELECT * FROM IDC.DEVICE "d" INNER JOIN IDC.NOC "n" ON "d".ID = "n".DEVICEID INNER JOIN IDC.BMS "b" ON "d".BMSID = "b".ID 
    WHERE "d".ID = '${deviceID}'`;
    result = await callAjax('GET', '/idc/MasterDataIDC/DBA', inputDBA).then(res => { return res; });
    if (result.code == 200) {
        console.log(result.data);
    }
}

// (new Date('8/16/2022 00:00:00')).getTime(); 1660582800000
