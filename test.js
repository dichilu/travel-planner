import { YoutubeTranscript } from 'youtube-transcript/dist/youtube-transcript.esm.js';
YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=jNQXAC9IVRw').then(t => console.log(t.length)).catch(console.error);
