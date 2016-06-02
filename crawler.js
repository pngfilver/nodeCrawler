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

   /* categoriesData: [
        {
            categoryTitle: '',
            movies: [
                {
                    title: '',
                    score: ''
                },
                {
                    title: '',
                    score: ''
                }
            ]
        }
    ]*/

    var categoriesData = [];

    categories.each(function(item){
        var category = $(this);
        var categoryTitle = category.find('strong.title').find('span').text();
        var movies = category.find('.site-piclist').children();
        var categoryData = {
            categoryTitle: categoryTitle,
            movies: []
        };
        movies.each(function(item) {
            var movie = $(this);
            var title = movie.find('.site-piclist_info_title').find('a').text();
            var score = movie.find('.score').text();
            categoryData.movies.push({
                title: title,
                score: score
            });
        });
        categoriesData.push(categoryData);
    });
    return categoriesData;
}

function printData(categoriesData) {
    var categoriesData = categoriesData;
    categoriesData.forEach(function(item) {
        var categoryTitle = item.categoryTitle;
        console.log('\n'+categoryTitle+'\n');
        var movies = item.movies;
        movies.forEach(function(movie) {
            var title = movie.title;
            var score = movie.score;
            console.log(title+'  '+score);
        });
    });
}

http.get(url, (res) => {
    let html = '';

    res.on('data', (data) => {
        html += data;
    });
    res.on('end', () => {
        var categoriesData = filterBlogs(html);
        printData(categoriesData);
    });

}).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
});