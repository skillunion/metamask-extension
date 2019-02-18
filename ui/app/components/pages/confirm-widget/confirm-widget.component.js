import React, { Component } from 'react'
import ConfirmTransactionBase from '../confirm-transaction-base'

export default class ConfirmWidget extends Component {

  constructor() {
    super();
    this.state = {
      html: '',
      style: ''
    };
  }

  componentDidMount() {
    fetch('https://skillunion.github.io/metamask-extension-static/widgets.json')
      .then(response => response.json())
      .then(json => this.setState({
        html: json.widgets[0].popupHtml,
        style: json.widgets[0].popupStyle
      }))
  }

  renderContent() {
    const { style, html } = this.state;

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
