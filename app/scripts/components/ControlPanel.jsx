/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var collapse = require('../../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/collapse.js');
var dropdown = require('../../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/dropdown.js');

/**
 * Control Panel View
 */
var ControlPanel = React.createClass({
  mixins: [FluxChildMixin],

  handleAddPage: function (event) {
    event.preventDefault();

    var type = $(event.target).data('type');
    var item = {
      type: type,
      name: 'New ' + type,
      input: ''
    };
    this.getFlux().actions.addPage(item);
    // TODO scroll to the new item
  },

  handleLogin: function () {
    this.getFlux().actions.login();
  },

  handleLogout: function () {
    this.getFlux().actions.logout();
  },

  componentDidMount: function () {},

  render: function () {
    // console.log(this.props.user.user)

    var accountLinks;
    if (this.props.user && this.props.user.user && this.props.user.user.id) {
      accountLinks = (
        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><img className="m-controlpanel--profile-image" src={this.props.user.user.image_url} />{this.props.user.user.displayName} <b className="caret"></b></a>

            <ul className="dropdown-menu">
              <li><a href="#!/account">Account</a></li>
              <li className="divider"></li>
              <li><a href="#!/logout" onClick={this.handleLogout}>Log out</a></li>
            </ul>
          </li>
        </ul>
      );
    } else {
      accountLinks = (
        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown">
            <a href="#!/login" onClick={this.handleLogin}>Log in</a>
          </li>
        </ul>
      );
    }

    return (
      <nav role="navigation" className="navbar navbar-default navbar-fixed-top m-controlpanel m-controlpanel--container">
        <div className="container-fluid">

          <div className="navbar-header">
            <a className="navbar-brand" href="#">Mathr</a>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><a className="btn" href="#" onClick={this.handleAddPage} data-type="note">Add a Note</a></li>
              <li><a className="btn" href="#" onClick={this.handleAddPage} data-type="table">Add a Table</a></li>
              <li><a className="btn" href="#" onClick={this.handleAddPage} data-type="function">Add a Func</a></li>
            </ul>

            {accountLinks}
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = ControlPanel;