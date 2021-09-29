const request = require('supertest')
const app = require('../src/app')

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { response } = require('../src/app')
const User = require('../src/models/user')
const {userOneID,
    setupDataBase,
    userOne } = require('../tests/fixtures/db')

beforeEach(setupDataBase)


test('Should SignUp a new user',async ()=>{
    const response = await request(app).post('/users').send({
        name:'Venkata Sai Teja Mukkapati',
        email:'bablu4195@outlook.com',
        password:'IamLegend^%$'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Venkata Sai Teja Mukkapati',
            email: 'bablu4195@outlook.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('IamLegend^%$')
})

test('Should have login existing user',async()=>{
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
    const user = await User.findById(userOneID)
    expect(user.token).toBe(userOneID.token)
})
test('Shouldnot  login existing user',async()=>{
    await request(app).post('/users/login').send({
        email:'bablu4195@google.com',
        password:'ThisisUnbelieveable'
    }).expect(400)
})

test('Should get profile user',async ()=>{
  await request(app)
  .get('/users/me')
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)    
})

test('Shouldnot get a profile for unauth users',async () => {
 await request(app)
   .get('/users/me')
   .send()
   .expect(401)
})

test('your account is deleted',async ()=>{
    await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userOneID)
    expect(user).toBeNull()
})
test('Should not delete account for unauthorized', async ()=>{
   await request(app)
     .delete('/users/me')
     .send()
     .expect(401)
})
test('should upload avatar',async ()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)
    const user = await User.findById(userOneID)
    expect(user.avatar).toEqual(expect.any(Buffer))
})
test('updating a user', async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        email:'bablu4195@Microsoft.com',
        password:'amIinMicrosoft@25'
    })
    .expect(200)

})
test('updating an unauthorized user', async ()=>{
    await request(app)
    .patch('/users/me')
    .send()
    .expect(401)

})