// Still working on translating and tidying this up

// The raindrops are generated using one of two methods:
// - CSS: raindrops are generated once by JavaScript, then their animation loops
// - JS: raindrops are constantly generated, there is no loop

// Gets the current method
function getMethode() {
  return (document.querySelector('.cont').classList.contains('boucle')) ? 'css' : 'js';
}

// Changes method
function switchMethode() {
  if (getMethode() == 'css')
  {
    document.querySelector('.cont').classList.remove('boucle');
    document.querySelector('.method>span').innerHTML = 'JavaScript constantly generating rain drops';
    genererGouttes();
  }
  else
  {
    document.querySelector('.cont').classList.add('boucle');
    document.querySelector('.method>span').innerHTML = 'CSS animated rain drops (looping)';
    genererGouttes();
  }
}

// Let's generate raindrops

const r = Math.round(100 * Math.random());
const dureeChuteGoutte = 1000; // en ms

function genererGouttes()
{
  let vw = window.innerWidth;
  let vh = window.innerHeight;

  let methode = getMethode();

  const sol = document.getElementById('sol');
  const air = document.getElementById('air');

  // Remove preexisting rain drops
  sol.innerHTML = '';
  air.innerHTML = '';

  let vmin = Math.min(vw, vh);
  const positionSol = 0.5 * vh;
  const largeurMin = 0;
  let largeurMax = 2 * vw;
  const hauteurMin = 0;
  let hauteurMax = vh - positionSol;

  // Number of rain drops to fill the screen
  const nombreGouttes = Math.min(150, Math.max(40, Math.floor(vw / 20)));

  // Random wind direction
  const provenance = Math.round(-0.1 * vw + 0.2 * vw * Math.random());
  document.body.style.setProperty('--provenance', provenance);

  // Chooses the position where a raindrop will hit the ground, before tracing it back to its starting position
  function positionnerGoutte(encyclie, goutte)
  {
    // 1 : Randomly choose end position (relative to ground)
    const positionEncyclie = {
      left: largeurMin + Math.round(Math.random() * (largeurMax - largeurMin)),
      top: hauteurMin + Math.round(Math.random() * (hauteurMax - hauteurMin))
    };
    encyclie.style.setProperty('--left', positionEncyclie.left);
    encyclie.style.setProperty('--top', positionEncyclie.top);

    // 2 : Absolute positioning of the raindrop based on its absolute end position (after applying perspective) relative to the ground
    const positionChuteCalc = calcPersp([
      positionEncyclie.left - 0.5 * vw, // on translate les coordonnées relatives au sol pour obtenir les coordonnées absolues
      positionEncyclie.top + 0.5 * vh
    ]);
    const positionGoutte = positionChuteCalc[0];
    goutte.style.left = positionGoutte + 'px';
    goutte.style.setProperty('--bottom', positionChuteCalc[1]);

    // 3 : Détermination de la couleur et taille de la goutte et de l'encyclie selon leur profondeur apparente
    const luminosityMin = 40;
    const luminosityMax = 98;
    const luminosity = Math.round(luminosityMin + (positionEncyclie.top / hauteurMax) * (luminosityMax - luminosityMin));
    encyclie.style.setProperty('--l', luminosity + '%');
    goutte.style.setProperty('--l', luminosity + '%');
    if ((positionEncyclie.top / hauteurMax) < 0.3)
      goutte.style.setProperty('--coeff-distance', 0.5);
    else
      goutte.style.setProperty('--coeff-distance', 1);

    return [positionGoutte, positionChuteCalc];
  }

  // Fonction de création d'une unique goutte
  function creerGoutte(start = false)
  {
    let positionGoutte, positionChuteCalc;
    let chuteGoutte, animationOnde; // animations

    // ÉTAPE 1 : CRÉATION D'UNE GOUTTE ET SON ENCYCLIE
    // 1.1 : Création de l'encyclie et son centre
    const encyclie = document.createElement('div');
    encyclie.classList.add('encyclie');
    const pointDeChute = document.createElement('div');
    pointDeChute.classList.add('point-de-chute');
    const onde = document.createElement('div');
    onde.classList.add('onde');
    encyclie.appendChild(pointDeChute);
    encyclie.appendChild(onde);

    // 1.2 : Création de la goutte
    const goutte = document.createElement('div');
    goutte.classList.add('goutte');

    // 1.3 : Positionnement de la goutte et de son encyclie
    [positionGoutte, positionChuteCalc] = positionnerGoutte(encyclie, goutte);

    // 1.5 : Choix aléatoire d'un délai pour la goutte afin que l'animation ait "déjà commencé" au chargement de la page
    if (methode == 'css')
    {
      const delai = Math.round(Math.random() * 2000) / 1000;
      goutte.style.setProperty('--delay', delai);
      encyclie.style.setProperty('--delay', delai);
    }

    // ÉTAPE 2 : ANIMATION DE LA GOUTTE ET DE SON ENCYCLIE       
    // 2.1 : Si la goutte ne traverse jamais l'écran (car son point de départ et son point de chute sont hors de l'écran), on l'ignore
    if ((positionGoutte + provenance <= 0 && positionGoutte <= 0) || (positionGoutte + provenance >= vw && positionGoutte >= vw))
    {
      if (methode == 'js')
        return creerGoutte();
    }
    // 2.2 : Sinon, on les ajoute à la page
    else
    {
      sol.appendChild(encyclie);
      air.appendChild(goutte);
    }

    // 2.3 : Animation de la goutte (si méthode == js ; l'animation est gérée par CSS sinon)
    if (methode == 'js')
    {
      let delai = 0;
      if (start)
        delai = -1500 + Math.round(Math.random() * 2500);
      else
        delai = Math.round(Math.random() * 100);

      animationOnde = onde.animate([
        { transform: 'translate3D(0, 0, 0) scale(0)', opacity: 1 },
        { transform: 'translate3D(0, 0, 0) scale(.5)', opacity: 0 }
      ], {
        easing: 'linear',
        duration: 400,
        //delay: delai + dureeChuteGoutte,
        iterations: 1
      });
      animationOnde.pause();

      let keyframesGoutte = [
        { transform: 'translate3D(' + provenance + 'px, 0, 0)' },
        { transform: 'translate3D(0,' + Math.round(positionChuteCalc[1] + 5) + 'px, 0)' }
      ];
      const optionsGoutte = {
        easing: 'linear',
        duration: dureeChuteGoutte,
        delay: delai,
        iterations: 1
      };

      chuteGoutte = goutte.animate(keyframesGoutte, optionsGoutte);
      chuteGoutte.addEventListener('finish', () => {
        animationOnde.play();
      });

      animationOnde.addEventListener('finish', () => {
        if (getMethode() == 'js') // Re-vérifier la méthode pour que les gouttes JS arrêtent de boucler si on passe en méthode CSS
        {
          [positionGoutte, positionChuteCalc] = positionnerGoutte(encyclie, goutte);

          keyframesGoutte[1] = { transform: 'translate3D(0,' + Math.round(positionChuteCalc[1] + 5) + 'px, 0)' };
          optionsGoutte.delay = 0;

          chuteGoutte = goutte.animate(keyframesGoutte, optionsGoutte);
          chuteGoutte.addEventListener('finish', () => {
            animationOnde.play();
          });
        }
      });
    }
  }

  for (let i = 0; i < nombreGouttes; i++) {
    creerGoutte(true);
  }
}

