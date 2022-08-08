<?php
//empty():检查一个变量是否为空 / $_FILES数组：接受上传的文件
if(!empty($_FILES)){
    //提交的文件是否为空
    //把文件上传到assets/Image目录
    $up_root='../assets/Image/';

    //该目录是否存在 || 不存在创建该目录
    is_dir($up_root)||mkdir($up_root);

    //遍历上传的文件
    foreach($_FILES as $item){
        //error=0表示文件正常上传
        if($item['error']===0){
            //读取文件信息
            $content = file_get_contents($item['tmp_name'],'r');

            //获取当前时间戳来构成上传文件的新名称
            $fid = time();

            //文件名和后缀以'.'分开，得到一个￥suffix数组
            $suffix = explode('.',$item['name']);

            //删除数组最后一位并返回，获得后缀名
            $suffix = array_pop($suffix)
            $suffix && ($suffix='.'.$suffix)

            //move_uploaded_file将上传的文件移动到新位置
            move_uploaded_file($item['tmp_name'],$up_root.$fid.$suffix)

            //图片的连接形式
            $link = 'http://localhost:8080/assets/Image/'.$fid.$suffix

            //构造编辑器的返回值
            $data1 = array(
                "url"=>$link,
                "alt"=>"",
                "href"=>""
            );
            $data=array(
                "errno"=>0,
                "data"=>[$data1]
            );
            $json=json_encode($data)
            exit($json)
        }else{
            $data1=array(
                "url"=>"",
                "alt"=>"",
                "href"=>""
            )
            $data=array(
                "errno"=>1,
                "data"=>[$data1]
            )
            $json=json_encode($data)
            exit($json)
        }
    }
}