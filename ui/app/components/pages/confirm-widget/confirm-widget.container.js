import { connect } from 'react-redux'
import ConfirmWidget from './confirm-widget.component'

const mapStateToProps = state => {
  const { confirmTransaction: { txData } = {} } = state
  const { confirmTransaction: { txData: { origin: { html } } } = {} } = state
  const { confirmTransaction: { txData: { origin: { style } } } = {} } = state

  return {
    txData,
    html,
    style
  }
}

export default connect(mapStateToProps)(ConfirmWidget)
