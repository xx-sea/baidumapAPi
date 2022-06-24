// 生成基础地图，
var YJRenderMap = function (data) {
    if (!data) return false;
    var mapData = data;
    var map;
    var mountNode;
    var Sstate;

    (function () {
        mountNode = mapData.Node ? mapData.Node : "" //挂载
        let shaftlng;
        let shaftlat;

        if (!mapData.point) {
            shaftlng = 116.404; //处理经度
            shaftlat = 39.915;  //处理维度
        } else {
            shaftlng = mapData.point.lng ? mapData.point.lng : 116.404;  //处理经度
            shaftlat = mapData.point.lat ? mapData.point.lat : 39.915;   //处理维度
        }

        let Sscaling = typeof mapData.scaling == "number" ? mapData.scaling : 13;//缩放比例
        let Mpoint = new BMap.Point(shaftlng, shaftlat); //根据经纬度生成地图坐标
        map = new BMap.Map(mountNode);//创建一个地图实例 id  生成到容器里面
        map.centerAndZoom(Mpoint, Sscaling);//在容器中生成地图

        //是否开启地图缩放，默认开启；
        if (Sstate == null ? !Sstate : Sstate) {
            map.enableScrollWheelZoom() //开启鼠标滚轮缩放；
        }
        let marker = new BMap.Marker(Mpoint);
        map.addOverlay(marker)
        map.addControl(new BMap.ScaleControl());


        // 当有其他数据的时候，初始化部分
        if (!data.itemData) return false
        alert("我有数据！！！！")

    })(mapData)



    // 生成标注图标
    map.markTag = function (data) {
        let points = data.point ? data.point : "";
        let imgSrcS = data.imgSrc ? data.imgSrc : "";
        let point = new BMap.Point(points.lng, points.lat) //生成标注图标的位置信息;

        let marker = new BMap.Marker(point); //创建标注图标
        // marker.setAttribute("id", 1233)
        map.addOverlay(marker)               //将标注添加到地图中

        // 添加自定义图标和大小
        if (imgSrcS) {
            let SRC = imgSrcS.Src;
            let w = imgSrcS.W;
            let h = imgSrcS.H;

            var myIcon = new BMap.Icon(SRC, new BMap.Size(w, h), {
                // 指定定位位置。   
                // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
                // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
                // 图标中央下端的尖角位置。    
                anchor: new BMap.Size(10, 25),
                // 设置图片偏移。   
                // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
                // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
                // imageOffset: new BMap.Size(0, 0 - 3 * 25)   // 设置图片偏移    
            })
            var marker1 = new BMap.Marker(point, { icon: myIcon });
            map.addOverlay(marker1);
            marker1.addEventListener("click", function () {
                console.log(this);
                alert("你点击了标注2")
                console.log(this.JA.lng, this.JA.lat);
            })
        }
        marker.addEventListener("click", function () {
            alert("您点击了标注1");
            console.log(this.JA.lng, this.JA.lat);
        });

    }

    // 自定义标注
    map.customMark = function (data) {
        const Cpoint = data.Cpoint ? data.Cpoint : {};
        const Cnode = data.Cnode ? data.Cnode : "custCndoe";
        const CHTML = data.CHTML ? data.CHTML : "<p>暂无生成内容！</p>"
        const Cwidth = data.Cwidth ? data.Cwidth : 200;
        const Cheight = data.Cheight ? data.Cheight : 300;
        const Cbackground = data.Cbackground ? data.Cbackground : "#fff";
        const Ctop = data.Ctop ? data.Ctop : 0;
        const Cleft = data.Cleft ? data.Cleft : 0;

        // 定义自定义覆盖物的构造函数  
        function SquareOverlay(center, length, color) {
            this._center = center;
            this._length = length;
            this._color = color;
        }
        // 继承API的BMap.Overlay
        SquareOverlay.prototype = new BMap.Overlay();




        // 实现初始化方法  
        SquareOverlay.prototype.initialize = function (map) {
            // 保存map对象实例
            this._map = map;
            // 创建div元素，作为自定义覆盖物的容器
            var div = document.createElement("div");
            div.innerHTML = `${CHTML}`
            div.style.position = "absolute";
            div.id = Cnode ? Cnode : ""; //给里面的容器传入自定义id
            // 可以根据参数设置元素外观
            div.style.width = Cwidth + "px";
            div.style.height = Cheight + "px";
            div.style.background = Cbackground;
            div.style.top = Ctop;
            div.style.left = Cleft;
            // 将div添加到覆盖物容器中
            map.getPanes().markerPane.appendChild(div);
            // 保存div实例
            this._div = div;
            // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
            // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
            return div;
        }
        // 实现绘制方法   
        SquareOverlay.prototype.draw = function () {
            // 根据地理坐标转换为像素坐标，并设置给容器    
            var position = this._map.pointToOverlayPixel(this._center);
            this._div.style.left = position.x - this._length / 2 + "px";
            this._div.style.top = position.y - this._length / 2 + "px";
        }
        // 实现显示方法    
        SquareOverlay.prototype.show = function () {
            if (this._div) {
                this._div.style.display = "";
            }
        }
        // 实现隐藏方法  
        SquareOverlay.prototype.hide = function () {
            if (this._div) {
                this._div.style.display = "none";
            }
        }
        // 添加自定义方法   
        SquareOverlay.prototype.toggle = function () {
            if (this._div) {
                if (this._div.style.display == "") {
                    this.hide();
                }
                else {
                    this.show();
                }
            }
        }

        // 初始化地图  
        // var map = new BMap.Map("container");
        var point = new BMap.Point(Cpoint.lng, Cpoint.lat);
        console.log(Cpoint.lng, Cpoint.lat);
        // 添加自定义覆盖物   
        var mySquare = new SquareOverlay(point, 30, "blue");
        map.addOverlay(mySquare);
    }

    //自定义添加控件
    map.AddControls = function (controlsName, region) {
        let controlsNames = controlsName + "Control"
        console.log(controlsNames);
        if (controlsName == "all") {
            map.addControl(new BMap.NavigationControl());
            map.addControl(new BMap.ScaleControl());
            map.addControl(new BMap.OverviewMapControl());
            map.addControl(new BMap.MapTypeControl());
        }
        switch (controlsNames) {
            case "NavigationControl":
                map.addControl(new BMap.NavigationControl());
                break;

            case "ScaleControl":
                map.addControl(new BMap.ScaleControl());
                break;

            case "OverviewMapControl":
                map.addControl(new BMap.OverviewMapControl());
                break;
            case "MapTypeControl":
                map.addControl(new BMap.MapTypeControl());
                break;
            default:

        }
        map.setCurrentCity(region);
    }

    //信息窗口
    map.IWindow = function () {
        var opts = {
            width: 250,     // 信息窗口宽度    
            height: 100,     // 信息窗口高度    
            title: "Hello"  // 信息窗口标题   
        }
        var infoWindow = new BMap.InfoWindow("World", opts);  // 创建信息窗口对象    
        map.openInfoWindow(infoWindow, map.getCenter());
    }

    // 地址解析器,生成对应的经纬度
    map.AddressParsing = function (data, callback) {
        let provinces = data.provinces;
        let region = data.region;
        var locationInfor = "";

        var callbackPoint = callback;
        console.log(callbackPoint);
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野   


        myGeo.getPoint(region, function (point) {
            locationInfor = point
            if (point) {
                callbackPoint(point);
            }
        }, provinces);

    }
    // 逆向地址解析器
    map.NAddressParsing = function (data, callback) {
        let lng = data.lng;
        let lat = data.lat;

        var myGeo = new BMap.Geocoder({ extensions_town: true });
        // 根据坐标得到地址描述    
        myGeo.getLocation(new BMap.Point(116.364, 39.993), function (result) {
            if (result) {
                callback(result.address);
                // alert(result.address);
            }
        });
    }
    //当前设备的缩放比例
    map.mapZoom = function () {
        map.addEventListener("zoomend", function () {
            console.log(this.getZoom());
        });
    }

    // 鼠标点击地图获取地址信息
    map.AccessMap = function (callback) {
        var geoc = new BMap.Geocoder();
        map.addEventListener("click", function (e) {
            var pt = e.point;
            geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents;
                callback(addComp);
            });
        });
    }



    return map
}
