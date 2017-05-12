import React, { Component } from 'react';
import { connect } from 'react-redux';
import './video_styles.scss';

import Video from '../video/video_component';

class VideoContainer extends Component {
  render() {
    return (
      <div className='container-video'>
        <Video />
      </div>
    );
  }
}

function mapStateToProps(/* state*/) {
  return {};
}

export default connect(mapStateToProps)(VideoContainer);
