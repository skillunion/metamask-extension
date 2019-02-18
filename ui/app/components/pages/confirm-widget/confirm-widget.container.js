import { connect } from 'react-redux'
import ConfirmWidget from './confirm-widget.component'

const mapStateToProps = state => {
  //const { confirmTransaction: { txData } = {} } = state

  return {
    //txData,
  }
}

export default connect(mapStateToProps)(ConfirmWidget)
