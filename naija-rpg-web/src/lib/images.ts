/**
 * Every photo used by the Naija redesign lives here.
 * To swap a placeholder: drop your file in /public/images and change the path.
 *  - hero:  landscape, 1920x1080+, person on the RIGHT, calm area on the left for text
 *  - lobby: wide banner, about 1600x500
 *  - modes: 3:2 images, about 600x400
 * Tune where the photo is cropped with the *Position values (CSS object-position).
 */
export const IMAGES = {
  hero: '/images/hero.jpg', // -> '/images/hero.jpg'
  heroPosition: '70% 20%',
  lobby: '/images/lobby-placeholder.svg', // -> '/images/lobby.jpg'
  lobbyPosition: '50% 30%',
  modes: {
    'rival-1v1': '/images/mode-face-off-placeholder.svg', // -> '/images/mode-face-off.jpg'
    'coop-1v1': '/images/mode-link-up-placeholder.svg', // -> '/images/mode-link-up.jpg'
  } as Record<string, string>,
} as const;