const db = require('../models');
const fs = require('fs');

const axios = require('axios');
const cheerio = require('cheerio');
const results = [];

async function getImages(link) {
  const response = await axios.get(link);
  const $ = cheerio.load(response.data);
  const imageLinks = [];
  $('.post_content img')
    .slice(0, 4)
    .each(function (i, elem) {
      const srcSet = $(this).attr('srcset');
      imageLinks.push(parseSrcset(srcSet));
    });
  return imageLinks;
}

function parseSrcset(srcset) {
  const srcs = srcset.split(',');
  const lastSrc = srcs[srcs.length - 1].trim();
  const link = lastSrc.split(' ')[0];
  return link;
}

async function scrape() {
  for (let i = 1; i <= 1; i++) {
    const sourceLink = `https://people.mthai.com/starthai/page/${i}`;
    const response = await axios.get(sourceLink);
    const $ = cheerio.load(response.data);
    const celebs = $('.circlehover');
    for (let j = 0; j < celebs.length; j++) {
      const elem = celebs.eq(j);
      let images = [];
      const coverImage = $(elem)
        .find('.link-photo-border > a > img')
        .attr('src');
      images.push(coverImage);

      const detailLink = $(elem).find('.link-photo-border > a').attr('href');
      const detailImages = await getImages(detailLink);
      images = images.concat(detailImages);

      const name = $(elem).find('.box_detail > p').children().text();
      const dateText = $(elem).find('.box_detail > p').eq(1).text();
      const birthDay = toEpoch(dateText);
      if (name && birthDay && isOlderThan(birthDay, 20)) {
        results.push({
          name,
          detailLink,
          birthDay,
          images,
        });
      }
    }
  }
  //console.log(results);
  fs.writeFileSync('./util/celebs.json', JSON.stringify(results));
}

function isOlderThan(birthDay, year) {
  return Date.now() / 1000 - birthDay > year * 365 * 24 * 60 * 60;
}

scrape();

//console.log(toEpoch('วันเกิด : 31 ตุลาคม 2535'));

function toEpoch(thaiDate) {
  const thaiMonths = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤษจิกายน',
    'ธันวาคม',
  ];
  let day, monthName, thaiYear;
  const arr = thaiDate.split(':')[1].trim().split(' ');
  if (arr.length === 3) {
    day = arr[0];
    monthName = arr[1];
    thaiYear = arr[2];
  } else if (arr.length === 4) {
    day = arr[0];
    monthName = arr[1];
    thaiYear = arr[3];
  }
  const year = thaiYear - 543;
  const month = thaiMonths.indexOf(monthName);
  const birthDay = new Date(year, month, day).getTime() / 1000;
  return birthDay;
}
