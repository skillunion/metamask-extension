import React, { Component } from 'react'
import ConfirmTransactionBase from '../confirm-transaction-base'

export default class ConfirmWidget extends Component {

  renderContent() {
    const { style, html } = this.props;

    //TODO: may be it's well to use something like DOMPurify for XSS protection
    return (
      <div>
        <style type="text/css" dangerouslySetInnerHTML={{ __html: style }} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    )
  }

  render() {
    return (
      <ConfirmTransactionBase
        contentComponent={this.renderContent()}
      />
    )
  }
}
