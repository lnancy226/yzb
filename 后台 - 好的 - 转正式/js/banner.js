/**
 * Created by 919482722 on 2017/9/7.
 */
/*******   广告位管理/banner图管理   *********/
//获取表格数据
initData();
function initData() {
    var Authorization= $.cookie("Authorization");
    //获取表格数据
    requestTableData();
    //获取表格数据
    function requestTableData(){
        $("#addContainer").hide();
        var dataSource = [];
        var dataObj = {};
        var jsonData;
        var data = {
            pageNum: 1
        };
        var params = JSON.stringify(data);
        $.ajax({
            type: "put",
            url: "http://116.62.131.70:8081/roo-sys-web/adv/read/page",      //获取banner数据接口
            contentType: "application/json;charset=utf-8",
            data: params,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization",Authorization);
            },
            dataType: "JSON",
            success: function (data) {
                console.log(data.data,"banner");
                var numberArray = [];
                $.each(data.data, function (index, value) {
                    numberArray.push(value.sortNo);
                    dataObj = {
                        "img": "<img style='width:200px;' src=" + value.content.picUrl + ">",
                        "sort": "<input type='text' value='" + value.sortNo + "' style='width:40px;text-align:center;' onchange=sortBanner('" + value.id + "'," + value.content.type + ",'" + value.advTitle + "','" + value.content.picUrl + "',$(this).val(),'" + value.content.typeValue + "') />",
                        "operate": "<a style='color:#bda34a;cursor: pointer;' onclick=editRow($(this),'" + value.id + "'," + value.content.type + ",'" + value.content.picUrl + "'," + value.sortNo + ",'" + value.content.typeValue + "','" + value.advTitle + "')>编辑</a><span>&nbsp;&nbsp;</span>" +
                        "<a style='color:#bda34a;cursor: pointer;' onclick=deleteRow($(this),'" + value.id + "')>删除</a>"
                    };
                    jsonData = JSON.parse(JSON.stringify(dataObj));
                    dataSource.push(jsonData);
                });
                console.log(numberArray, "number");
                //表格插件
                $("#goodTable").bootstrapTable({
                    data: dataSource,
                    pageNumber: 1,
                    pageSize: 5,
                    pageList: [5, 10, 20],
                    bPaginate: true, //翻页功能
                    paginationLoop: false,
                    paginationPreText: '上一页',
                    paginationNextText: '下一页',
                    showColumns: true,
                    exportDataType: "selected",
                    sidePagination: "client",
                    clickToSelect: true,
                    detailView: false,
                    onPageChange: function (number, size) {
                        $(".pagination").css("margin-top", "0px");
                    },
                    columns: [
                        {
                            title: '图片'
                        }, {
                            title: '排序', width: 300,
                            sortable: true
                        }, {
                            title: '操作'
                        }]
                });
                $(".fixed-table-loading").css("display", "none");
                $(".pagination").css("margin-top", "0px");
            }
        });
    }
    //添加Banner
    function addBanner(){
        $("#container").hide();
        $("#addContainer").show();
        //定义需要提交的参数
        var type, typeValue, picUrl;
        //上传新图片
        $("#upload").click(function () {
            $("#uploadImg").click();
        });
        function ProcessFile(e) {
            var file = document.getElementById('uploadImg').files[0];
            var img = document.getElementById("bannerImg");
            var fd = new FormData();//创建一个fromdata
            fd.append("file", file); //将参数名与参数值以key value形式组合起来
            if (file) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    var txt = event.target.result;
                    //img.src = txt;
                };
            }
            $.ajax({
                type: "post",
                url: "http://116.62.131.70:8081/roo-sys-web/image",    //上传图片的接口
                contentType: false,
                processData: false,
                file: file,
                dataType: "JSON",
                data: fd,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", Authorization);
                },
                success: function (data) {
                    img.src = data.data.url;
                    picUrl = data.data.url;
                }
            });
            reader.readAsDataURL(file);
        }

        function contentLoaded() {
            document.getElementById('uploadImg').addEventListener('change',
                ProcessFile, false);
        }
        contentLoaded();
        //选择分类
        $("#classify").change(function () {
            if ($("#classify").find("option:selected").val() == 2) {
                $(".urlDiv").hide();
                $(".addressDiv").show();
            }
            if ($("#classify").find("option:selected").val() == 1) {
                $(".addressDiv").hide();
                $(".urlDiv").show();
            }
        });
        //提交
        $("#submit").click(function () {
            type = $("#classify").find("option:selected").val();
            if (type == 2) {
                typeValue = $("#curio").find("option:selected").val();
            } else if (type == 1) {
                typeValue = $("#urlAddress").val();
            }
            var submitData = JSON.stringify({
                type: type,
                advTitle: $("#title").val(),
                picUrl: picUrl,
                sortNo: 0,
                typeValue: typeValue
            });
            $.ajax({
                type: "post",
                url: "http://116.62.131.70:8081/roo-sys-web/adv",
                contentType: "application/json;charset=utf-8 ",
                data: submitData,
                dataType: "JSON",
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", Authorization);
                },
                success: function (data) {
                    console.log(data, "提交");
                    if (data.httpCode == 200) {
                        alert("提交成功");
                        $("#addContainer").hide();
                        $("#container").show();
                        window.location.reload();
                    }
                }
            })
        });
    }
    //添加Banner
    $("#addBanner").click(function () {
        addBanner();
    });
    //返回上一级
    $(".back").click(function () {
        $("#container").show();
        $("#addContainer").hide();
    });
}

