import React from 'react'
import { createPage } from '../../react-weapp/create-instance'
import { autoLoading, fetch } from '@utils'

@createPage
export default class ActivitiesPage extends React.Component {
  state = {
    activities: [],
    list: [1, 2, 3, 4, 5],
    display: false,
  }

  @autoLoading
  async componentWillMount() {
    const { data } = await fetch('events/mini_programs')
    this.setState({ activities: data.data })
    global.tt = () => {
      // this.setState({ list: [1, 3, 2, 4, 5] })
      this.setState({ display: !this.state.display })
    }
  }

  render() {
    return (
      <view className="activities-page">
        <image src="/images/home-title.png" className="home-title"/>
        <view className="activity-list">
          {
            this.state.activities.map((item, index) => (
              <navigator
                key={item.id} className="activity-item"
                url={`/pages/activity-entry/index?permalink=${item.permalink}`}
              >
                {item.name.slice(0, 13)}
                {
                  index === 0 && <image src="/images/home-icon.png" className="latest-mark" mode="widthFix"/>
                }
              </navigator>
            ))
          }
          {
            this.state.list.map(item => (
              this.state.display ? <view key={item}>{item}{123}</view> : <view key={item}>{item}</view>
            ))
          }
        </view>
        <view className="footer">
          <view>"猫头鹰游乐园"发布的活动最终解释权</view>
          <view>归途趣网信息技术（北京）有限公司及其关联实体所有</view>
        </view>
      </view>
    )
  }
}
