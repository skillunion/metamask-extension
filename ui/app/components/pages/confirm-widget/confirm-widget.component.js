import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ethUtil from 'ethereumjs-util'
import ConfirmTransactionBase from '../confirm-transaction-base'
import { ConfirmDetailRow } from '../../confirm-page-container'
import UserPreferencedCurrencyDisplay from '../../user-preferenced-currency-display'
import { PRIMARY, SECONDARY } from '../../../constants/common'

export default class ConfirmDeployContract extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    txData: PropTypes.object,
  }

  renderSummaryComponent() {
    const { style, html } = this.props;

    //TODO: may be it's well to use something like DOMPurify for XSS protection
    return (
      <div style={{ padding: '16px' }}>
        <style type="text/css" dangerouslySetInnerHTML={{ __html: style }} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    )
  }

  render() {
    return (
      <ConfirmTransactionBase
        summaryComponent={this.renderSummaryComponent()}
        detailsComponent={this.renderDetails()}
      />
    )
  }

  renderDetails() {
    const {
      hexTransactionFee,
      hexTransactionTotal,
    } = this.props

    return (
      <div style={{ display: 'flex', padding: '16px' }}>
        <div style={{ display: 'flex', flex: 1, marginRight: '16px' }}>
          <div style={{ flex: 1 }} className="confirm-detail-row__label">
            Gas
          </div>
          <div style={{ flex: 1 }}>
            <UserPreferencedCurrencyDisplay
              className="confirm-widget-detail-row__primary"
              type={PRIMARY}
              value={hexTransactionFee}
              showEthLogo
              ethLogoHeight="14"
              hideLabel
            />
            <UserPreferencedCurrencyDisplay
              className="confirm-widget-detail-row__secondary"
              type={SECONDARY}
              value={hexTransactionFee}
              showEthLogo
              hideLabel
            />
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ flex: 1 }} className="confirm-detail-row__label">
            Total
          </div>
          <div style={{ flex: 1 }}>
            <UserPreferencedCurrencyDisplay
              className="confirm-widget-detail-row__primary"
              type={PRIMARY}
              value={hexTransactionTotal}
              style={{ color: "#2f9ae0" }}
              showEthLogo
              ethLogoHeight="14"
              hideLabel
            />
            <UserPreferencedCurrencyDisplay
              className="confirm-widget-detail-row__secondary"
              type={SECONDARY}
              value={hexTransactionTotal}
              showEthLogo
              hideLabel
            />
          </div>
        </div>
      </div>
    )
  }
}
