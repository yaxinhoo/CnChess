import { _decorator, Component, Node,Color, randomRangeInt, resources, TextAsset, Prefab, ParticleUtils, director, sys, misc, js, math } from 'cc';
import { JSB } from 'cc/env';
//import {systemi} from 'system-info';

const { ccclass, property } = _decorator;

@ccclass('Utils')
export class Utils extends Component {
    
    public static subjects:string[]=new Array<string>();
    public static curridx:number=0;    
    public static initeds:boolean[]=[false,false,false,false,false,false,false,false];
    public static prefabs:Map<string,(string|Prefab)[]>=new Map();
    public static intervals:number[]=[];
    public static intercounts:Map<number,(number|Function)[]>=new Map();
    public static uguid:string="id_abc123";

    public static blackchs:string[]=[
        "black_ju","black_ma","black_pao","black_xiang","black_shi","black_jiang","black_bing"
    ];
    public static redchs:string[]=[
        "red_ju","red_ma","red_pao","red_xiang","red_shi","red_shuai","red_bing"
    ];
    public static xChessPos:number[]=[];    

    start() {

    }

    update(deltaTime: number) {
        
    }

    public static parseHex(str:string,i:number)
    {
        // escape()	使用转义序列替换某些字符来对字符串进行编码
        // unescape()	对使用 escape() 编码的字符串进行解码
        // encodeURI()	通过转义某些字符对 URI 进行编码
        // decodeURI()	对使用 encodeURI() 方法编码的字符串进行解码
        // encodeURIComponent()	通过某些转义字符对 URI 的组件进行编码
        // deencodeURIComponent()	对使用 encodeURIComponent() 方法编码的字符串进行解码

        // ES6新增了几个专门处理4字节码点的函数。
        // String.fromCodePoint()：从Unicode码点返回对应字符
        // String.prototype.codePointAt()：从字符返回对应的码点
        // String.prototype.at()：返回字符串给定位置的字符
        
        let ret:number=0;
        if(i<str.length)
        {
            let ch=str[i];
            if(ch=='A'||ch=='a')
            {
                ret=10;
            }
            else if(ch=='B'||ch=='b')
            {
                ret=11;
            }
            else if(ch=='C'||ch=='c')
            {
                ret=12;
            }
            else if(ch=='D'||ch=='d')
            {
                ret=13;
            }
            else if(ch=='E'||ch=='e')
            {
                ret=14;
            }
            else if(ch=='F'||ch=='f')
            {
                ret=15;
            }
            else
            {                
                ret=Number.parseInt(ch);                
            }
        }else
        {
            ret=0;   
        }    
        return ret;    
    }
    public static hex2Num(str:string)
    {
        let ret:number=0,hex:number=1;
        for(let i=0;i<str.length-1;i++)
        {            
            let val=this.parseHex(str,str.length-1-i);            
            ret+=val*hex;
            //console.log(val+":"+hex+":"+ret);
            hex*=16;
        }
        return ret;
    }

    static isInited()
    {
        const self=this;
        let isInited=true;
        for(let i=0;i<Utils.initeds.length;i++)
        {
            if(!Utils.initeds[i])
            {
                isInited=false;                
                break;
            }
        }
        return isInited;
    }

    static findPrefab(path:string)
    {
        for(let [key,value] of Utils.prefabs)
        {
            if(value[0]==path)
            {
                return value[1];
            }
        }
        return undefined;        
    }

    static findPrefabn(name:string)
    {
        for(let entry of Utils.prefabs)
        {
            if(entry[0]==name)
            {
                return entry[1][1];
            }
        }
        return undefined as any;
    }

    static loadPrefabs(path:string,cb:Function)
    {
        let cachep=Utils.findPrefab(path);
        if(cachep)
        {
            cb(cachep);
        }
        else
        {
            resources.load(path,Prefab,(err:any,prefab:Prefab)=>{                
                if(err)
                {
                    console.warn(err);
                }                            
                let pair=[path,prefab];
                Utils.prefabs.set(prefab.data._name,pair);
                cb(prefab);
            });
        }
    }

