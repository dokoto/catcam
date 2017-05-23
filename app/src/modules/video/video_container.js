import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import './video_styles.scss';

import Video from '../video/video_component';
import { initVideo } from './video_actions';
import Loader from '../../components/loader';

class VideoContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(initVideo('camera'));
  }

  render() {
    return (
      <section>
        <div className='container-video'>
          <Video />
        </div>
        <Loader visible={ !this.props.playing } message='Reconnecting...' />
      </section>
    );
  }
}

function mapStateToProps(state) {
  const { playing } = state.stream;
  return { playing };
}

export default connect(mapStateToProps)(VideoContainer);
