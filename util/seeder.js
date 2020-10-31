const db = require('../models');
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./util/celebs.json'));

// data.forEach(({ name, birthDay, images }) => {
//   db.user.create({
//     name: name,
//     birthday: birthDay,
//   });
// });

// db.User.create({
//   name: 'Jay',
//   birthday: 1604129957,
// });

// FOR TESTING AND LEARING LOADING AND SAVING WITH INCLUDE
async function seed() {
  // const user = await db.User.findOne({
  //   where: { name: 'Jay' },
  //   include: [db.Photo],
  // });
  // console.log('user', JSON.stringify(user));

  await db.sequelize.sync({ force: true });
  data.forEach(async ({ name, birthDay, images }) => {
    await db.User.create(
      {
        name: name,
        birthday: birthDay,
        Photos: images.map((image) => ({
          imageUrl: image,
        })),
      },
      {
        include: [db.Photo],
      }
    );
  });
}

seed();
