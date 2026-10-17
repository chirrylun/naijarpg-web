/**
 * Keyframes for the encounter stage. Same rules as the landing street:
 * transform / opacity only, so phones stay smooth, and everything switches off for prefers-reduced-motion.
 * Person walking keyframes (nrpg-leg, nrpg-arm, nrpg-bob) come from SceneStyles in features/scene/People.
 *
 * Beats only declare where an actor STARTS (or where it ENDS for exits); the resting spot is the actor's own x / y.
 */
const STAGE_CSS = `
.stg-a{animation-duration:var(--for,1.2s);animation-delay:var(--at,0s);animation-fill-mode:both;animation-timing-function:cubic-bezier(.16,.84,.3,1)}
[data-beat="driveInL"]{animation-name:stg-in-l}
[data-beat="driveInR"]{animation-name:stg-in-r}
[data-beat="walkInL"]{animation-name:stg-in-l;animation-timing-function:cubic-bezier(.25,.6,.4,1)}
[data-beat="walkInR"]{animation-name:stg-in-r;animation-timing-function:cubic-bezier(.25,.6,.4,1)}
[data-beat="popIn"]{animation-name:stg-pop;animation-timing-function:cubic-bezier(.3,1.5,.5,1);transform-box:fill-box;transform-origin:50% 100%}
[data-beat="fadeIn"]{animation-name:stg-fade;animation-timing-function:ease-out}
[data-beat="riseIn"]{animation-name:stg-rise}
[data-beat="tossL"]{animation-name:stg-toss;animation-timing-function:cubic-bezier(.2,.7,.4,1);transform-box:fill-box;transform-origin:50% 100%}
[data-beat="driveOutR"]{animation-name:stg-out-r;animation-timing-function:cubic-bezier(.5,0,.9,.6)}
[data-beat="driveOutL"]{animation-name:stg-out-l;animation-timing-function:cubic-bezier(.5,0,.9,.6)}
[data-beat="walkOffR"]{animation-name:stg-out-r;animation-timing-function:linear}
[data-beat="walkOffL"]{animation-name:stg-out-l;animation-timing-function:linear}
@keyframes stg-in-l{from{transform:translateX(-620px)}}
@keyframes stg-in-r{from{transform:translateX(620px)}}
@keyframes stg-out-r{to{transform:translateX(680px)}}
@keyframes stg-out-l{to{transform:translateX(-680px)}}
@keyframes stg-pop{from{opacity:0;transform:translateY(-12px) scale(.5)}}
@keyframes stg-fade{from{opacity:0}}
@keyframes stg-rise{from{opacity:0;transform:translateY(26px)}}
@keyframes stg-toss{from{opacity:1;transform:translate(170px,-46px) rotate(70deg)}60%{transform:translate(30px,-6px) rotate(-12deg)}}

/* wheels only spin while the vehicle is actually driving */
.stg-wheel{animation:nrpg-spin .32s linear 6}

/* idles: small, slow, and never louder than the story text */
.stg-idle-hop{animation:nrpg-hop 1.3s ease-in-out infinite}
.stg-idle-float{animation:nrpg-float 3s ease-in-out infinite}
.stg-idle-rumble{animation:stg-rumble .2s ease-in-out infinite}
.stg-idle-heave{animation:stg-heave .7s ease-in-out infinite}
.stg-idle-sway{transform-box:fill-box;transform-origin:50% 100%;animation:stg-sway 2.6s ease-in-out infinite}
.stg-idle-crossL,.stg-idle-crossR{will-change:transform;animation-timing-function:linear;animation-iteration-count:infinite;animation-duration:var(--idur,12s);animation-delay:var(--at,0s);animation-fill-mode:backwards}
.stg-idle-crossR{animation-name:stg-cross-r}
.stg-idle-crossL{animation-name:stg-cross-l}
@keyframes stg-rumble{0%,100%{transform:translateY(0)}50%{transform:translateY(-.9px)}}
@keyframes stg-heave{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.6px)}}
@keyframes stg-sway{0%,100%{transform:rotate(-1.4deg)}50%{transform:rotate(1.4deg)}}
@keyframes stg-cross-r{from{transform:translateX(-720px)}to{transform:translateX(720px)}}
@keyframes stg-cross-l{from{transform:translateX(720px)}to{transform:translateX(-720px)}}

/* ambience in the backdrops */
.stg-brake{animation:stg-brake 2.4s ease-in-out infinite;animation-delay:var(--bd,0s)}
@keyframes stg-brake{0%,100%{opacity:.55}50%{opacity:1}}
.stg-flicker{animation:stg-flicker 2.1s steps(1,end) infinite;animation-delay:var(--fd,0s)}
@keyframes stg-flicker{0%{opacity:1}12%{opacity:.7}18%{opacity:1}52%{opacity:.82}58%{opacity:1}80%{opacity:.75}86%{opacity:1}}
.stg-glow{animation:stg-glow 3.6s ease-in-out infinite}
@keyframes stg-glow{0%,100%{opacity:.75}50%{opacity:1}}
.stg-neon{animation:stg-neon 1.7s steps(1,end) infinite}
@keyframes stg-neon{0%,100%{opacity:1}7%{opacity:.25}11%{opacity:1}40%{opacity:1}43%{opacity:.4}47%{opacity:1}}
.stg-zzz{animation:stg-zzz 2.8s ease-out infinite}
@keyframes stg-zzz{0%{opacity:0;transform:translate(0,4px)}25%{opacity:1}100%{opacity:0;transform:translate(6px,-12px)}}
.stg-puff{animation:stg-puff 1.6s ease-out infinite;animation-delay:var(--pd,0s)}
@keyframes stg-puff{0%{opacity:0;transform:translateY(2px) scale(.7)}30%{opacity:.9}100%{opacity:0;transform:translateY(-8px) scale(1.15)}}
.stg-plane{will-change:transform;animation:stg-plane 26s linear infinite;animation-delay:var(--at,0s)}
@keyframes stg-plane{from{transform:translate(-120px,0)}to{transform:translate(740px,-26px)}}

.stg-skip .stg-a{animation-duration:.01s!important;animation-delay:0s!important}
.stg-skip .stg-wheel{animation:none!important}

@media (prefers-reduced-motion:reduce){
  .stg-stage *{animation:none!important}
}
`;

export function StageStyles() {
  return (
    <style href="nrpg-stage" precedence="default">
      {STAGE_CSS}
    </style>
  );
}