genererGouttes(); // On génère des gouttes dès l'arrivée sur la page
window.addEventListener('resize', genererGouttes); // On en génère aussi quand la fenêtre est redimensionnée...
window.addEventListener('orientationchange', genererGouttes); // ...ou que l'écran change d'orientation

// Calcule la position d'un point de chute sur l'écran après l'effet de perspective.
// Permet de simplifier le procédé (créer point de chute => attendre getBoundingClientRect => créer goutte) en (tout créer d'un coup).
function calcPersp(X = [0, 0])
{
  let vw = window.innerWidth;
  let vh = window.innerHeight;

  let X1 = X;
  const d = 0.5 * vh;

  // ÉTAPE 1 : Rotation d'angle PI/2 = 90deg autour de l'axe x en bas de l'écran
  const alpha = Math.PI / 2;
  // On translate les coordonnées pour que l'axe de rotation passe par l'origine
  X1 = [
    X1[0],
    X1[1] - vh,
    0
  ];
  // On applique la rotation autour de l'axe x passant par l'origine
  X1 = [
    X1[0],
    Math.cos(alpha) * X1[1] - Math.sin(alpha) * X1[2],
    Math.sin(alpha) * X1[1] + Math.cos(alpha) * X1[2]
  ];
  // On translate les coordonnées dans l'autre sens pour replacer l'axe de rotation en bas de l'écran
  X1 = [
    X1[0],
    X1[1] + vh,
    X1[2]
  ];

  // ÉTAPE 2 : on convertir les coordonnées pour que l'écran soit mappé de [-1, -1] à [1, 1]
  // On translate l'origine du repère au centre de l'écran
  X1 = [
    X1[0] - 0.5 * vw,
    X1[1] - 0.5 * vh,
    X1[2]
  ];
  // On applique une échelle pour transformer 0.5 * vw en 1 et 0.5 * vh en 1 sur leurs axes
  X1 = [
    X1[0] / (0.5 * vw),
    X1[1] / (0.5 * vh),
    X1[2]
  ];

  // ÉTAPE 3 : On applique la matrice de perspective à distance d = .5vh au point X

  // Cette matrice ne change pas x, y et z mais change la 4e coordonnées w.
  // On homogénéise les coordonnées obtenues (en ramenant w à 1, donc en divisant toutes les coordonnées par w)
  const w = 1 - (X1[2] / d);
  X1 = [
    (1 / w) * X1[0],
    (1 / w) * X1[1],
    (1 / w) * X1[2]
  ];

  // ÉTAPE 4 : On convertir les coordonnées du point transformé en coordonnées d'origine (ie écran mappé de [0, 0] à [vw, vh])
  // On applique l'échelle inverse de celle appliquée précédemment
  X1 = [
    X1[0] * 0.5 * vw,
    X1[1] * 0.5 * vh
  ];
  // On applique la translation inverse de celle appliquée précédemment
  X1 = [
    X1[0] + 0.5 * vw,
    X1[1] + 0.5 * vh
  ];

  return X1;
}