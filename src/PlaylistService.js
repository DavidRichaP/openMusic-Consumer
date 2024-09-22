const { Pool } = require('pg')

class PlaylistService {
  constructor() {
    this._pool = new Pool()
  }

  async getPlaylistById(playlistId, getUserPlaylists) {
    const query = {
      text: `SELECT playlists.id, playlists.name FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.id = $1 AND playlists.owner = $2 OR collaborations.playlist_id = $1
      GROUP BY playlists.id, users.id`,
      values: [playlistId, getUserPlaylists]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Playlist By Id Not Found')
    }

    return result.rows[0]
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
      LEFT JOIN songs ON songs.id = playlist_songs.song_id
      where playlist_songs.playlist_id =$1 GROUP BY playlist_songs.id, songs.id`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Songs Not Found')
    }
    return result.rows
  }
}

module.exports = PlaylistService
