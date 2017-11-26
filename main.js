const onReady = function(){
  console.log(`${this.playerId}: Miku is ready!`);
  this.Play();
}

const onMetadataChange = function(data){
  console.log(`${this.playerId}: Miku reporting player's change!`, data);
}

const onStatusChange = function(status){
  console.log(`${this.playerId}: Hey anon, the player's status has changed!`, status)
}

const onEnd = function(){
  console.log(`${this.playerId}: Sorry anon, song ended! Please comeback later!`);
}

document.addEventListener("DOMContentLoaded", function() {
  const createPlayerAndControls = function(videoId){
    const newPlayerId = NND._nextPlayerId;
    const player = NND.Create(videoId, document.getElementById(`player-${newPlayerId}`), 320, 240);
    
    // Event listeners
    player.onReady = onReady.bind(player);
    player.onMetadataChange = onMetadataChange.bind(player);
    player.onStatusChange = onStatusChange.bind(player);
    player.onEnd = onEnd.bind(player);
  
    // Controllers
    document.getElementById(`volume-${newPlayerId}`).oninput = function(){
      player.ChangeVolume(this.value);
    }
  
    document.getElementById(`play-${newPlayerId}`).onclick = function(){
      player.Play();
    }
  
    document.getElementById(`pause-${newPlayerId}`).onclick = function(){
      player.Pause();
    }

    return player;
  }

  const player1 = createPlayerAndControls('sm9205429');
  const player2 = createPlayerAndControls('sm21319705');

  window.player = player1;
});

