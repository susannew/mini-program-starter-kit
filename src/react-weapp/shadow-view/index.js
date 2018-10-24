import React from 'react'
import { createShadow } from '../../react-weapp/create-instance'

@createShadow
export default class ShadowView extends React.Component {
  render() {
    return (
      <view>参数为空</view>
    )
  }
}