    static numInterval(cb:Function,ms:number,times:number=-1)
    {        
        let intval=setInterval((times,cb)=>{                           
            if(times==-1)
            {                
                if(cb)cb(times);
            }
            else
            {
                times--;
                if(times<1)
                {
                    clearInterval(intval);
                    Utils.intercounts.delete(intval);
                }else
                {
                    Utils.intercounts.set(intval,[ms,times,cb]);
                }
                //console.log(Date.now()+":callback:"+intval+":"+ms+"times:"+times);
                if(cb)cb(times);
            }
        },ms,times,cb);
        //console.log(Date.now()+":start:"+intval);
        Utils.intercounts.set(intval,[ms,times,cb]);
        return intval;
    }

    static isInterval(interval:number)
    {
        return Utils.intercounts.has(interval);
    }

    static delInterval(interval:number)
    {
        clearInterval(interval);
        Utils.intercounts.delete(interval);
        return -1;
    }

    static clearInterval()
    {
        for(let entry of Utils.intercounts)
        {
            clearInterval(entry[0]);
        }
        Utils.intercounts.clear();
    }

    static oneInterval(cb:Function,ms:number)
    {        
        let intval=this.numInterval(cb,ms,1);
        // let intval=setInterval(()=>{
        //     clearInterval(intval);
        //     if(cb) cb();
        // });
        return intval;
    }
    static randomColor()
    {
        let r=math.randomRangeInt(0,256);
        let g=math.randomRangeInt(0,256);
        let b=math.randomRangeInt(0,256);
        //let a=math.randomRangeInt(0,256);
        return new Color(r,g,b);
    }
    static randomRed()
    {
        let color:Color=new Color(math.randomRangeInt(0,256),0,0);
        let reds:Color[]=[Color.RED,Color.MAGENTA,color];
        return reds[math.randomRangeInt(0,reds.length)];
    }
    static randomGreen()
    {
        let color:Color=new Color(0,math.randomRangeInt(0,256),0);
        let reds:Color[]=[Color.GREEN,color];
        return reds[math.randomRangeInt(0,reds.length)];
    }
    static randomBlue()
    {
        let color:Color=new Color(0,0,math.randomRangeInt(0,256));
        let reds:Color[]=[Color.BLUE,color];
        return reds[math.randomRangeInt(0,reds.length)];
    }
    static antiColor(col:Color)
    {
        //TODO:互补色，临近色，暖色，冷色，对比，冲击
        let color=new Color(col);
        let hsv=color.toHSV();        
        hsv.h=((hsv.h*360+180)%360)/360;
        color.fromHSV(hsv.h,hsv.s,hsv.v);
        return color;
    }
    static sameColor(col:Color,val?:number)
    {
        let va=60;
        if(val) va=val;
        let color=new Color(col);
        let hsv=color.toHSV();        
        hsv.h=((hsv.h*360+va)%360)/360;
        color.fromHSV(hsv.h,hsv.s,hsv.v);
        return color;
    }
    static htmValRegex(str:string)
    {
        let regex=/\<[^>]*\>(([^<])*)/g;
        let cmd=str.replace(regex, function() {
            return arguments[1];
        });
        return cmd;   
    }
    static readSubjects(cb:Function)
    {
        //it is very slow on the internet enviroment, why
        resources.load("level/sudoku17",TextAsset,(err:any,text:TextAsset)=>{
            if(err)
            {
                console.warn(err);
            }
            Utils.subjects=text.text.split('\n');
            Utils.initeds[6]=true;
            if(cb)cb(Utils.subjects);
        });
    }

    static urlParse()
    {
        //var vars = query.split("?&");
        var name="launch";
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        if(window.location.search.length>0)
        {
            var r = window.location.search.substr(1).match(reg);
            console.log(r[2]);
            let url=new URL(window.location.href);
            url.searchParams.forEach((val:string,key:string,par:URLSearchParams)=>{
                console.log(val+":"+par.toString());
            },"abc");
        }     
        Utils.deviceParse();   
    }    

