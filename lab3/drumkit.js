var channel = 0;
const channels = [[], [], [], []]

document.addEventListener('keypress', onKeyPress)

const KeyToSound = {
    'q': document.querySelector('#s1'),
    'w': document.querySelector('#s2'),
    'e': document.querySelector('#s3'),
    'a': document.querySelector('#s4'),
    's': document.querySelector('#s5'),
    'd': document.querySelector('#s6')
}

function onKeyPress(event) {
    const sound = KeyToSound[event.key]
    playSound(sound)
    insertSoundToChannel(sound)
}

function playSound(sound) {
    if (!sound) {
        return
    }
    sound.currentTime = 0
    sound.play()
}

function insertSoundToChannel(sound) {
    console.log(channel);
    var lastTimestamp = Math.max(...channels[this.channel].map(x => x.timestamp) || 0);
    var sleep = Math.max(Date.now() - lastTimestamp, 0);

    channels[this.channel].push({ sound: sound, sleep: sleep, timestamp: Date.now() });
}

function setChannel(val) {
    channel = val;
}

function play() {
    const playableChannels = document.querySelectorAll('input[name=isChannelChecked]:checked');
    playableChannels.forEach(x => {
        channels[parseInt(x.id)].forEach(y => {
            setTimeout(() => {
                playSound(y.sound);
            }, y.sleep)
        })
    })
}
