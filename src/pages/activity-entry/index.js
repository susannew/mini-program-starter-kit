import React from 'react'
import { createPage } from '../../react-weapp/create-instance'
import { observer } from 'mobx-react'
import { autoLoading } from '@utils'
import { ActivityStore } from '@store'

@createPage
@observer
export default class ActivityEntry extends React.Component {
  props: {
    params: {
      permalink: string
    }
  }

  activityStore: ActivityStore = ActivityStore.findOrCreate(this.props.params.permalink)

  @autoLoading
  async componentWillMount() {
    await this.activityStore.fetchData()
  }

  render() {
    const { event_type, permalink } = this.activityStore

    return (
      <view className="activity-entry">
        <image src="/images/activity-entry-title.png" className="activity-title" mode="widthFix"/>
        {
          ['both', 'detail'].includes(event_type) && (
            <navigator
              url={`/pages/categories-page/index?permalink=${permalink}`}
              className="link-btn primary-btn"
            >
              长知识
            </navigator>
          )
        }
        {
          ['both', 'qa'].includes(event_type) && (
            <navigator
              url={`/pages/challenge-page/index?permalink=${permalink}`}
              className="link-btn primary-btn"
            >
              去挑战
            </navigator>
          )
        }
        <image src="/images/share.png" className="share-icon" mode="widthFix"/>
        <view className="activity-rule-text">活动规则</view>
      </view>
    )
  }
}
