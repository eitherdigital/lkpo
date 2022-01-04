'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('index')
Route.on('/reg').render('reg')
Route.post('/api/login','AuthController.postLogin').as('login')
Route.post('/api/register','AuthController.postRegister').as('reg')
Route.group(() => {
    Route.on('/dashboard').render('dashboard/index')
    Route.get('/dashboard/releases', 'DashboardController.getReleases')
    Route.on('/dashboard/releases/new').render('dashboard/new')
    Route.on('/dashboard/financial').render('dashboard/financial')
    Route.post('/api/newRelease','DashboardController.newRelease').as('newRelease')
    Route.post('/api/logout','AuthController.logout').as('logout')

    Route.on('/admin').render('admin/index')
    Route.get('/admin/releases', 'AdminController.getReleases')
    Route.get('/admin/users', 'AdminController.getUsers')
    Route.on('/admin/users/new').render('admin/newuser')
    Route.post('/api/user/new','AdminController.createUser').as('createUser')
    Route.post('/api/user/edit/:id','AdminController.editUser').as('editUser')
    Route.post('/api/release/accept/:id','AdminController.acceptRelease').as('acceptRelease')
    Route.post('/api/release/delete/:id','AdminController.deleteRelease').as('deleteRelease')
    Route.post('/api/release/decline/:id','AdminController.declineRelease').as('declineRelease')
    Route.get('/api/user/delete/:id','AdminController.deleteUser').as('deleteUser')
}).middleware(['auth'])
