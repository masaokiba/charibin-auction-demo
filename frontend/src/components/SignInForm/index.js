import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'

import FormField from 'components/FormField'
import InputField from 'components/InputField'


class SignInForm extends PureComponent {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  }

  render() {
    const { handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <FormField
          name="username"
          type="text"
          label="Username or Email:"
          component={InputField}
        />
        <FormField
          name="password"
          type="password"
          label="Password:"
          component={InputField}
        />
        <center>
          <button type="submit" className="btn btn-primary">Sign In</button>
        </center>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.get('username')) {
    errors.username = 'Username or email is required'
  }

  if (!values.get('password')) {
    errors.password = 'Password is required'
  }

  return errors
}

export default compose(
  reduxForm({
    form: 'signInForm',
    validate,
  })
)(SignInForm)