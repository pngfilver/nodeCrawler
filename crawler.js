/**
 * Created by lanlan on 2016/6/1.
 */
'use strict';
const http = require('http');
const cheerio = require('cheerio');  // 用cheerio解析html很方便，就像在浏览器中使用jquery一样，但是为什么不能用es6语法呢

const url = 'http://www.iqiyi.com/dianying/';

function filterBlogs(html) {
    const $ = cheerio.load(html);
    const categories = $('qchunk');

    categories.each(function(item){
        var category = $(this);
        var categoryTitle = category.find('strong.title').find('span').text();
        console.log('\n'+categoryTitle+'\n');

        var videos = category.find('.site-piclist').children();
        videos.each(function(item) {
            var video = $(this);
            var title = video.find('.site-piclist_info_title').find('a').text();
            console.log(title);
            var score = video.find('.score').text();
            if(score) {
                console.log('评分:'+score + '\n');
            }
        });

    });
}

http.get(url, (res) => {
    let html = '';

    res.on('data', (data) => {
        html += data;
    });
    res.on('end', () => {
        filterBlogs(html);
    });

}).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
});