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
        username: 'randomdori',
        caption: faker.lorem.sentence(),
        // photo: faker.image.url()
        photo: 'https://res.cloudinary.com/instaversecloud/image/upload/v1689454484/InstaVerse/agezbvn5otc5eehcxxj5.jpg'
    };
}

function createRandomFollower() {
    return {
        username: faker.internet.userName(),
    };
}

function createRandomFollowing() {
    return {
        username: faker.internet.userName(),
    };
}

module.exports = {
    createRandomUser,
    createRandomPost,
    createRandomFollower,
    createRandomFollowing
};