import React, { useEffect, useRef, useState } from 'react';

const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const mediaRecorderRef = useRef(null);
    const [audioChunks, setAudioChunks] = useState([]);

    useEffect(() => {
        const startRecording = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                setAudioChunks((prev) => [...prev, event.data]);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
                // Here you can also handle the audio blob for storage or further processing
            };

            mediaRecorderRef.current.start();
        };

        if (isRecording) {
            startRecording();
        } else if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }

        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isRecording, audioChunks]);

    const handleSpeechRecognition = () => {
        const recognition = new window.SpeechRecognition();
        recognition.onresult = (event) => {
            setTranscript(event.results[0][0].transcript);
        };
        recognition.start();
    };

    return (
        <div>
            <button onClick={() => setIsRecording(!isRecording)}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <button onClick={handleSpeechRecognition}>Convert Speech to Text</button>
            <p>Transcript: {transcript}</p>
        </div>
    );
};

export default VoiceRecorder;