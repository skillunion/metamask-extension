import { connect } from 'react-redux'
import ConfirmWidget from './confirm-widget.component'

const mapStateToProps = state => {
  const { confirmTransaction: { txData } = {} } = state
  const { confirmTransaction: { txData: { origin: { context: { html } } } } = {} } = state
  const { confirmTransaction: { txData: { origin: { context: { style } } } } = {} } = state

  return {
    txData,
    html,
    style
  }
}

export default connect(mapStateToProps)(ConfirmWidget)
