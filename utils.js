const { faker } = require('@faker-js/faker');

function createRandomUser() {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    const emailDomain = faker.internet.email().split('@')[1];
    let email = `${firstName}.${lastName}@${emailDomain}`;
    let fullName = `${firstName} ${lastName}`;
    return {
        fullName: fullName,
        email: email,
        username: faker.internet.userName(),
        password: '1234567890'
    };
}

function createRandomPost() {
    return {
        caption: faker.lorem.sentence(),
        photo: faker.image.url(),
        createdBy: "64ae3cbeda586ae850a7dfd2"
    };
}

function createRandomFollower() {
    return {
        userId: '64b849e7ffe336c369b5bdef',
        follower: ['64b8b0b7d0b4179a346beb6e', '64b8b105d0b4179a346beb74', '64ba0d2c1d8bc12decfb5b68']
    };
}

function createRandomFollowing() {
    return {
        following: '64b849e7ffe336c369b5bdef',
    };
}

module.exports = {
    createRandomUser,
    createRandomPost,
    createRandomFollower,
    createRandomFollowing
};