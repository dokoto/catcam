import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './video_styles.scss';

import Video from '../video/video_component';
import { initVideo } from './video_actions';

class VideoContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    /*playing: PropTypes.bool.isRequired,
    bufferLoaded: PropTypes.bool.isRequired,
    channel: PropTypes.string,
    type: PropTypes.string,
    sources: PropTypes.object,
    id: PropTypes.string,
    resolution: PropTypes.string,
    orientation: PropTypes.string,*/
  };

  componentDidMount() {
    /*
    if (!this.props.playing && !this.props.bufferLoaded) {
      this.props.dispatch(initVideo('camera'));
    } else if (!this.props.playing && this.props.bufferLoaded && this.props.channel) {
      this.props.dispatch(requestStartStream());
    }*/
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
  // const { playing, type, sources, id, resolution, orientation } = state.stream;
  // return { playing, type, /* bufferLoaded, channel,*/ sources, id, resolution, orientation };
  return {};
}

export default connect(mapStateToProps)(VideoContainer);
