/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');

var EditorOutputLine = require('./EditorOutputLine.jsx');

var EditorOutput = React.createClass({
  render: function () {
    // console.log(this.props.output);
    var lineList = this.props.output ? this.props.output.map(function (text, i) {
      return <EditorOutputLine text={text} key={i}/>;
    }) : [];
    return (
      <div className={this.props.className + ' m-note--output'}>{lineList}</div>
    );
  }
});

// class EditorOutput extends React.Component {
//   render() {
//     // console.log(this.props.output);
//     return (
//       <div className={this.props.className + ' m-note--output'}>
//         {this.props.output.map((text, i) =>
//           <EditorOutputLine text={text} key={i}/>
//         )}
//       </div>
//     );
//   }
// };

module.exports = EditorOutput;