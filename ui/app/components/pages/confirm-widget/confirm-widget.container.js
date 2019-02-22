import { connect } from 'react-redux'
import ConfirmWidget from './confirm-widget.component'
import { getAdvancedInlineGasShown } from '../../../selectors'
import { isBalanceSufficient, calcGasTotal } from '../../send/send.utils'
import { getMetaMaskAccounts } from '../../../selectors'

const mapStateToProps = state => {
  const { confirmTransaction, gas, metamask } = state
  const { confirmTransaction: { txData } = {} } = state
  const { confirmTransaction: { txData: { origin: { context: { html } } } } = {} } = state
  const { confirmTransaction: { txData: { origin: { context: { style } } } } = {} } = state
  const { txParams = {} } = txData


  const {
    conversionRate,
    selectedAddress
  } = metamask
  const accounts = getMetaMaskAccounts(state)
  const { balance } = accounts[selectedAddress]

  const {
    gasPrice,
    gas: gasLimit,
    value: amount,
  } = txParams

  const {
    hexTransactionFee,
    hexTransactionTotal
  } = confirmTransaction

  const {
    customGasLimit,
    customGasPrice,
  } = gas

  const insufficientBalance = !isBalanceSufficient({
    amount,
    gasTotal: calcGasTotal(gasLimit, gasPrice),
    balance,
    conversionRate,
  })

  return {
    txData,
    html,
    style,
    hexTransactionFee,
    hexTransactionTotal,
    advancedInlineGasShown: getAdvancedInlineGasShown(state),
    customGas: {
      gasLimit: customGasLimit || gasLimit,
      gasPrice: customGasPrice || gasPrice,
    },
    insufficientBalance
  }
}

export default connect(mapStateToProps)(ConfirmWidget)