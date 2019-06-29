<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

use think\Route;
//Route::get('index','index/index/index');
//Banner
Route::get('api/:version/banner/:id', 'api/:version.Banner/getBanner');
Route::get('api/:version/category/', 'api/:version.Category/getAllCategory');
Route::get('api/:version/category/:id', 'api/:version.Category/getCategoryById');

Route::get('api/:version/content/myCollect/:start/:count', 'api/:version.Content/getMyCollect');
Route::get('api/:version/content/myRecent/:start/:count', 'api/:version.Content/getMyRecentFear');
Route::get('api/:version/content/recent/:start/:count', 'api/:version.Content/getRecentFear');
Route::get('api/:version/content/:id', 'api/:version.Content/getContentById');
Route::get('api/:version/myContent/:id', 'api/:version.Content/getMyContentById');

Route::get('api/:version/addCollect/:id', 'api/:version.Content/addCollect');
Route::get('api/:version/noCollect/:id', 'api/:version.Content/noCollect');

Route::get('api/:version/comeToTop/:id', 'api/:version.Content/comeToTop');
Route::get('api/:version/noToTop/:id', 'api/:version.Content/noToTop');

Route::get('api/:version/deleteMyContent/:id', 'api/:version.Content/deleteContentById');

Route::get('api/:version/content/', 'api/:version.Content/test');
Route::post('api/:version/addUserContent/','api/:version.Content/addUserContent' );
Route::post('api/:version/uploadPic/','api/:version.Content/uploadPic' );

Route::post('api/:version/addSome/:choose','api/:version.Content/addSome' );

Route::post('api/:version/usertoken/', 'api/:version.Token/getToken');

Route::get('api/:version/searchFear/:fear', 'api/:version.Content/searchContentByFear');
Route::get('api/:version/searchMyFear/:fear', 'api/:version.Content/searchMyContentByFear');
//Route::get('api/:version/content/:id', 'api/:version.Content/getContentById');

