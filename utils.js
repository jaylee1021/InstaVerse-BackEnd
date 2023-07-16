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
        username: faker.internet.userName()
    };
}

function createRandomPost() {
    return {
        username: 'jamesissad',
        caption: faker.lorem.sentence(),
        photo: faker.image.url()
    };
}

module.exports = {
    createRandomUser,
    createRandomPost
};