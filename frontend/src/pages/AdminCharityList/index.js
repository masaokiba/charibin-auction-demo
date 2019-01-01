import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import AdminLayout from 'pages/AdminLayout'
import {
  getCharityList,
  deleteCharity,
} from 'store/modules/admin/charities'
import { adminCharitiesSelector } from 'store/selectors'


class AdminCharityList extends PureComponent {

  static propTypes = {
    adminCharities: ImmutablePropTypes.map.isRequired,
    getCharityList: PropTypes.func.isRequired,
    deleteCharity: PropTypes.func.isRequired,
  }

  handleDelete = (id, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to delete this charity?')) {
      return;
    }

    this.props.deleteCharity({
      id,
      success: () => {
        this.props.getCharityList()
      },
      fail: () => {
        alert('Failed to delete charity')
      },
    })
  }

  componentWillMount() {
    this.props.getCharityList()
  }

  render() {
    const { adminCharities } = this.props
    const charityList = adminCharities.get('charityList')

    return (
      <AdminLayout>
        <div className="mb-4 clearfix">
          <h2 className="pull-left">Charities</h2>
          <Link className="btn btn-primary pull-right" to="/admin/charities/create">Create</Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {charityList.map(charity => (
              <tr key={charity.get('pk')}>
                <th scope="row">{charity.get('pk')}</th>
                <td>{charity.get('title')}</td>
                <td>{charity.get('description')}</td>
                <td>
                  <Link className="text-secondary pr-3" to={`/admin/charities/${charity.get('pk')}`}>Edit</Link>
                  <a className="text-danger" href="/" onClick={this.handleDelete.bind(this, charity.get('pk'))}>Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminLayout>
    )
  }
}

const selector = createStructuredSelector({
  adminCharities: adminCharitiesSelector,
})

const actions = {
  getCharityList,
  deleteCharity,
}

export default compose(
  connect(selector, actions)
)(AdminCharityList)