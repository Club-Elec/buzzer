export const available_sounds = [
  "Alarme.mp3",
  "Boum!.mp3",
  "Clown.mp3",
  "Vélo.mp3",
  "WhatsApp.mp3",
  "Buzzer.mp3",
  "Miaou.mp3",
  "T-Rex.mp3",
  "Cochon.mp3",
] as const;

export type AvailableSound = (typeof available_sounds)[number];
