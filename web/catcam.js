

const MIME_CODEC_CHROME_ALIVE = 'video/webm; codecs="vp8"';
const WS_HOST = 'ws://titan.homelinux.net:4445';
let mediaSource,
  video,
  queue = [];

function sourceEnd() {
  console.log('>>>>>>>>>>>> SOURCE END');
}

function sourceClose() {
  console.log('>>>>>>>>>>>> SOURCE CLOSE');
}

function sourceOpenOnLive() {
  console.log('>>>>>>>>>>>> SOURCE OPEN OnLIVE');
  const ws = io.connect(WS_HOST);

  const srcBuffer = mediaSource.addSourceBuffer(MIME_CODEC_CHROME_ALIVE);
  srcBuffer.mode = 'sequence';
  srcBuffer.addEventListener('update', () => {
    if (queue.length > 0 && !srcBuffer.updating) {
      srcBuffer.appendBuffer(queue.shift());
    }
  });
  srcBuffer.addEventListener('updateend', () => {
    if (queue.length > 0 && !srcBuffer.updating) {
      srcBuffer.appendBuffer(queue.shift());
    }
  });
  srcBuffer.addEventListener('error', e => {
    ws.close();
    console.error(e);
  });

  ws.on('onChunk', buffer => {
    if (srcBuffer.updating || queue.length > 0) {
      queue.push(new Uint8Array(buffer));
    } else {
      srcBuffer.appendBuffer(new Uint8Array(buffer));
      // video.play();
    }
  });
}

function main() {
  if ('MediaSource' in window && MediaSource.isTypeSupported(MIME_CODEC_CHROME_ALIVE)) {
    try {
      console.log('>>>>>>>>>>>> MEDIASOURCE DETECTED');
      mediaSource = new MediaSource();
      video = document.getElementById('camera');
      video.src = window.URL.createObjectURL(mediaSource);
      mediaSource.addEventListener('sourceopen', sourceOpenOnLive, false);
      mediaSource.addEventListener('sourceend', sourceEnd, false);
      mediaSource.addEventListener('sourceclose', sourceClose, false);
    } catch (err) {
      console.error(err);
    }
  } else {
    console.error('Unsupported MIME type or codec: ', MIME_CODEC_CHROME_ALIVE);
  }
}

$(document).ready(main);
