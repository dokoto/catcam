import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './video_styles.scss';

import Video from '../video/video_component';
import { initVideo } from './video_actions';

class VideoContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(initVideo('camera'));
  }

  render() {
    return (
      <div className='container-video'>
        <Video />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(VideoContainer);
