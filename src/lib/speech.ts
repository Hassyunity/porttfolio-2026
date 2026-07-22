function pickFemaleFrenchVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const frenchVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('fr'));
  const byName = (pattern: RegExp) => frenchVoices.find((v) => pattern.test(v.name));

  return (
    byName(/julie|hortense|amélie|amelie|virginie|audrey|marie|céline|celine|female|femme/i) ||
    frenchVoices[0] ||
    null
  );
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function speak(text: string): void {
  if (!isSpeechSupported()) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.pitch = 1.15;
  utterance.rate = 1;

  const applyVoiceAndSpeak = (voices: SpeechSynthesisVoice[]) => {
    const voice = pickFemaleFrenchVoice(voices);
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  };

  const voices = synth.getVoices();
  if (voices.length > 0) {
    applyVoiceAndSpeak(voices);
  } else {
    // Les voix ne sont pas toujours chargées dès le premier appel
    const onVoicesChanged = () => {
      applyVoiceAndSpeak(synth.getVoices());
      synth.removeEventListener('voiceschanged', onVoicesChanged);
    };
    synth.addEventListener('voiceschanged', onVoicesChanged);
  }
}
