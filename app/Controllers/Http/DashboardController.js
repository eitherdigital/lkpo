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
    
    async logout ({ auth, response }) {
        await auth.logout()
        return response.route('/')
    }
}

module.exports = DashboardController
