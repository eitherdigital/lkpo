'use strict'

const User = use('App/Models/User')
const Release = use('App/Models/Release')
const Database = use('Database')
const Helpers = use('Helpers')

class DashboardController {
  async getReleases({ view, auth }) {
        const data = await Database.table('releases')
          .where('user_id', '=', auth.user.id)
          .orderBy('created_at', 'desc');
        return view.render('dashboard/releases', { data: data });
    }
    async newRelease({ auth,request, response, session }) {
      const release = new Release();

      const validationOptions = {
        types: ['jpeg'],
        size: '10mb',
      }
      const imageFile = request.file('cover', validationOptions)
      await imageFile.move(Helpers.publicPath('/covers/'+auth.user.id), {
        name: auth.user.username+'_'+auth.user.id+'_'+request.input('title')+'_'+request.input('date')+'.jpg',
        overwrite: true,
      })
      if (!imageFile.moved()) {
        return imageFile.error()
      }

      const validationOptions2 = {
        types: ['x-zip-compressed'],
        size: '100mb',
      }
      const zipFile = request.file('tracks', validationOptions2)
      await zipFile.move(Helpers.publicPath('/tracks/'+auth.user.id), {
        name: auth.user.username+'_'+auth.user.id+'_'+request.input('title')+'_'+request.input('date')+'.zip',
        overwrite: true,
      })
      if (!zipFile.moved()) {
        return zipFile.error()
      }

      release.name = request.input('title')
      release.main_artist = request.input('main_artist')
      release.another_artists = request.input('another_artists')
      release.genre = request.input('genre')
      release.version = request.input('version')
      release.explicit = request.input('explicit')
      release.author = request.input('author')
      release.date = request.input('date')
      release.link = '/tracks/'+auth.user.id+'/'+auth.user.username+'_'+auth.user.id+'_'+request.input('title')+'_'+request.input('date')+'.zip'
      release.cover = '/covers/'+auth.user.id+'/'+auth.user.username+'_'+auth.user.id+'_'+request.input('title')+'_'+request.input('date')+'.jpg'
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
