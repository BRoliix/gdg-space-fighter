import { atom } from 'jotai';

export const playerPositionAtom = atom({ x: 375, y: 20 });
export const scoreAtom = atom(0);
export const gameOverAtom = atom(false);
export const obstaclesAtom = atom([]);
export const bulletsAtom = atom([]);
export const collisionStateAtom = atom(false);
export const bulletHitsAtom = atom([]);