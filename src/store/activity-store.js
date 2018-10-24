import { WebAPIStore, observable, fetchAction } from './helper/index'
import { fetch } from '@utils'

export class ActivityStore extends WebAPIStore {
  permalink = this.instanceKey

  @observable event_type: 'both' | 'detail' | 'qa' = ''

  @observable score_ranks: Array<{
    id: number,
    score: number,
    image: string,
    syntheticImage?: string,
  }> = []

  @fetchAction.merge
  async fetchData() {
    return fetch(`events/${this.permalink}`)
  }
}
