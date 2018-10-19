const React = {
  createElement(type, props, ...args) {
    return {
      type,
      props,
      children: args
    }
  }
}

const nodes = [
  <view className="abc">
    text
    <view className="abc">
      text
      {
        [1, 2, 3].map(i => <text>{i}</text>)
      }
      <view className="abc">
        text
        <view className="abc">
          text
          <view className="abc">
            text
            <view className="abc">
              text
              <view className="abc">
                text
                <view className="abc">
                  text
                  <view className="abc">
                    text
                    <view className="abc">
                      text
                      <view className="abc">
                        text
                        <view className="abc">
                          text
                          <view className="abc">
                            text
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
]

Page({
  data: {
    topics: [],
    arr: nodes,
    // nodes
  },

  async onLoad() {
    // const res = await fetch('topics', { data: { limit: 5 } })
    // this.setData({ topics: res.data.data })
  }
})
