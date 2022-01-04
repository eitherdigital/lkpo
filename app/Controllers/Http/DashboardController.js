'use strict'

const User = use('App/Models/User')
const Release = use('App/Models/Release')
const Database = use('Database')

class DashboardController {
  async getReleases({ view, auth }) {
        const data = await Database.table('releases')
          .where('user_id', '=', auth.user.id)
          .orderBy('created_at', 'desc');
        return view.render('dashboard/releases', { data: data });
    }
    async newRelease({ auth,request, response, session }) {
      const release = new Release();

      release.name = request.input('title')
      release.main_artist = request.input('main_artist')
      release.another_artists = request.input('another_artists')
      release.genre = request.input('genre')
      release.version = request.input('version')
      release.explicit = request.input('explicit')
      release.author = request.input('author')
      release.date = request.input('date')
      release.link = request.input('link')
      release.label = request.input('label')
      release.accepted = 0
      release.user_id = auth.user.id


      await release.save()

      session.flash({ notification: 'You create new release!' })

      return response.redirect('/dashboard/releases')
    }
    async getInvites({ view, auth }) {
      const data = await Database.table('users')
        .where('invited_by', '=', auth.user.id)
        .orderBy('created_at', 'desc');
      return view.render('dashboard/invites', { data: data });
    }
    async deleteInvite({ params, response, auth }) {
      if (!params.id) {
          return response.badRequest('Произошла ошибка, попробуйте позже.');
      }
      const user = await User.find(params.id)

      if(!user) return response.redirect('/')
      console.log(user.invited_by)
      if (user.invited_by !== String(auth.user.id)) {
        return response.badRequest('Произошла ошибка, попробуйте позже.');
      }

      await user.delete();
      return response.redirect('/dashboard/invites')
    }
    async newInvite({ request, session, response, auth }) {
        const user = await User.create({
            username: request.input('username'),
            email: request.input('email'),
            password: request.input('password'),
            status: "invited",
            balance: "0",
            invited_by: auth.user.id
        })
        session.flash({ successmessage: 'User have been created successfully'})

        return response.route('/dashboard/invites');
    }
    async logout ({ auth, response }) {
        await auth.logout()
        return response.route('/')
    }
}

module.exports = DashboardController