    public static baseDict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    public static _keyStr:string = "BCDEFHIJKLMNOQRSTUVWXYZbcdefhijklmnoqrstuvwxyz0123456789";
    public static B64Encode(input:string) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Utils.UTF8Encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                Utils._keyStr.charAt(enc1) + Utils._keyStr.charAt(enc2) +
                Utils._keyStr.charAt(enc3) + Utils._keyStr.charAt(enc4);
        }
        return output;
    }
    public static B64Decode(input:string) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = Utils._keyStr.indexOf(input.charAt(i++));
            enc2 = Utils._keyStr.indexOf(input.charAt(i++));
            enc3 = Utils._keyStr.indexOf(input.charAt(i++));
            enc4 = Utils._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Utils.UTF8Decode(output);
        return output;
    }
    public static UTF8Encode(string:string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }
    public static UTF8Decode(utftext:string) {
        var string = "";
        var i = 0;
        let c=0,c1=0,c2 = 0,c3=0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }

    static httpGet(url:string)
    {
        let xhr=new XMLHttpRequest();        
        xhr.open('GET',url);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.responseType='text';
        xhr.timeout=5000;
        xhr.onreadystatechange=function(aa){
            if(xhr.readyState==4&&xhr.status==200||xhr.status==304)
            {
                console.log("xhr:"+xhr.responseText);
            }
        };
        xhr.onload = function(e){
            if(this.status==200)
            {
                console.log("xhr:"+this.response);
                console.log("xhr:"+this.responseText);
            }
        };
        xhr.send();
    }

    static httpPost(url:string,paramstr:string)
    {
        let xhr=new XMLHttpRequest();        
        xhr.open('POST',url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencode');
        xhr.responseType='text';
        xhr.timeout=5000;
        xhr.onreadystatechange=function(aa){
            if(xhr.readyState==4&&xhr.status==200||xhr.status==304)
            {
                console.log("xhr:"+xhr.responseText);
            }
        };
        xhr.onload = function(e){
            if(this.status==200)
            {
                console.log("xhr:"+this.response);
                console.log("xhr:"+this.responseText);
            }
        };
        xhr.send(paramstr);
    }

    static httpPostForm(url:string,params:string)
    {
        var form=document.createElement("form");
        form.action=url;
        form.target="_self";
        form.method="post";
        form.style.display="none";        
        var opt=document.createElement("textarea");
        var ps=params.split("&");
        for(var i=0;i<ps.length;i++)
        {
            let p=ps[i].split("=");
            opt.name=p[0];
            opt.value=p[1];
            form.append(opt);
        }
        document.body.append(form);
        form.submit();
    }

    static deviceParse()
    {
        // var obj = new ActiveXObject("WbemScripting.SWbemLocator");
        // var s = obj.ConnectServer(".");
        // var properties = s.ExecQuery("Select * from Win32_NetworkAdapterConfiguration");
        // var e = new Enumerator (properties);        
        // while(!e.atEnd())
        // {
        //     e.moveNext();
        //     var p = e.item ();
        //     if(!p) continue;
        //     if (p.IPEnabled) 
        //         return  p.MACAddress;
        // }
        // return "";
        var model="";
        var device_type=navigator.userAgent;
        var s=sys;
        var j=js;
        var m=misc;        
        //var jb=jsb;
        
        //jb.reflection.callStaticMethod();

        //console.log(s.os+":"+jb.device.getBatteryLevel()+":");
        console.log("os:"+s.os);
        console.log("platform:"+s.platform);
        //TODO:getthe device id-mac-ip-e.imsi-imei、imsi、uuid
        //imei: (String 类型 )设备的国际移动设备身份码
        //https://blog.csdn.net/weixin_32596893/article/details/117870481?utm_term=html5%E8%8E%B7%E5%BE%97mac%E5%9C%B0%E5%9D%80&utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~all~sobaiduweb~default-3-117870481-null-null&spm=3001.4430

        // var md=new MobileDetect(device_type);        
        // var os=md.os();
        // if(os=="iOS"){
        //     os=md.os()+md.version("iPhone");
        //     model=md.mobile();
        // }else
        // if(os=="ANdroidOS"){
        //     os=md.os()+md.version("Android");
        //     var sss=device_type.split(";");
        //     var i = sss.contains("Build/");
        //     if (i > -1) {
        //         model = sss[i].substring(0, sss[i].indexOf("Build/"));
        //     }
        // }
    }
}

