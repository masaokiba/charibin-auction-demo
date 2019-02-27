import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Alert, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectModal, show as showModal } from 'redux-modal'
import { modalSelector } from 'store/selectors'
import { reduxForm } from 'redux-form/immutable'

import SubscribeForm from 'components/SubscribeForm'
import { MAILCHIMP_TYPE_NEWSLETTER } from 'config'
import { mailchimpSubscribe } from 'utils/form'


const sanitizeError = (error) =>
  error.replace('<a', '<a class="alert-link"')

class SubscribeModal extends PureComponent {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
  }

  doSubmit = (data) => {
    const { handleHide, showModal } = this.props
    return mailchimpSubscribe(MAILCHIMP_TYPE_NEWSLETTER, data.get('email'))
      .then(() => {
        handleHide()
        showModal('messageModal', {
          title: 'Thank you!',
          subtitle: 'Successfully subscribed to our newsletter'
        })
      })
  }

  render() {
    const { handleHide, show, subscribeForm } = this.props
    const { error, handleSubmit } = subscribeForm

    return (
      <Modal isOpen={show} toggle={handleHide} size="sm">
        <ModalHeader toggle={handleHide}>Welcome!</ModalHeader>
        <ModalBody> 
          <h4 className="mb-30">Join our mailing list</h4>
          <p className="mb-30">
            We never send spam. Only valuable information once or twice per week.
          </p>
          {error && <Alert color="danger">
            <div dangerouslySetInnerHTML={{ __html: sanitizeError(error) }} />
          </Alert>}
          <SubscribeForm
            {...subscribeForm}
            forModal
            handleSubmit={handleSubmit(this.doSubmit)}
          />
        </ModalBody>
      </Modal>
    )
  }
}

const actions = {
  showModal
}

export default compose(
  connect(null, actions),
  reduxForm({
    form: 'subscribeModalForm',
    propNamespace: 'subscribeForm'
  }),
  connectModal({
    name: 'subscribeModal',
    destroyOnHide: false,
    getModalState: modalSelector
  })
)(SubscribeModal)
