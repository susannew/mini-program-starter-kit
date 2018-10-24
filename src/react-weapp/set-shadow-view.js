import React from 'react'
import _ from 'lodash'

export default function setShadowView(Target) {
  return class ShadowView extends React.Component {
    element = { props: this.props, type: Target }

    componentWillUpdate(nextProps) {
      if (!_.isEqual(this.props, nextProps)) {
        this.element = { props: nextProps, type: Target }
      }
    }

    render() {
      return <shadow-view element={this.element}/>
    }
  }
}
