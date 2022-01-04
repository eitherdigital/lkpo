'use strict'

const User = use('App/Models/User')
const Release = use('App/Models/Release')
const Database = use('Database')

class AdminController {
  async getReleases({ view, auth }) {
    const data = await Database.table('releases')
      .orderBy('created_at', 'desc');
    return view.render('admin/releases', { data: data });
  }
  async acceptRelease({ params, response, auth, request }) {
    if (auth.user.status !== "admin") {
      return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    if (!params.id) {
        return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    if (!request.input('upc')) {
        return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    const release = await Release.find(params.id)

    if(!release) return response.redirect('/')

    release.accepted = 1
    release.upc = request.input('upc')
    release.isrc = request.input('isrc')

    await release.save();
    return response.redirect('/admin/releases')
  }
  async deleteRelease({ params, response, auth }) {
    if (auth.user.status !== "admin") {
      return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    if (!params.id) {
        return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    const release = await Release.find(params.id)

    if(!release) return response.redirect('/')

    await release.delete();
    return response.redirect('/admin/releases')
  }
  async declineRelease({ params, response, request, auth }) {
    if (auth.user.status !== "admin") {
      return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    if (!params.id) {
        return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    if (!request.input('reason')) {
        return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    const release = await Release.find(params.id)

    if(!release) return response.redirect('/')

    release.accepted = 2
    release.reason = request.input('reason')
    await release.save();

    return response.redirect('/admin/releases')
  }
  async getUsers({ view, auth }) {
    const data = await Database.table('users')
      .orderBy('created_at', 'desc');
    return view.render('admin/users', { data: data });
  }
  async deleteUser({ params, response, auth }) {
    if (auth.user.status !== "admin") {
      return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    if (!params.id) {
        return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    const user = await User.find(params.id)

    if(!user) return response.redirect('/')

    await user.delete();
    return response.redirect('/admin/users')
  }
  async createUser({ response, auth, request }) {
    if (auth.user.status !== "admin") {
      return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    const user = new User();

    user.username = request.input('username')
    user.email = request.input('email')
    user.password = request.input('password')
    user.status = request.input('status')
    user.balance = "0"

    await user.save();
    return response.redirect('/admin/users')
  }
  async editUser({ params, response, auth, request }) {
    if (auth.user.status !== "admin") {
      return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    if (!params.id) {
        return response.badRequest('Произошла ошибка, попробуйте позже.');
    }
    const user = await User.find(params.id)

    if(!user) return response.redirect('/')

    if(request.input('username')) {
      user.username = request.input('username')
    }
    if(request.input('email')) {
      user.email = request.input('email')
    }
    if(request.input('password')) {
      user.password = request.input('password')
    }
    if(request.input('balance')) {
      user.balance = request.input('balance')
    }
    user.status = request.input('status')

    await user.save();
    return response.redirect('/admin/users')
  }
}

module.exports = AdminController
