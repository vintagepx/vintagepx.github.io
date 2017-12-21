(function(global){
  const playerStatus = {
    loading: 1,
    playing: 2,
    paused: 3,
    ended: 4
  };
  
  const NiconicoPlayer = function(options) {
    var videoId = options.videoId;
    var target = options.target;
    var iframe = options.iframe;
    var width = options.width;
    var height = options.height;
    var playerId = options.playerId;

    var origin = 'https://embed.nicovideo.jp';
    var playerUrl = `${origin}/watch/${videoId}?jsapi=1&playerId=${playerId}`;

    if(iframe){
      var url = new URL(iframe.src);
      url.searchParams.set('jsapi', '1');
      url.searchParams.set('playerId', playerId.toString());
      iframe.src = url.toString();
      playerUrl = url.toString();
    }else{
      iframe = document.createElement('iframe');
      iframe.setAttribute('src', playerUrl);
      iframe.setAttribute('frameborder', 0);
      iframe.setAttribute('scrolling', 0);
      iframe.setAttribute('width', width || 640);
      iframe.setAttribute('height', height || 480);
      
      target.appendChild(iframe);
    }
  
    return {
      url: playerUrl,
      playerId: playerId,
      videoId: videoId,
      iframe: iframe,
      status: 0,
      videoInfo: null,
      currentTime: 0,
      duration: 0,
      maximumBuffered: 0,
      muted: false,
      volume: 0,
  
      Play: function(){
        this._postMessage('play');
        return this;
      },
      Pause: function(){
        this._postMessage('pause');
        return this;
      },
      Mute: function(){
        this._postMessage('mute', { mute: true });
        return this;
      },
      UnMute: function(){
        this._postMessage('mute', { mute: false });
        return this;
      },
      Seek: function(time){
        this._postMessage('seek', { time: time });
        return this;
      },
      ChangeVolume: function(volume){
        this._postMessage('volumeChange', { volume: volume });
        return this;
      },
  
      onReady: function(){
        
      },
      onStatusChange: function(status){
  
      },
      onEnd: function(){
  
      },
  
      _handleEvent: function(event){
        if(event.eventName === 'loadComplete'){
          this.videoInfo = event.data.videoInfo;
          this.onReady();
        }
        else if(event.eventName === 'playerStatusChange'){
          this.status = event.data.playerStatus;
          this.onStatusChange(this.status);

          if(event.data.playerStatus === playerStatus.ended){
            this.onEnd();
          }
        }
        else if(event.eventName === 'playerMetadataChange'){
          this.currentTime = event.data.currentTime;
          this.duration = event.data.duration;
          this.maximumBuffered = event.data.maximumBuffered;
          this.muted = event.data.muted;
          this.volume = event.data.volume;
          this.onMetadataChange(event.data);
        }
      },
      _postMessage: function(eventName, data){
        const message = {
          playerId: this.playerId.toString(),
          sourceConnectorType: 1,
          eventName: eventName,
        };
  
        if(data){
          message.data = data;
        }
  
        this.iframe.contentWindow.postMessage(message, origin);
      }
    }
  }
  
  const NiconicoFactory = function(){
    const factory = {
      _nextPlayerId: 0,
      players: [],
      playerStatus: playerStatus,
  
      Create: function(videoId, target, width, height){
        var player = NiconicoPlayer({
          videoId: videoId,
          target: target,
          width: width,
          height: height,
          playerId: this._nextPlayerId++
        });
        this.players.push(player);
  
        return player;
      },
      Assign: function(iframe){
        var player = NiconicoPlayer({
          iframe: iframe,
          playerId: this._nextPlayerId++
        });
        this.players.push(player);

        return player;
      },
  
      _handleEvent: function(event){
        const player = this.players.find(function(player){
          return player.playerId === parseInt(event.playerId);
        })
  
        if(player){
          player._handleEvent(event);
        }
      }
    }
  
    window.addEventListener('message', function(event){
      if(event.origin === 'https://embed.nicovideo.jp'){
        factory._handleEvent(event.data);
      }
    })
  
    return factory;
  }

  global.NND = NiconicoFactory();
})(window);