//*********************************排序********************************//
function sortBanner(id,type,advTitle,picUrl,sortNo,typeValue){
    var Authorization= $.cookie("Authorization");
    var idData = JSON.stringify({
        id:id,
        type:type,
        advTitle:advTitle,
        picUrl:picUrl,
        sortNo:sortNo,
        typeValue:typeValue
    });
    $.ajax({
        type:"put",
        url:"http://116.62.131.70:8081/roo-sys-web/adv",
        contentType: "application/json;charset=utf-8",
        data:idData,
        dataType: "JSON",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", Authorization);
        },
        success:function(data){
            if(data.httpCode == 200){
                console.log("排序成功");
                $(this).val(sortNo);
                window.location.reload();
            }
        }
    });
}
//*********************************删除Banner*****************************//
//删除广告*********封装函数*********//
function deleteRow(obj,id){
    var Authorization= $.cookie("Authorization");
    var idData = JSON.stringify({
        id:id
    });
    $.ajax({
        type:"delete",
        url:"http://116.62.131.70:8081/roo-sys-web/adv/"+id,
        contentType: "application/json;charset=utf-8",
        data:idData,
        dataType: "JSON",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", Authorization);
        },
        success:function(data){
            console.log(data,"删除广告");
            if(data.httpCode == 200){
                $(obj).parents("tr").remove();
                window.location.reload();
            }
        }
    });
}
//*********************************编辑Banner*****************************//
//选择省份
$(function(){
    var Authorization = $.cookie("Authorization");
    var provinceData = JSON.stringify({
        parentId:0
    });
    $.ajax({
        type:"put",
        url:"http://116.62.131.70:8081/roo-sys-web/cnarea/read/list",
        contentType: "application/json;charset=utf-8 ",
        data:provinceData,
        dataType: "JSON",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", Authorization);
        },
        success:function(data){
            console.log(data,"省");
            $.each(data.data,function(index,value){
                $("#province").append("<option value=" + value.id + ">" + value.mergerName + "</option>");    //取到所有省份并将其导入到select中
            });
            //当省份更改的时候调取到相应市的数据
            $("#province").change(function () {
                var provinceId = $(this).find("option:selected").val();
                var cityData = JSON.stringify({
                    parentId:provinceId
                });
                $("#city").find("option").remove();
                $("#curio").find("option").remove();
                requestCityData(cityData);
            });
        }
    })
});
//获取当前省份下市的数据，封装好的函数
function requestCityData(cityData){
    var Authorization= $.cookie("Authorization");
    $.ajax({
        type:"put",
        url:"http://116.62.131.70:8081/roo-sys-web/cnarea/read/list",
        contentType: "application/json;charset=utf-8 ",
        dataType: "JSON",
        data:cityData,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", Authorization);
        },
        success:function(data){
            console.log(data,"市");
            $.each(data.data,function(index,value){
                $("#city").append("<option value=" + value.id + ">" + value.name + "</option>");  //取到当前省份下的市并将其导入到select中
            });
            var cityId = data.data[0].id;
            var curioData=JSON.stringify({
                pageSize:-1,
                cityId:cityId
            });
            requestCurioData(curioData);
            //当市更改的时候调取到相应市的数据
            $("#city").change(function () {
                $("#curio").find("option").remove();
                var cityId = $(this).find("option:selected").val();
                var curioData = JSON.stringify({
                    pageSize:-1,
                    cityId:cityId
                });
                requestCurioData(curioData);
            });
        }
    })
}
//古玩城，封装好的函数
function requestCurioData(curioData){
    var Authorization= $.cookie("Authorization");
    $.ajax({
        type:"put",
        url:"http://116.62.131.70:8081/roo-sys-web/rooCuriocity/read/page",
        contentType: "application/json;charset=utf-8 ",
        data:curioData,
        dataType: "JSON",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", Authorization);
        },
        success:function(data){
            //取到所有古玩城并将其导入到select中
            console.log(data,"古玩城");
            var curioArray = [];
            $.each(data.data,function(index,value){
                $("#curio").append("<option value=" + value.id + ">" + value.curiocityName + "</option>");
                curioArray.push(value.curiocityName);
            });
            console.log(curioArray.length);
            if(curioArray.length == 0){
                $("#curio").append("<option>该城市暂无古玩城</option>");
            }
        }
    })
}
//todo编辑广告*********封装函数*********//
function editRow(obj,id,type,picUrl,sortNo,typeValue,advTitle){
    var editPicUrl,editType,editTypeValue;
    //编辑页面展示
    $("#container").hide();
    $("#addContainer").show();
    $("#addOrEdit").html("编辑Banner");
    $("#bannerImg").attr("src",picUrl);
    $("#title").val(advTitle);
    //如果广告是古玩城类型获取古玩城的省份、市
    if(type == 1){
        $("#classify").find("option").eq(1).attr("selected","selected");
        $(".addressDiv").hide();
        $(".urlDiv").show();
        $("#urlAddress").val(typeValue);
    }else if(type == 2){
        $("#classify").find("option").eq(0).attr("selected","selected");
        $(".addressDiv").show();
        $(".urlDiv").hide();
        //调用详情接口
        var Authorization= $.cookie("Authorization");
        var _dataCityId;
        $.ajax({
            type:"get",
            url:"http://116.62.131.70:8081/roo-sys-web/adv/"+id,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", Authorization);
            },
            success:function(data){
                console.log(data,"详情接口");
                if(data.httpCode == 200){
                    var _data = data.data.content.typeValue;
                    _dataCityId = _data.cityId;
                    $("#province option[value="+ _data.proviceId +"]").attr("selected","selected");
                    var parentId = JSON.stringify({
                        parentId:_data.proviceId
                    });
                    //取到省、市、古玩城的数据
                    var Authorization= $.cookie("Authorization");
                    $.ajax({
                        type:"put",
                        url:"http://116.62.131.70:8081/roo-sys-web/cnarea/read/list",
                        contentType: "application/json;charset=utf-8 ",
                        dataType: "JSON",
                        data:parentId,
                        beforeSend: function (request) {
                            request.setRequestHeader("Authorization", Authorization);
                        },
                        success:function(data){
                            console.log(data,"市");
                            $.each(data.data,function(index,value){
                                $("#city").append("<option value=" + value.id + ">" + value.name + "</option>");  //取到当前省份下的市并将其导入到select中
                            });
                            var cityId = data.data[0].id;
                            var curioData=JSON.stringify({
                                pageSize:-1,
                                cityId:cityId
                            });
                            var Authorization= $.cookie("Authorization");
                            $.ajax({
                                type:"put",
                                url:"http://116.62.131.70:8081/roo-sys-web/rooCuriocity/read/page",
                                contentType: "application/json;charset=utf-8 ",
                                data:curioData,
                                dataType: "JSON",
                                beforeSend: function (request) {
                                    request.setRequestHeader("Authorization", Authorization);
                                },
                                success:function(data){
                                    //取到所有古玩城并将其导入到select中
                                    console.log(data,"古玩城");
                                    var curioArray = [];
                                    $.each(data.data,function(index,value){
                                        $("#curio").append("<option value=" + value.id + ">" + value.curiocityName + "</option>");
                                        curioArray.push(value.curiocityName);
                                    });
                                    $("#curio option[value = "+ _data.id +"]").attr("selected","selected");
                                    if(curioArray.length == 0){
                                        $("#curio").append("<option>该城市暂无古玩城</option>");
                                    }
                                }
                            });
                            $("#city option[value="+ _dataCityId +"]").attr("selected","selected");
                            //当市更改的时候调取到相应市的数据
                            $("#city").change(function () {
                                $("#curio").find("option").remove();
                                var cityId = $(this).find("option:selected").val();
                                var curioData = JSON.stringify({
                                    pageSize:-1,
                                    cityId:cityId
                                });
                                requestCurioData(curioData);
                            });
                        }
                    });
                }
            }
        });
    }
    //上传新图片
    $("#upload").click(function(){
        $("#uploadImg").click();
    });
    function ProcessFile( e ) {
        var file = document.getElementById('uploadImg').files[0];
        var img = document.getElementById("bannerImg");
        var fd = new FormData();//创建一个fromdata
        fd.append("file",file); //将参数名与参数值以key value形式组合起来
        if ( file ) {
            var reader = new FileReader();
            reader.onload = function ( event ) {
                var txt = event.target.result;
                //img.src = txt;
            };
        }
        $.ajax({
            type: "post",
            url: "http://116.62.131.70:8081/roo-sys-web/image",
            contentType: false,
            processData: false,
            file:file,
            dataType: "JSON",
            data:fd,
            success:function(data){
                img.src = data.data.url;
                //editPicUrl = data.data.url;
            }
        });
        //reader.readAsDataURL( file );
    }
    function contentLoaded() {
        document.getElementById('uploadImg').addEventListener( 'change' ,
            ProcessFile , false );
    }
    contentLoaded();
    //选择分类
    $("#classify").change(function(){
        if( $("#classify").find("option:selected").val() == 2){
            $(".urlDiv").hide();
            $(".addressDiv").show();
        }
        if($("#classify").find("option:selected").val() == 1){
            $(".addressDiv").hide();
            $(".urlDiv").show();
        }
    });
    //编辑提交
    $("#submit").click(function(){
        editPicUrl = $("#bannerImg").attr("src");
        editType = $("#classify").find("option:selected").val();
        editTypeValue = $("#urlAddress").val() || $("#curio").find("option:selected").val();
        var Authorization= $.cookie("Authorization");
        var idData = JSON.stringify({
            id:id,
            type:editType,
            advTitle: $("#title").val(),
            picUrl:editPicUrl,
            sortNo:sortNo,
            typeValue:editTypeValue
        });
        $.ajax({
            type:"put",
            url:"http://116.62.131.70:8081/roo-sys-web/adv",
            contentType: "application/json;charset=utf-8",
            data:idData,
            dataType: "JSON",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", Authorization);
            },
            success:function(data){
                console.log(data,"编辑广告");
                if(data.httpCode == 200){
                    alert("修改成功");
                    $("#container").show();
                    $("#addContainer").hide();
                    window.location.reload();
                }
            }
        });
    });
}
/******************************************公共函数**********************************************/


