import superagent from "superagent";

class StatsGetter {
  accessToken;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  getUsersTopArtists = async (url: string): Promise<string[] | undefined> => {
    try {
      const usersTopArtists = await superagent.get(url)
        .query({ time_range: "short_term", limit: "5" })
        .set("Authorization", `Bearer ${this.accessToken}`)
        .then((res: superagent.Response) => res.body.items.map((artist: any) => artist.name))

      return usersTopArtists
    } catch (err) {
      console.log(err);
    }
  }

  getUsersTopTracks = async (url: string): Promise<string[] | undefined> => {
    try {
      const usersTopTracks: string[] = await superagent.get(url)
        .query({ time_range: "short_term", limit: "5" })
        .set("Authorization", `Bearer ${this.accessToken}`)
        .then((res: superagent.Response) => res.body.items.map((track: any) => track.name));

      return usersTopTracks;
    } catch (err) {
      console.log(err);
    }
  }

  getUsersRecentlyPlayed = async (url: string): Promise<string[] | undefined> => {
    try {
      const usersRecentlyPlayed: string[] = await superagent.get(url)
        .query({ limit: "5" })
        .set("Authorization", `Bearer ${this.accessToken}`)
        .then((res: superagent.Response) => res.body.items.map((item: any) => item.track.name))

      return usersRecentlyPlayed
    } catch (err: unknown) {
      console.log(err)
    }
  }

  getUsersRecentlyPlayedMinutes = async (url: string): Promise<number | undefined> => {
    try {
      let usersRecentlyPlayedMs = 0;
      let usersPastListeningDays: Date;
      await superagent.get(url)
        .query({ limit: "50" })
        .set("Authorization", `Bearer ${this.accessToken}`)
        .then((res: superagent.Response) => {
          const today = new Date(Date.now()).getDay()
          const usersLastListenedDay = new Date(res.body.items[49].played_at).getDay()
          console.log(today)
          res.body.items.forEach((item: any) => {
            usersRecentlyPlayedMs += item.track.duration_ms
          })
        }
        )
      return Math.round(usersRecentlyPlayedMs / 60000)
    } catch (err: unknown) {
      console.log(err)
    }
  }

}

export default StatsGetter